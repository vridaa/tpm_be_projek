import { Sequelize } from "sequelize";
import bcrypt from "bcrypt"; // pastikan bcrypt di-import
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foto_profil: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'user',
  timestamps: false,
  freezeTableName: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password, salt); // hash ke password_hash
      }
    }
  }
});

// Menambahkan field virtual 'password' (tidak disimpan di DB)
User.prototype.password = null;

// Method untuk validasi password login
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

export default User;
