// Import model Product
import Products from "../models/produkModel.js";

// GET: Ambil semua produk
async function getProducts(req, res) {
    try {
        const result = await Products.findAll();
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// POST: Tambah produk baru
async function createProduct(req, res) {
    try {
        const inputResult = req.body;
        const newProduct = await Products.create(inputResult);
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// PUT/PATCH: Update produk berdasarkan ID
async function updateProduct(req, res) {
    console.log("Received Body:", req.body); // Debugging

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.set(req.body);
    await product.save();

    return res.status(200).json({
        message: "Product updated successfully",
        data: product
    });
}

// DELETE: Hapus produk berdasarkan ID
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Products.destroy({ where: { id } });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// GET: Ambil produk berdasarkan ID
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// Export semua fungsi
export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
};
