# MyRent API (backend)

Backend Express.js untuk platform manajemen rental MyRent.

## Menjalankan

```bash
cd backend
npm install
npm run dev     # development dengan auto-reload (node --watch)
npm start       # production
npm test        # jalankan test suite (node:test, tanpa dependensi ekstra)
```

Server berjalan di `http://localhost:3000` (atur lewat `PORT`, lihat `.env.example`).

## Dokumentasi

Kontrak API ada di [`openapi.yaml`](./openapi.yaml) dan juga dilayani langsung oleh server
di `http://localhost:3000/openapi.yaml`. Daftar endpoint tersedia di `GET /`.

## Endpoint

| Method | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/health` | Status service (readiness/liveness) |
| GET | `/api/rentals` | Daftar unit — filter `category`, `status`, `search`, `sort`, `order`, `page`, `limit` |
| POST | `/api/rentals` | Tambah unit baru |
| GET | `/api/rentals/:id` | Detail unit |
| PATCH | `/api/rentals/:id` | Update sebagian field |
| DELETE | `/api/rentals/:id` | Hapus unit |
| GET | `/api/categories` | Kategori + jumlah unit |
| GET | `/api/stats` | Ringkasan dashboard |

## Struktur

```
src/
  index.js              # bootstrap server
  app.js                # perakitan Express app (middleware + routes)
  config.js             # port, CORS, env
  data/seed.js          # data seed rental
  store/rentals.js      # penyimpanan in-memory (ganti dengan DB di sini)
  lib/                  # konstanta, error, validasi
  middleware/           # request id, logger, error handler
  routes/               # health, rentals, categories, stats
test/api.test.js        # test kontrak end-to-end
```

Catatan: penyimpanan masih in-memory (data kembali ke seed setiap restart).
Semua akses data lewat `src/store/rentals.js`, sehingga migrasi ke database
(SQLite/Postgres/Mongo) hanya mengganti file tersebut tanpa mengubah route.
