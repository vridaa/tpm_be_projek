import Products from "../models/produkModel.js";
import { getDefaultImageUrl } from "../middleware/UploadMiddleware.js";

// GET: Ambil semua produk
async function getProducts(req, res) {
    try {
        const result = await Products.findAll();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting products:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Gagal mengambil data produk" 
        });
    }
}

// POST: Tambah produk baru dengan upload gambar
async function createProduct(req, res) {
    try {
        const { name, price, description } = req.body;
        
        // Dapatkan URL gambar dari middleware atau gunakan default
        const image_url = req.body.buketImage || getDefaultImageUrl();
        
        // Validasi input
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Nama dan harga produk wajib diisi"
            });
        }

        const newProduct = await Products.create({
            name,
            price: parseFloat(price),
            description: description || null,
            image_url
        });

        res.status(201).json({
            success: true,
            data: newProduct,
            message: "Produk berhasil ditambahkan"
        });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan produk"
        });
    }
}

// PUT/PATCH: Update produk berdasarkan ID
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        
        // Dapatkan produk yang akan diupdate
        const product = await Products.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }

        // Update data produk
        product.name = name || product.name;
        product.price = price ? parseFloat(price) : product.price;
        product.description = description || product.description;
        
        // Jika ada gambar baru diupload
        if (req.body.buketImage) {
            product.image_url = req.body.buketImage;
        }

        await product.save();

        res.status(200).json({
            success: true,
            data: product,
            message: "Produk berhasil diupdate"
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({
            success: false,
            message: "Gagal mengupdate produk"
        });
    }
}

// DELETE: Hapus produk berdasarkan ID
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }

        await Products.destroy({ where: { id } });
        
        res.status(200).json({
            success: true,
            message: "Produk berhasil dihapus"
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus produk"
        });
    }
}

// GET: Ambil produk berdasarkan ID
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error getting product:", error.message);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil detail produk"
        });
    }
}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
};