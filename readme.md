# MyRent

Platform manajemen rental (properti, kendaraan, peralatan) — React + Vite (frontend) dan Express.js (backend).

## Struktur

```
frontend/   React 19 + Vite + Tailwind CSS v4
backend/    Express.js API (in-memory store, kontrak OpenAPI)
```

## Menjalankan

### Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
npm test           # test suite kontrak API
```

Kontrak API: [`backend/openapi.yaml`](backend/openapi.yaml) (juga disajikan di `GET /openapi.yaml`).
Detail lain ada di [`backend/README.md`](backend/README.md).

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Dev server Vite sudah mem-proxy semua request `/api/*` ke `http://localhost:3000`,
jadi cukup jalankan backend dan frontend berdampingan.

## Endpoint API

| Method | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/health` | Status service |
| GET | `/api/rentals` | Daftar unit (filter, search, sort, pagination) |
| POST | `/api/rentals` | Tambah unit |
| GET | `/api/rentals/:id` | Detail unit |
| PATCH | `/api/rentals/:id` | Update unit |
| DELETE | `/api/rentals/:id` | Hapus unit |
| GET | `/api/categories` | Kategori + jumlah unit |
| GET | `/api/stats` | Ringkasan dashboard |
