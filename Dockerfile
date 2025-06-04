# Gunakan Node.js versi LTS sebagai base image
FROM node:20-alpine

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Instal dependensi proyek
RUN npm install

# Salin sisa kode aplikasi ke dalam container
COPY . .

# Copy .env ke image
COPY .env .env


# Expose port yang digunakan aplikasi Anda (berdasarkan index.js, yaitu 4000)
EXPOSE 4000

# Perintah untuk menjalankan aplikasi Anda
CMD [ "node", "index.js" ] 