# API Whatsapp BOT LP3I Marketing

API Whatsapp LP3I Marketing adalah server backend yang dirancang khusus sebagai bot WhatsApp untuk menangani pesan atau chat secara real-time pada aplikasi di LP3I. Dibangun menggunakan framework Express.js, server ini menyediakan layanan backend yang kuat untuk mengelola interaksi melalui WhatsApp dan fungsi-fungsi terkait penyimpanan data.

## Instalasi Docker Environment

Berikut adalah langkah-langkah untuk menginstal dan menjalankan aplikasi:

1. **Prasyarat:**

  - Pastikan Anda sudah menginstall `NodeJS` di server atau local machine.
  - Pastikan Anda sudah menginstall `Docker CLI`.

2. **Menjalankan Aplikasi:**

  - Buat folder proyek dengan nama `databaselp3i` dan pindah ke direktori proyek.
  - Buat file `docker-compose.yml` dengan konten berikut:


      ```yml
      version: "3.7"
      services:
        web:
          container_name: whatsapp_container
          image: kanglerian/api-whatsapp-lp3i:1.0.0
          ports:
            - "4002:4002"
          restart: unless-stopped
      ```

  - Ganti `<version>` dengan tag yang tersedia di Docker Hub.
  - Jalankan perintah `docker-compose up -d` untuk menjalankan kontainer.

## Cara Pembuatan Docker Image

Berikut adalah langkah-langkah untuk membuat docker image dan mengunggahnya ke Docker Hub:

1. **Persiapan Pembuatan Tag Repository:**

  - Build docker image dengan perintah:


    ```bash
    docker build -t name-docker-images .
    ```

  - Ganti `name-docker-images` sesuai keinginan Anda.
  - Gunakan perintah `tag` untuk menyiapkan image untuk diunggah:


    ```bash
    docker tag name-docker-images nama-pengguna/nama-repository:versi
    ```

  - Ganti `name-docker-images` sesuai keinginan Anda.
  - Ganti `nama-pengguna` dengan akun Docker Hub Anda.
  - Ganti `nama-repository` dengan nama repository yang Anda inginkan.
  - Ganti `versi` dengan versi yang diinginkan.

2. **Persiapan Push Ke Repository:**

  - Unggah image ke Docker Hub dengan perintah:


    ```bash
    docker push nama-pengguna/nama-repositori:versi
    ```

  - Ganti `nama-pengguna`, `nama-repository`, dan `versi` sesuai keinginan Anda.

## Penulis

Penulis: Lerian Febriana, A.Md.Kom

Programmer: Lerian Febriana, A.Md.Kom

  - [Website](https://kanglerian.vercel.app)
  - [Instagram](https://instagram.com/kanglerian)
  - [Github](https://github.com/kanglerian)