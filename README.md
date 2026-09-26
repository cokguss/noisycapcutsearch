<div align="center">

# Noisy CapCut Template Search

**Cari template CapCut, pratinjau editannya, langsung pakai. Tanpa login.**

Search engine untuk listing template publik CapCut dengan backend Next.js (App Router) yang mengambil data langsung dari endpoint listing CapCut, plus frontend dark-theme mono-industrial dengan cover marquee, pratinjau video on-hover, dan dukungan dua bahasa.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/Lisensi-Personal%20Use-8A2BE2?style=flat-square)

</div>

---

## ✨ Fitur

| Platform | Kemampuan |
|---|---|
| **CapCut** (listing template publik) | Video: cari + pratinjau langsung · Gambar: cari + pratinjau still resolusi penuh · Langsung ke halaman template di capcut.com |

**Fitur umum:**

- 🔎 Pencarian template video & gambar per kata kunci, antarmuka dua bahasa (EN/ID)
- ▶️ Pratinjau video otomatis saat hover di kartu, plus lightbox dengan kontrol penuh dan tombol salin tautan
- 🚦 Hanya template yang bisa dipratinjau lewat web yang ditampilkan; yang tanpa media dibuang di lapisan data
- ⚡ Jalur ambil data langsung dulu (ratusan ms), fallback race paralel ke pool proxy publik bila host ditolak CapCut
- 🧵 Tahan gangguan: payload "sukses tapi kosong" dari WAF CapCut di-retry antar rute, bukan ditampilkan sebagai 0 hasil
- 🌗 Tema terang/gelap mengikuti sistem + toggle manual, preferensi tersimpan di browser
- 🇬🇧🇮🇩 Seluruh UI, FAQ, sampai halaman hukum tersedia dalam bahasa Inggris dan Indonesia
- 📱 Mobile responsive penuh (320px sampai desktop lebar) + `prefers-reduced-motion` dihormati
- 📄 Halaman Kebijakan Privasi & Ketentuan Layanan

---

## 🚀 Menjalankan Secara Lokal

> [!IMPORTANT]
> Butuh **Node.js 18.18+** (disarankan 20+)

```bash
git clone https://github.com/cokguss/noisycapcutsearch.git
cd noisycapcutsearch
npm install
npm run dev
```

Buka **http://localhost:3000**

| Script | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan di port `3000` |
| `npm run build` | Build produksi |
| `npm start` | Menjalankan hasil build produksi |
| `npm run typecheck` | Cek tipe TypeScript |

---

## 🧠 Cara Kerja

```text
┌─────────┐  kata kunci   ┌──────────────────────────────────────────────┐
│ Browser  │ ────────────▶ │ Next.js API route (/api/search)              │
└─────────┘                │                                              │
      ▲                    │  1. cek cache hasil (TTL 5 menit)            │
      │  JSON hasil        │  2. jalur langsung ke capcut.com             │
      └────────────────────│     (tanpa proxy, ratusan ms)                │
                           │  3. host ditolak? race 4 proxy publik        │
                           │     paralel, maks 2 batch, pool bergilir     │
                           │  4. payload kosong = retry, bukan "0 hasil"  │
                           └──────────────────────────────────────────────┘
```

- **Jalur langsung:** dari jaringan perumahan CapCut menjawab dalam ratusan ms; ini jalur utama setiap pencarian.
- **Fallback proxy:** bila IP host diblokir CapCut (khas server datacenter seperti Vercel), 4 proxy publik dilombakan sekaligus, jawaban bersih pertama menang; satu batch gagal, batch kedua jalan.
- **Anti "0 hasil" palsu:** CapCut sesekali membalas `status 1000` dengan data kosong (soft-block per IP). Balikan seperti itu dianggap gagal dan di-retry, dan hasil kosong hanya di-cache 30 detik supaya refresh tidak menampilkan kekosongan basi.
- **Filter pratinjau:** template video tanpa media dibuang sebelum sampai ke UI; template gambar ditampilkan sebagai still resolusi penuh. Yang tampil dijamin bisa dipratinjau.
- **Cache:** hasil pencarian identik di-cache 5 menit di server + header `s-maxage` untuk CDN.

---

## 📁 Struktur Proyek

```text
noisycapcutsearch/
├─ app/
│  ├─ api/search/route.ts  # API pencarian: validasi, cache header, panggil engine
│  ├─ layout.tsx           # font, inisialisasi tema, provider bahasa, grain
│  ├─ page.tsx             # halaman utama (SearchApp)
│  ├─ privacy/page.tsx     # Kebijakan Privasi (EN/ID)
│  └─ terms/page.tsx       # Ketentuan Layanan (EN/ID)
├─ components/
│  ├─ SearchApp.tsx        # orkestrasi state pencarian + layout halaman
│  ├─ Hero.tsx             # headline + form pencarian + cover marquee
│  ├─ SearchForm.tsx       # tab video/gambar, input, chip saran
│  ├─ ResultsSection.tsx   # grid hasil, skeleton, error & empty state
│  ├─ TemplateCard.tsx     # kartu 9:16 dengan pratinjau video on-hover
│  ├─ TemplateLightbox.tsx # pratinjau penuh + "Pakai template" + salin tautan
│  ├─ FaqSection.tsx       # accordion pertanyaan umum
│  ├─ DeveloperSection.tsx # kartu developer + jendela kode animasi
│  └─ ...                  # Nav, Footer, CoverMarquee, ThemeToggle, LegalPage
├─ lib/
│  ├─ capcut.ts            # engine: direct-first + proxy race, cache, mapping hasil
│  ├─ i18n.ts              # kamus EN/ID + dokumen hukum bilingual
│  ├─ types.ts             # tipe Template & SearchPayload
│  └─ format.ts            # format angka (1.2K, 4.8M) & durasi
├─ scripts/probe.mjs       # probe kesehatan endpoint CapCut + pool proxy
└─ package.json
```

---

## ☁️ Deploy

| Kebutuhan | Penjelasan |
|---|---|
| Runtime Node.js | API route berjalan sebagai serverless function (`maxDuration` 60s) |
| Environment var | Tidak ada yang wajib |
| Hosting | Vercel (auto-detect Next.js), atau VPS/Railway/Render via `npm run build` + `npm start` |

1. Push repo ini ke GitHub.
2. Import repo di Vercel, framework Next.js terdeteksi otomatis.
3. Deploy. Tidak perlu konfigurasi tambahan.

> [!NOTE]
> Di hosting datacenter, CapCut bisa menolak IP server. Fallback proxy publik aktif otomatis untuk kasus ini, jadi tidak ada yang perlu diubah. Perilaku endpoint CapCut juga bisa berubah sewaktu-waktu.

---

## ⚠️ Catatan

- © 2026 Noisy. Search engine oleh **Noisy**.
- Bukan produk resmi CapCut maupun ByteDance. Template dan statistiknya berasal dari listing publik capcut.com dan tetap milik kreatornya masing-masing. Lihat [LICENSE.md](LICENSE.md).
- Pratinjau media di-stream dari CDN CapCut; tautan "Pakai template" membuka capcut.com di tab baru.

---

<div align="center">

**Dibuat dengan 💚 — Noisy**

[Telegram](https://t.me/noisy02) · [GitHub](https://github.com/cokguss)

</div>
