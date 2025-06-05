// ===================================
// Middleware Upload File ke Google Cloud Storage
// ===================================
// Fungsi: Menangani upload file (terutama gambar) ke Google Cloud Storage
// Fitur:
// 1. Validasi tipe file (hanya gambar)
// 2. Batasan ukuran (maksimal 5MB)
// 3. Upload ke Google Cloud Storage
// 4. Generate URL publik untuk akses file

import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// ==================== KONFIGURASI GCS ====================
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// ==================== KONFIGURASI MULTER ====================
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Konfigurasi untuk berbagai jenis upload
const uploadConfig = {
  profilePicture: multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('profilePicture'),
  
  buketImage: multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single('image'),
};

// ==================== HELPER FUNCTIONS ====================
const getDefaultImageUrl = () => {
  return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/assets/image-placeholder.jpg`;
};

const deleteFileFromGCS = async (filename) => {
  try {
    await bucket.file(filename).delete();
    return true;
  } catch (error) {
    console.error('Gagal menghapus file dari GCS:', error);
    return false;
  }
};

const generateFilename = (type, id) => {
  const ext = req.file.originalname.split('.').pop();
  switch (type) {
    case 'profilePicture':
      return `profile_pictures/user_${id}_${Date.now()}.${ext}`;
    case 'buketImage':
      return `buket_images/buket_${id}_${Date.now()}.${ext}`;
    default:
      throw new Error('Tipe upload tidak valid');
  }
};

// ==================== MIDDLEWARE UPLOAD ====================
export const uploadImage = (type) => async (req, res, next) => {
  // Validasi tipe upload
  const validTypes = ['profilePicture', 'buketImage'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      success: false,
      message: 'Tipe upload tidak valid. Gunakan profilePicture atau buketImage'
    });
  }

  // Eksekusi upload sesuai konfigurasi
  uploadConfig[type](req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          success: false,
          message: `Error upload: ${err.message}`
        });
      }
      return res.status(500).json({ 
        success: false,
        message: `Error: ${err.message}`
      });
    }

    // Jika tidak ada file diupload, lanjutkan
    if (!req.file) return next();

    try {
      // Generate nama file unik
      const filename = `${type}/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
      const blob = bucket.file(filename);

      // Upload ke GCS
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype
        }
      });

      blobStream.on('error', (error) => {
        console.error('Error upload ke GCS:', error);
        return res.status(500).json({
          success: false,
          message: 'Gagal mengupload file ke server'
        });
      });

      blobStream.on('finish', () => {
        // Set URL publik ke request body
        req.body[type] = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        next();
      });

      blobStream.end(req.file.buffer);
    } catch (error) {
      console.error('Error proses upload:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memproses file'
      });
    }
  });
};

// ==================== EXPORT ====================
export default {
  uploadImage,
  deleteFileFromGCS,
  getDefaultImageUrl,
  generateFilename,
  bucket
};