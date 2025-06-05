// ===================================
// Middleware Upload File ke Google Cloud Storage
// ===================================
// Fungsi: Menangani upload file (terutama gambar) ke Google Cloud Storage
// Fitur:
// 1. Validasi tipe file (hanya gambar)
// 2. Batasan ukuran (maksimal 5MB)
// 3. Upload ke Google Cloud Storage
// 4. Generate URL publik untuk akses file

// Import library yang dibutuhkan
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config(); // Ensure dotenv is configured to load environment variables

// === Tahap 1: Konfigurasi Google Cloud Storage ===
// Inisialisasi koneksi ke Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS // Opsional: jika menggunakan service account key file di lokal
});

// Pilih bucket yang akan digunakan
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// === Tahap 2: Konfigurasi Multer ===
// Setup penyimpanan file sementara di memory
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Filter untuk memastikan hanya file gambar yang diterima
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('File bukan gambar! Silakan upload gambar.'), false);
  }
};

// Konfigurasi upload untuk berbagai jenis file
// Setiap konfigurasi:
// - Menggunakan memory storage
// - Memiliki filter tipe file
// - Batasan ukuran 5MB
const uploadConfig = {
  // Upload foto profil
  profilePicture: multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
  }).single('profilePicture'),
  
  // Upload foto candi
  buketImage: multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
  }).single('image'),
};

// === Tahap 3: Helper Functions ===
// Mendapatkan URL gambar default jika tidak ada upload
const getDefaultImageUrl = () => {
  return `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/assets/image-placeholder.jpg`;
};

// Menghapus file dari Google Cloud Storage
const deleteFileFromGCS = async (filename) => {
  try {
    await bucket.file(filename).delete();
    return true;
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    return false;
  }
};

// Generate nama file berdasarkan tipe dan ID
const getFilename = (type, id) => {
  const extension = '.jpg';
  switch (type) {
    case 'profilePicture':
      return `assets/profilepicture/pp-${id}${extension}`;
    case 'buketImage':
      return `assets/buketimage/buket-${id}${extension}`;
    default:
      throw new Error('Invalid file type');
  }
};

// === Tahap 4: Middleware Upload ke GCS ===
// Middleware utama untuk upload file ke Google Cloud Storage
export const uploadImage = (fieldName) => (req, res, next) => {
  // Gunakan multer.single() dengan fieldName yang diberikan
  upload.single(fieldName)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Tangani kesalahan Multer (misalnya, ukuran file terlalu besar, tipe file salah)
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      // Tangani kesalahan umum lainnya selama unggahan
      return res.status(500).json({ message: `An unexpected error occurred during file upload: ${err.message}` });
    }

    if (!req.file) {
      // Jika tidak ada file yang diunggah, lanjutkan ke middleware/handler berikutnya
      // Ini memungkinkan pembaruan data tanpa harus mengunggah file baru
      return next();
    }

    // Proses unggahan file ke Google Cloud Storage
    try {
      const uniqueFileName = `${Date.now()}_${req.file.originalname.replace(/ /g, "_")}`;
      const blob = bucket.file(uniqueFileName); // Nama file di GCS

      const blobStream = blob.createWriteStream({
        resumable: false, // Atur ke false untuk unggahan file kecil
        metadata: {
          contentType: req.file.mimetype // Atur tipe konten file
        }
      });

      // Tangani error saat streaming ke GCS
      blobStream.on('error', (err) => {
        console.error('Blob stream error:', err);
        return res.status(500).json({ message: 'Error uploading file to storage.' });
      });

      // Ketika unggahan selesai
      blobStream.on('finish', () => {
        // Buat URL publik untuk file yang diunggah
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        // Tambahkan URL publik ke req.body dengan nama field yang sesuai
        req.body[fieldName] = publicUrl;
        next(); // Lanjutkan ke middleware/handler berikutnya
      });

      // Akhiri stream dengan buffer file
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.error('Error in GCS upload process:', error);
      return res.status(500).json({ message: 'Error processing file upload to Google Cloud Storage.' });
    }
  });
};

// Export semua fungsi yang dibutuhkan
module.exports = {
  uploadConfig,      // Konfigurasi upload untuk berbagai tipe file
  uploadToGCS,       // Middleware upload ke Google Cloud Storage
  deleteFileFromGCS, // Fungsi untuk menghapus file
  getFilename,       // Fungsi untuk generate nama file
  bucket,           // Instance bucket GCS
  getDefaultImageUrl // Fungsi untuk mendapatkan URL default
}; 