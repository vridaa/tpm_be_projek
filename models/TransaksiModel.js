import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define('transaksi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  metode_pembayaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alamat_pengiriman: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  waktu_pengiriman: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tracking_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false, // Nonaktifkan timestamps otomatis Sequelize
  tableName: 'transaksi',
  freezeTableName: true
});

export default Transaksi;