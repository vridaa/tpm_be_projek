import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Produk = db.define(
  "produk",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  },
  {
timestamps: true, // Tetap aktifkan timestamps
  createdAt: 'created_at', // Sesuaikan dengan nama kolom di database
  updatedAt: 'updated_at',
  tableName: 'produk',
  }
);

db.sync().then(() => console.log("Tabel produk tersinkron."));

export default Produk;
