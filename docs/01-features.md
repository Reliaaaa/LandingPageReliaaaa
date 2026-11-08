# Rencana fitur portofolio Varellio Louis Tinangon

Dokumen ini memecah kebutuhan halaman portofolio satu halaman menjadi pekerjaan kecil. P0 adalah MVP, P1 peningkatan setelah MVP, dan P2 pengembangan berikutnya. Prioritas menyatakan target, bukan klaim bahwa fitur sudah tersedia. Nama, riwayat, tautan, foto, dan detail karier harus berasal dari materi yang disetujui pemilik; gunakan placeholder yang jelas sampai tersedia.

## MVP — P0

| ID | Fitur | Dependensi | Kriteria penerimaan |
| --- | --- | --- | --- |
| F01 | Struktur satu halaman dan navigasi | Materi bagian yang disetujui | Profil, pengalaman, dan kontak memiliki bagian serta tujuan navigasi yang jelas; tautan navigasi menuju bagian yang benar. |
| F02 | Profil | Konten dan aset pemilik | Nama Varellio Louis Tinangon dan ringkasan yang disetujui tampil jelas; informasi yang belum tersedia ditandai sebagai placeholder, tanpa mengarang data. |
| F03 | Pengalaman | Data pengalaman yang disetujui | Setiap entri menampilkan hanya rincian yang diberikan pemilik; jika data belum ada, tampilkan keadaan kosong yang jelas. |
| F04 | Kontak | Kanal kontak yang disetujui | Pengunjung dapat menemukan kanal kontak yang valid; tautan yang ditampilkan membuka tujuan yang sesuai. |
| F05 | Formulir kontak | F04, F08, F09 | Nama, email, dan pesan divalidasi; pengunjung mendapat status pengiriman berhasil atau gagal dan petunjuk untuk mencoba lagi; keberhasilan hanya ditampilkan setelah API menyimpan pesan. |
| F06 | Tata letak responsif dan aksesibilitas dasar | F01 | Konten dapat dibaca dan digunakan pada layar ponsel, tablet, dan desktop tanpa gulir horizontal yang tidak diperlukan; navigasi dan formulir dapat digunakan dengan keyboard, label serta fokus terlihat. |
| F07 | Mode gelap | F01, F06 | Pengunjung dapat mengganti tema terang dan gelap; teks dan kontrol tetap terbaca pada kedua tema dan pilihan tema tetap ada saat halaman dimuat ulang. |
| F08 | PostgreSQL dan skema | Database PostgreSQL dan konfigurasi lingkungan | Skema diterapkan secara eksplisit sebelum API digunakan; pesan kontak dan event tersimpan sesuai skema, kredensial tidak masuk Git, dan koneksi produksi memakai TLS terverifikasi. |
| F09 | API kontak | F08 | Endpoint memvalidasi input, membatasi penyalahgunaan, dan menyimpan pesan dengan query berparameter; respons kesalahan tidak membocorkan rahasia dan tidak ada endpoint publik untuk membaca daftar pesan. |
| F10 | Analytics dasar | F08 | Page view dan peristiwa pengiriman kontak dicatat melalui API secara best effort tanpa menghambat navigasi atau hasil formulir; data event tidak memuat isi pesan, email, query string, atau fragment. |
| F11 | CI GitHub | Repositori dan lockfile | Pull request ke `dev` atau `main`, serta push ke kedua cabang, menjalankan instalasi terkunci, lint, tes, dan build; kegagalan terlihat pada status pemeriksaan. |
| F12 | Rilis Vercel | F08–F11, konfigurasi layanan | Build produksi berhasil; setelah integrasi dikonfigurasi, `main` menjadi cabang produksi dan PR dapat memperoleh preview; variabel lingkungan disetel di Vercel dan endpoint diuji pada deployment. |

MVP dianggap siap ketika F01–F12 memenuhi kriteria, konten yang dipublikasikan disetujui pemilik, dan konfigurasi layanan eksternal telah diverifikasi. F08–F10 memerlukan database dan rahasia yang dikonfigurasi; CI dan deployment otomatis memerlukan pengaturan GitHub/Vercel di luar repositori.

## Peningkatan — P1

| ID | Fitur | Dependensi | Kriteria penerimaan |
| --- | --- | --- | --- |
| F13 | Motion antarmuka | F01, F06 | Transisi membantu memahami interaksi tanpa menghalangi penggunaan; preferensi `prefers-reduced-motion` dihormati. |
| F14 | Ringkasan analytics terlindungi | F10 | Operator dengan bearer token dapat melihat agregat 30 hari; permintaan tanpa token valid ditolak dan token tidak dikirim ke frontend publik. |
| F15 | Ketahanan dan operasional data | F08, F09 | Backup terenkripsi dan pemulihan diuji, akses operator dibatasi, serta kebijakan retensi dan penghapusan pesan didokumentasikan. |
| F16 | Penyempurnaan penemuan halaman | F02 | Judul dan deskripsi halaman sesuai konten yang disetujui; metadata berbagi menampilkan informasi yang benar. |

## Pengembangan berikutnya — P2

| ID | Fitur | Dependensi | Kriteria penerimaan |
| --- | --- | --- | --- |
| F17 | Bagian proyek atau karya | Materi karya yang disetujui, F01 | Setiap karya yang dipublikasikan memiliki deskripsi dan tautan yang telah diverifikasi pemilik; bagian dapat disembunyikan bila materi belum tersedia. |
| F18 | Dukungan bahasa tambahan | Konten terjemahan yang disetujui, F01–F05 | Pengunjung dapat memilih bahasa; navigasi, konten, dan pesan formulir tampil konsisten dalam bahasa yang dipilih. |
| F19 | Pelaporan analytics lanjutan | F10, F14, kebutuhan pelaporan | Metrik tambahan dan masa penyimpanan disetujui sebelum implementasi; laporan tetap terlindungi dan tidak mencatat isi kontak atau pengenal pengunjung. |
