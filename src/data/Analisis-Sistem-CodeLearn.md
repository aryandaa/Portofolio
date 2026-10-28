# 🧠 Analisis Menyeluruh Sistem CodeLearn
### Platform Belajar Personal · Obsidian Vault → Static Learning Website

> **Konteks dokumen:** Laporan analisis teknis menyeluruh terhadap sistem **CodeLearn**
> (`learning-web-aryanda`) - platform belajar pribadi berbasis web yang mengubah Markdown
> vault Obsidian menjadi website pembelajaran statis lengkap. Dokumen ini disusun sebagai
> portofolio teknik: berisi arsitektur, fitur, kualitas kode, keamanan, performa, temuan,
> dan rekomendasi. **Seluruh analisis dilakukan tanpa mengubah kode sistem sedikit pun.**

---

## 📑 Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Identitas Proyek](#2-identitas-proyek)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Tech Stack](#4-tech-stack)
5. [Komposisi Codebase](#5-komposisi-codebase)
6. [Analisis Fungsional Fitur Inti](#6-analisis-fungsional-fitur-inti)
7. [Code Editor Interaktif (7 Bahasa)](#7-code-editor-interaktif-7-bahasa)
8. [CySec Tools - 108 Tool Keamanan](#8-cysec-tools--108-tool-keamanan)
9. [OSINT Tools - Workstation Intel Publik](#9-osint-tools--workstation-intel-publik)
10. [Kualitas Data Vault](#10-kualitas-data-vault)
11. [Hasil Pemeriksaan Kesehatan](#11-hasil-pemeriksaan-kesehatan)
12. [Analisis Keamanan](#12-analisis-keamanan)
13. [Analisis Performa & Ukuran](#13-analisis-performa--ukuran)
14. [Temuan & Risiko](#14-temuan--risiko)
15. [Rekomendasi Prioritas](#15-rekomendasi-prioritas)
16. [Kesimpulan](#16-kesimpulan)

---

## 1. Ringkasan Eksekutif

**CodeLearn** adalah *personal learning platform* berbasis web yang dirancang dengan pola
**Content-as-Code**: seluruh materi ditulis sebagai Markdown biasa di Obsidian Vault, lalu
sebuah pipeline parser Node.js mengubahnya menjadi website React statis yang lengkap -
dokumentasi bertingkat, pencarian fuzzy, graph antar-catatan, roadmap belajar bercabang,
code editor interaktif 7 bahasa, hingga workstation keamanan siber (CySec Tools) dengan
**108 tool yang berjalan 100% di browser** (tanpa backend, tanpa database).

| Aspek | Hasil |
|---|---|
| 📄 Total catatan materi | **441 catatan**, 58 folder, 4 bidang (CyberSecurity, DevOps, Jaringan, Pemrograman) |
| 🗺 Roadmap belajar | **30 roadmap**, 11 subskill |
| 🕸 Graph pengetahuan | **441 node**, 396 tautan antar-catatan |
| ⌨️ Code Editor | **7 bahasa** dieksekusi 100% client-side (JS, TS, HTML, CSS, PHP, Python, SQL) |
| 🛡️ CySec Tools | **92 tool** + **16 tool OSINT** = 108 tool, 9 kategori, code-split per kategori |
| ✅ Kesehatan sistem | Typecheck 0 error · registry 0 error · selfcheck crypto 44/44 · selfcheck OSINT 48/48 |
| 🔒 Model keamanan | HTML tersanitasi, sandbox iframe, safety-check anti-bocor markdown di CI |

**Skor kualitas keseluruhan: sangat baik dan stabil.** Arsitektur modular, data-driven,
deterministik, dan diuji dengan test vector standar. Temuan utama berupa potensi bug
*subpath deployment* (gambar wiki-link absolut), 58 masalah konten vault (tautan/gambar
rusak) yang tidak disadari pengguna, serta beberapa item performa/ukuran bundle.

---

## 2. Identitas Proyek

| Atribut | Nilai |
|---|---|
| Nama proyek | CodeLearn |
| Tipe | Web app statis (SPA) - *personal learning platform* |
| Repo | `aryandaa/Learning-Web-Aryanda` (open source) |
| Versi | 0.2.0 |
| Author | M. Aryanda Sanggadiennata (penyedia materi + developer) |
| Hosting | Vercel (static), GitHub Actions untuk sync otomatis |
| Model data | Obsidian Vault (Markdown) sebagai *source of truth*; hasil parsing di-commit |
| Prinsip | **Tanpa backend, tanpa database, tanpa API write** - 100% static |

---

## 3. Arsitektur Sistem

### 3.1 Alur Data End-to-End

```
┌─────────────────────┐        git push         ┌──────────────────────────────┐
│  Obsidian Vault     │ ──────────────────────► │  Vault GitHub Action         │
│  (SOURCE OF TRUTH)  │      repository_dispatch: vault-sync                  │
└─────────────────────┘                          └───────────┬──────────────────┘
                                                             │
                                              ┌──────────────▼──────────────────┐
                                              │  Website GitHub Action          │
                                              │  clone vault → parser pipeline  │
                                              │  → generated/ → public/ → commit│
                                              └──────────────┬──────────────────┘
                                                             ▼
                                              ┌──────────────────────────────┐
                                              │  React static website        │
                                              │  (Vercel auto-deploy)        │
                                              └──────────────────────────────┘
```

**Alur sync otomatis (tiga repositori terhubung):**

1. Materi ditulis di Obsidian → `git push` ke repo vault (`aryandaa/Obsidian-Vault`).
2. Workflow di repo vault mengirim sinyal `repository_dispatch: vault-sync` membawa
   `vaultCommit` (pinned SHA), branch, dan clone URL.
3. Workflow di repo website menerima sinyal → clone vault **pinned ke commit persis**
   (bukan HEAD) → jalankan parser → tulis `generated/` → publish ke `public/` →
   commit otomatis → Vercel redeploy.
4. Keamanan token: `OBSIDIAN_VAULT_TOKEN` (Contents: Read-only) di repo website;
   `WEBSITE_DISPATCH_TOKEN` di repo vault. Token hanya dipakai dalam run script,
   tidak pernah di-echo (double-masking oleh GitHub Actions).

### 3.2 Pipeline Parser - 8 Tahap Modular

Parser (`scripts/parser/`) memproses vault dalam tahapan berurutan dengan
*plugin lifecycle* di setiap tahap:

```
SCAN → VALIDATE → INDEX → RESOLVE → RENDER → COPY ASSETS → WRITE → PUBLISH
```

| Tahap | Modul | Fungsi |
|---|---|---|
| 1. Scan | `scanner.ts` | Snapshot vault sekali saja (markdown, folder, aset) - deterministik, terurut |
| 2. Validate | `validator.ts` | Duplicate document id / path aset = **FATAL** (berhenti) |
| 3. Index | `indexer.ts` | Frontmatter (gray-matter), judul, tag, alias, heading, reading time, excerpt |
| 4. Resolve | `link-resolver.ts` | Lookup wiki-link `[[Note]]`, `[[Note#Section]]`, embed `![[gambar]]`; urutan prev/next (DFS) |
| 5. Render | `renderer.ts` | Markdown → HTML tersanitasi (GFM, task list, KaTeX, highlight.js, callouts, wiki links) |
| 6. Assets | `asset-copier.ts` | Hanya menyalin aset yang **benar-benar direferensikan** (hemat ukuran) |
| 7. Write | `json-writer.ts` | Tulis tree.json, search-index.json, graph.json, roadmaps.json, metadata.json, manifest, warnings |
| 8. Publish | `publisher.ts` | Salin ke `public/docs/` & `public/assets/vault/` + safety check markdown |

**Aturan identitas dokumen** (path vault-relatif ternormalisasi):

```
Pemrograman/PHP/Framework/Laravel/Routing.md  →  pemrograman/php/framework/laravel/routing
```

**Safety guarantees yang dipaksakan kode:**
- Vault hanya **dibaca**; tidak ada penulisan balik ke Obsidian.
- Publisher hanya menyentuh `public/docs/` dan `public/assets/vault/` (file lain aman).
- `syncDir` melakukan mirror in-place (hapus stale) tanpa pernah menghapus direktori target.
- Pemeriksaan di akhir publish: **error fatal jika ada markdown yang bocor ke output**.
- CI juga memvalidasi ulang (6 file artifact wajib ada + jumlah notes > 0).

### 3.3 Plugin Ekosistem

Parser mendukung *plugin lifecycle* (hook `before/after` di 8 tahap) untuk ekstensi masa
depan (flashcards, quiz, statistik, AI summary). Saat ini 5 plugin remark/rehype aktif:

| Plugin | Fungsi |
|---|---|
| `remark-wiki-link` | Wiki links + embed gambar/note Obsidian (tidak memproses dalam code block) |
| `remark-callout` | Callout `> [!note]`, `[!tip]`, `[!warning]`, `[!danger]`, dll. |
| `remark-inline-tags` | Ekstrak tag inline `#tag` (lewati code), hapus dari teks render |
| `rehype-fix-links` | Rewrite link/gambar markdown relatif → URL publik + lacak aset tereferensi |
| `rehype-heading-ids` | ID slug stabil di h1-h6 untuk TOC & anchor `[[Note#Section]]` |

---

## 4. Tech Stack

### Frontend (React SPA)

| Teknologi | Peran |
|---|---|
| React 18 + React Router 6 + TypeScript | UI & routing SPA |
| Vite 8 | Build, code-splitting, base relatif (`./`) untuk subpath |
| Tailwind CSS 3 + @tailwindcss/typography | Styling (palet via CSS variables, dark/light) |
| Fuse.js | Pencarian fuzzy (index lazy-load) |
| d3-force | Visualisasi graph (canvas) |
| lucide-react | Icon set |
| KaTeX | Rendering rumus matematika |
| highlight.js | Syntax highlighting (dokumen + editor) |

### Parser (Node.js, build-time)

| Teknologi | Peran |
|---|---|
| unified / remark / rehype | Pipeline Markdown → HTML |
| remark-gfm, remark-math, remark-parse | GFM, matematika, parser |
| rehype-katex, rehype-highlight, rehype-sanitize | KaTeX, highlight, sanitasi HTML |
| gray-matter | Frontmatter YAML |
| tsx | TypeScript runner CLI |

### Runtime browser (tanpa backend)

| Runtime | Pemakaian |
|---|---|
| **Pyodide** (WASM) | Menjalankan Python di browser, lazy-load dari CDN |
| **php-wasm** (WebAssembly) | Menjalankan PHP, **di-self-host di `public/php-wasm/`** agar MIME `.wasm` benar |
| **sql.js** (WASM) | SQLite di browser, lazy-load dari CDN |

---

## 5. Komposisi Codebase

### 5.1 Statistik

| Bagian | Jumlah |
|---|---|
| Total baris `src/` (React + TS) | **±22.567 baris** |
| Total baris `scripts/` (parser + selfcheck) | **±2.842 baris** |
| Jumlah file `src/` | **117 file** |
| Jumlah halaman/route | **15 route** (8 halaman + sub-route tool) |
| Tool keamanan | **108 tool** (92 CySec + 16 OSINT) |

### 5.2 Struktur Direktori

```
.
├── .github/workflows/sync-docs.yml   # GH Action: vault → generated → public → commit
├── scripts/
│   ├── parse-docs.ts                 # CLI parser (npm run parse)
│   ├── parser/                       # 8-tahap pipeline modular + plugins
│   ├── cysec-selfcheck.ts            # 44 kasus uji kriptografi/parser (npm run cysec:check)
│   ├── osint-selfcheck.ts            # 48 kasus uji OSINT (npm run osint:check)
│   └── validate-registry.ts          # Validasi 1 tool = 1 kategori (npm run validate)
├── src/
│   ├── app/                          # Layout, SiteProvider, ThemeProvider
│   ├── pages/                        # Home, Docs, Document, Search, Graph, Roadmap, Editor
│   ├── components/                   # explorer, document, graph, roadmap, ui
│   ├── services/                     # fetch JSON, pencarian Fuse
│   ├── lib/                          # base path, warna folder, tag colors
│   └── features/
│       ├── cysec-tools/              # 92 tool keamanan (8 kategori, lazy chunks)
│       └── osint/                    # 16 tool OSINT (13 kategori)
├── generated/                        # hasil parser (di-commit): docs/*.json + assets
├── public/                           # hasil publish: docs/, assets/vault/, php-wasm/
├── dist/                             # hasil build produksi (48 MB)
├── index.html · vite.config.ts · tailwind.config.js · vercel.json
└── LaporanUpdate.md                  # handoff report internal
```

---

## 6. Analisis Fungsional Fitur Inti

### 6.1 Dokumentasi Explorer (100% Data-Driven)

- Tree folder **recursive langsung dari struktur vault** - tidak ada hardcode folder.
- Setiap folder otomatis ter-create dari `relativePath` catatan; file `#roadmap` selalu
  diurutkan paling atas (penanda urutan belajar).
- Sidebar desktop collapsible (state di localStorage) + drawer mobile dengan animasi,
  aksesibilitas (ESC menutup, scroll-lock, `aria-expanded`).
- Auto-expand folder induk saat membuka dokumen (`ancestorsOf`).
- Counter jumlah catatan per folder, ikon roadmap, highlight dokumen aktif.

### 6.2 Pencarian Fuzzy (Fuse.js)

- Index `search-index.json` (1,4 MB) dimuat **lazy** hanya saat halaman Search dibuka.
- Bobot field: `title` ×3, `aliases` ×2, `headings` ×2, `tags` ×1, `content` ×1;
  threshold 0.38, `ignoreLocation`.
- Hasil menampilkan judul, folder, dan excerpt (240 karakter) dengan `line-clamp`.

### 6.3 Graph View (d3-force di Canvas)

- Node = seluruh catatan (441), edge = tautan antar-catatan (396, undirected & dedup).
- Interaksi: hover menyorot tetangga, klik membuka catatan, drag, scroll-zoom,
  tombol *Fit* (re-centering via signal), toggle node terisolasi.
- Legenda warna per folder (palet muted: CyberSecurity, DevOps, Jaringan, Pemrograman).

### 6.4 Roadmap Bercabang

- **Dua mode**: grid landing semua subskill (per bidang) dan detail roadmap bercabang.
- File `#roadmap` di vault → `roadmaps.json` (`stepIds` = tautan keluar berurutan).
- `BranchTree` membangun pohon: langkah → file dirujuk → dirujuk lagi (depth 2),
  siklus dicegah `visited set`, dibatasi `MAX_NODES = 160` agar ringan.
- Sidebar kategori, badge subskill (`?sub=` query → deep-link dari halaman lain),
  sort numerik `01_ < 02_` (kompatibel penamaan Obsidian).
- Subskill dihitung case-insensitive (`#Subskill` / `#subskill`).

### 6.5 Sistem Tema Dark/Light

- Default **light** (identitas: putih + hijau muda); dark sebagai alternatif.
- Tema diterapkan via kelas `light`/`dark` di `<html>` + CSS variables untuk seluruh
  palet slate & accent - komponen tidak perlu kelas Tailwind khusus.
- Anti-flash: script inline di `index.html` menerapkan tema sebelum paint.
- Tersimpan di `localStorage` (`lw-theme-v2`), `meta theme-color` ikut berubah.

---

## 7. Code Editor Interaktif (7 Bahasa)

Fitur unggulan: **menulis & mengeksekusi kode 100% di browser, tanpa backend**.
Semua eksekusi terjadi di sandbox; output ditangkap dan dirender di panel terminal/preview.

### 7.1 Matriks Dukungan Bahasa

| Bahasa | Runtime | Mekanisme Eksekusi | Output |
|---|---|---|---|
| **JavaScript** | Sandbox iframe (`sandbox="allow-scripts"`) | Kode disuntik ke `srcdoc` iframe; `console.log/info/warn/error` ditangkap via stub + `window.onerror`; hasil dikirim balik `postMessage` | Log bertipe (log/warn/error) |
| **TypeScript** | Sandbox iframe + kompiler TS | `transpileModule` (target ES2020, module None) → JS → sandbox | Log bertipe |
| **HTML** | Preview iframe | Kode dirender langsung sebagai `srcDoc` | Preview halaman web |
| **CSS** | Preview iframe | CSS dibungkus halaman contoh (`cssPreviewHtml`) agar efek styling terlihat | Preview halaman web |
| **PHP** | **php-wasm** (WASM, self-hosted) | `WebPHP.load('8.0')`; echo/print dirender sebagai halaman web; stderr → error lines | Log + preview web |
| **Python** | **Pyodide** (WASM, CDN) | `runPythonAsync`, stdout/stderr di-capture via `setStdout/setStderr` | Log bertipe |
| **SQL** | **sql.js** (SQLite WASM, CDN) | `db.exec`; hasil query diformat sebagai **tabel ASCII** (lebar kolom otomatis) | Tabel ASCII |

### 7.2 Detail Teknis Menarik

**PHP self-hosted (solusi MIME):** runtime php-wasm di `public/php-wasm/` di-fetch lalu
di-patch saat runtime - konstanta URL `.wasm` dan import loader diganti ke Blob URL
agar berjalan di dev (`vite` melarang ESM dari `/public`) maupun produksi subpath.
Di-cache (`phpWasmPromise`) agar hanya dimuat sekali per sesi.

**Sandbox JS:** iframe `display:none` dengan `sandbox="allow-scripts"` → tidak bisa akses
halaman induk, cookie, maupun localStorage. Timeout **10 detik** untuk mendeteksi
infinite loop.

**Editor UX:**
- Syntax highlighting live via highlight.js core (7 bahasa, register manual - bundle kecil).
- Gutter nomor baris yang sinkron scroll dengan textarea overlay transparan.
- Tombol **Tab** menyisipkan 2 spasi, **Ctrl/Cmd+Enter** untuk Run, **Copy**, **Clear**.
- Status runtime (memuat Pyodide/php-wasm/sql.js), waktu eksekusi dalam ms, jumlah baris output.
- Chunk TypeScript (**3,45 MB**) di-lazy-load hanya saat user menjalankan kode TS.

### 7.3 Evaluasi

- ✅ **Murni frontend** - tidak ada backend; ideal untuk hosting statis gratis.
- ✅ Sandboxing JS benar (isolasi penuh, timeout, capture error).
- ✅ PHP/self-host lebih andal daripada CDN (MIME terkontrol, offline-capable).
- ⚠️ Python & SQL butuh internet saat run pertama (CDN); PHP self-host bebas CDN.
- ⚠️ Chunk TypeScript besar (3,45 MB raw) - satu-satunya kelemahan berat.
- ⚠️ `postMessage(..., '*')` tanpa verifikasi `ev.source` (minor; tidak ada iframe lain di halaman).

---

## 8. CySec Tools - 108 Tool Keamanan

**Cybersecurity Workstation** terisolasi di `src/features/cysec-tools/`: dashboard katalog
+ search global + recently-used/favorites (localStorage) + halaman tool dengan
**lazy-load per kategori** (`import.meta.glob` → 7 chunk terpisah, bundle utama
hanya +~40 KB gzip). Registry **data-driven**: 1 tool = 1 kategori (divalidasi
`npm run validate`).

### 8.1 🔐 Cryptography & Encoding (23 tool)

| Tool | Fungsi |
|---|---|
| Base64 / Base32 / Base16-Hex Encode-Decode | Encoding standar RFC |
| URL / HTML Encode-Decode | Percent-encoding & entity HTML |
| ASCII↔Hex, Binary↔Text, Decimal↔Hex | Konversi radix |
| ROT13 / ROT47 / Caesar Cipher | Cipher klasik |
| XOR Calculator / XOR Text | XOR byte/teks + key |
| **AES** Encrypt/Decrypt | AES-256-GCM/CBC via **Web Crypto API** (key dari PBKDF2) |
| **ChaCha20** (Edukasi) | Implementasi murni TS, verified RFC 8439 |
| **RSA** (Edukasional) | Textbook RSA kunci kecil (disclaimer: tidak untuk produksi) |
| Hash Generator | SHA-1/256/384/512, MD5, SHA-3 via Web Crypto |
| HMAC / PBKDF2 | MAC & key derivation via Web Crypto |
| UUID / Random Bytes | Generator acak kriptografis |
| SHA-3 (Keccak) | Implementasi Keccak murni TS (NIST vectors) |
| **Cyber Encoding Pipeline** | Pipeline encoding berantai ala CyberChef (Base64→Hex→URL→XOR→ROT→Caesar) |

### 8.2 🧪 Digital Forensics (12 tool)

File Metadata Viewer · File Hash Calculator (SHA-256/1/MD5 lokal) · File Signature/Magic
Number · MIME Type Detector · File Hex Viewer · Strings Extractor (ASCII/UTF-16LE) ·
**Entropy Analyzer** (Shannon + histogram byte) · Timestamp Inspector · **EXIF Viewer**
(kamera, GPS, software) · PDF Metadata · ZIP Archive Metadata · File/Hash Comparison.

### 8.3 🌐 PCAP & Network Analysis (1 tool)

**PCAP Analyzer** - parsing `.pcap`/`.pcapng` **penuh di browser**:
summary, packet list, protocol distribution, conversations, DNS queries, HTTP, TLS,
TCP flags, hosts, timeline, deteksi suspicious. Parser ditulis manual dan diuji
dengan pcap sintetik (PCAP klasik 3 paket + PCAPNG 1 paket, byte-per-byte).

### 8.4 ⚙️ Reverse Engineering (15 tool)

Hex Viewer · Hex Editor (ringan) · Binary Viewer · Byte Frequency Analyzer ·
ASCII Viewer · UTF-8 Decoder · UTF-16 Decoder · Binary↔Hex · Integer Converter
(signed/unsigned, endian) · Endianness Converter · XOR Byte Analyzer (brute-force
single-byte + skor bahasa) · **PE Header Viewer** (DOS/COFF/optional/sections/imports) ·
**ELF Header Viewer** · **Mach-O Header Viewer** (partial: header dasar 64-bit LE) ·
Printable Strings Scanner.

### 8.5 🛡️ Web Security (19 tool)

URL Parser · Query Parameter Parser · **JWT Decoder/Inspector** (verifikasi HS* via
Web Crypto) · HTTP Header Analyzer · Cookie Analyzer (flag HttpOnly/Secure/SameSite) ·
User-Agent Parser · CSP Analyzer · CORS Analyzer · Security Headers Checker (skor) ·
HTML Entity · JS URI Decoder (deteksi obfuscation) · URL Normalization Analyzer ·
Open Redirect Analyzer · Path Traversal Analyzer · SQLi Payload Analyzer ·
XSS Payload Analyzer · Regex Tester (+ analisis **ReDoS risk**) · HTTP Request/Response Formatter.

### 8.6 🚩 CTF & Security Research (21 tool)

Caesar Decoder (brute-force 25 shift + skor bahasa) · ROT Decoder · XOR Solver ·
Base64 Detector · Encoding Detector · Frequency Analyzer · Substitution Cipher Helper ·
Vigenère · Rail Fence · Atbash · Morse · Bacon · Unicode Analyzer · Timestamp Converter ·
IP Converter · IPv4 Subnet Calculator · CIDR Calculator · Port Reference ·
ASCII Table · Unicode Table · **CVE Reference** (parser CVE: CVSS, severity, CWE, tautan NVD/MITRE).

### 8.7 📋 Log Analysis (1 tool)

**Log Analyzer** - Apache/Nginx access log + auth.log + log generik: ekstraksi IP/status,
deteksi **brute-force**, **404 flood**, timeline, top host, pola mencurigakan.

### 8.8 Evaluasi CySec Tools

- ✅ **108 tool tanpa satu dependency baru** - kriptografi inti (MD5, SHA-3, ChaCha20,
  PBKDF2) ditulis manual dan diverifikasi test vector.
- ✅ Code-split per kategori - bundle utama tetap ramping.
- ✅ Selfcheck regression (44 kasus) menjamin parser file (PCAP/PE/ELF/EXIF) tidak rusak.
- ✅ Disclaimer edukasi & PrivacyBadge di setiap tool yang sensitif.
- ⚠️ Tool `status: 'partial'`/`'unavailable'` masih ada (mis. Mach-O) - ditandai jujur di UI.
- ⚠️ Implementasi RSA/ChaCha20 edukasional - ada disclaimer tegas (bukan untuk produksi).

---

## 9. OSINT Tools - Workstation Intel Publik

Modul OSINT terintegrasi sebagai kategori di dalam CySec Tools (`/cysec-tools/category/osint`,
route legacy `/osint/:toolId` dialihkan). **16 tool**, semua client-side; integrasi
eksternal hanya ke API publik CORS-friendly (DoH, ipwho.is, crt.sh) - tanpa secret/key.

| Kategori | Tool | Privasi |
|---|---|---|
| 🌐 Domain Intelligence | Domain Analyzer (registrable, TLD, IDN/punycode) | hybrid |
| 🧭 DNS Intelligence | DNS Analyzer via DoH (Cloudflare/Google: A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, PTR) | external |
| 📡 IP Intelligence | IP Analyzer (klasifikasi IPv4/IPv6: private/loopback/multicast + ASN/negara) | hybrid |
| 🔗 URL Intelligence | URL Analyzer (parse, decode bertingkat, deteksi phishing/shortener) | local |
| 👤 Username OSINT | Username Analyzer (presence platform publik, template manual) | local |
| ✉️ Email Intelligence | Email Analyzer (validasi, disposable-domain lokal, role-based) | local |
| 📄 Metadata Analysis | Metadata Analyzer (EXIF/GPS, PDF author, Office, ZIP, hash - 100% lokal) | local |
| 🩸 IOC Extraction | IOC Extractor (IP, domain, URL, email, hash, CVE, ATT&CK, MAC - dedup + confidence) | local |
| ☠️ Threat Intelligence | Threat Intel Hub (lookup VT, AbuseIPDB, URLScan, OTX, MalwareBazaar) | local |
| #️⃣ Hash Intelligence | Hash Analyzer (deteksi MD5/SHA-1/256/512/NTLM/scrypt/SHA3-384) | local |
| 📝 Text Intelligence | Text Analyzer (stats, ekstraksi entitas, regex, normalize, dedup) | local |
| 🕐 Timeline Analyzer | Deteksi/normalisasi timestamp → ISO 8601 + visual timeline | local |
| 📜 Certificate Intelligence | Certificate Transparency via crt.sh (CN, issuer, SAN → subdomain) + fallback paste JSON | external |
| 🗂️ OSINT Workspace | Kumpulan IOC ter-tag, export, localStorage | local |
| 📁 OSINT Case | Case investigasi lokal (IOC, notes, sources, timeline; export/import JSON) | local |
| 🔍 Google Dork Search | Query builder visual (site, inurl, intitle, filetype, before/after, OR, exclude) | local |

**Etika & legalitas:** disclaimer tegas di seluruh tool - modul untuk pembelajaran, CTF,
forensik, dan analisis defensif; melarang doxxing/credential attack. Tidak ada
scraping otomatis; username presence selalu *manual verification*.

---

## 10. Kualitas Data Vault

### 10.1 Statistik Konten (dari `metadata.json`)

| Metrik | Nilai |
|---|---|
| Total notes | **441** |
| Total folders | **58** |
| Subskill (`#Subskill`) | 11 |
| Bidang (`#Myskill`) | 4 |
| Total waktu baca seluruh materi | **±19,9 jam** (rata-rata 2,7 menit/note) |
| Roadmaps | 30 |
| Graph edges | 396 (441 node) |
| Aset gambar tereferensi | 221 (dari vault, hanya yang dipakai) |
| Ukuran index pencarian | 1.415 KB (isi konten 1,13 MB) |
| Ukuran seluruh JSON dokumen | 4,51 MB |

### 10.2 Sebaran Bidang

| Bidang | Isi |
|---|---|
| **Pemrograman** | Fundamental, HTML, CSS, JavaScript (Dasar/Advanced/Frontend/Backend + React), Python, PHP + Laravel + Filament, Rancangan Software, Vibe Coding |
| **CyberSecurity** | Cryptography (Classic/Modern/Modular), Forensic (Evidence, Storage & File System, Tools), CTF |
| **DevOps** | Cloud Dasar (AWS), Docker Basic, (…lanjutan) |
| **Jaringan** | Hardware Basic, Jaringan Basic (IP, subnet mask, addressing) |

### 10.3 Kesehatan Link (`warnings.json`)

| Kategori | Jumlah | Contoh |
|---|---|---|
| Duplicate paths | 0 | - |
| Broken wiki links | **40** | `Cryptography.md → 1. Pengenalan.md` (file tak ada) |
| Missing images | **18** | `Praktek Environment Variabel.md → imf/Pasted image...png` |
| Malformed frontmatter | 0 | - |
| Unsupported embeds | 0 | - |

> ⚠️ `warnings.json` dihasilkan & di-commit, namun **belum ditampilkan di UI** -
> masalah konten ini tidak terlihat pengguna (link dirender `href="#"`, gambar jadi ikon rusak).

---

## 11. Hasil Pemeriksaan Kesehatan

Semua pemeriksaan dijalankan **read-only** (tanpa mengubah kode):

| Pemeriksaan | Perintah | Hasil |
|---|---|---|
| Typecheck TypeScript | `npm run check` (`tsc --noEmit`) | ✅ **0 error** |
| Validasi registry tool | `npm run validate` | ✅ **0 error, 0 warning** · 108 tool, 1 tool = 1 kategori |
| Regression kriptografi & parser | `npm run cysec:check` | ✅ **44 pass / 0 fail** |
| Regression OSINT | `npm run osint:check` | ✅ **48 pass / 0 fail** |
| Git state | `git status` | ✅ Bersih, semua ter-commit |

### Detail selfcheck kriptografi (44 kasus)

- **MD5** - vektor standar (`""`, `"abc"`, quick brown fox) ✅
- **SHA-3 Keccak** - NIST vectors 224/256/512 ✅
- **ChaCha20** - RFC 8439 §2.4.2 (64-byte message) + round-trip ✅
- **Encoding** - base32, URL, HTML entity, ROT13/47, Atbash, Morse, Bacon, Rail Fence, Vigenère ✅
- **Analysis** - entropy, strings extraction, magic number PDF ✅
- **PCAP & PCAPNG** - sintetik byte-per-byte: format, packet count, DNS, DHCP, linktype ✅
- **PE / ELF / Mach-O** - valid/invalid cases; PE penuh (machine, magic, section, entry) ✅
- **EXIF** - sintetik JPEG: Make, Model, DateTime ✅
- **Log analyzer** - apache/auth detection, brute-force, 404 flood ✅
- **JWT** - parse, claim exp, invalid format ✅
- **Fitur baru** - subnet IPv4/IPv6, split /24→/26, hex inspector, ReDoS regex risk, entropy blok, pipeline encoding ✅

### Detail selfcheck OSINT (48 kasus)

Domain (registrable multi-part TLD, www subdomain, tolak IP) · IP (private/loopback/
documentation IPv4+IPv6) · Email (disposable, role-based) · IOC extraction (dedup, count,
MAC + confidence + line) · Hash (MD5/SHA-1/256/512/SHA-224/SHA3-384/scrypt) · Text stats ·
Timeline ISO · URL intel (userinfo, open redirect, shortener) · Username platform ·
**Google Dork builder** (12 kombinasi operator) · DNS text parser (A/MX) ✅

---

## 12. Analisis Keamanan

### 12.1 Postur Keamanan (kuat)

| Lapisan | Mekanisme |
|---|---|
| **XSS konten** | Semua HTML hasil parse disanitasi `rehype-sanitize` (allowlist tags/attrs/protocols) sebelum dirender via `dangerouslySetInnerHTML` |
| **Eksekusi kode** | Sandbox iframe (`allow-scripts`, tanpa allow-same-origin) - kode user tidak bisa akses halaman induk/cookie/localStorage |
| **Integritas output** | Safety check CI: 0 markdown boleh bocor ke `public/`; duplicate id = fatal di parser |
| **Publish terisolasi** | Publisher hanya menyentuh 2 direktori; sync mirror tidak menghapus direktori target |
| **Secrets** | Fine-grained PAT read-only; token tidak pernah di-echo; GitHub Actions mask |
| **Supply chain** | `npm ci` (lockfile); hanya dependency standar; tidak ada dependency berbahaya |
| **Penulisan balik** | Vault read-only; tidak ada API write sama sekali |

### 12.2 Catatan

- Sanitize schema mengizinkan `style` pada span/div dan `clobberPrefix: ''` -
  aman untuk vault pribadi, namun tidak untuk vault publik yang tidak tepercaya.
- `postMessage(..., '*')` tanpa cek `ev.source` (minor - tidak ada iframe pihak ketiga).
- Tool kriptografi edukasional (RSA, ChaCha20) punya disclaimer tegas; AES/HMAC/PBKDF2
  memakai **Web Crypto API** (implementasi browser yang di-audit).

---

## 13. Analisis Performa & Ukuran

### 13.1 Bundle & Chunk

| Item | Ukuran | Catatan |
|---|---|---|
| Bundle utama `index-*.js` | **441 KB** (raw) | gzip ±120 KB |
| CSS `index-*.css` | 106 KB | - |
| Chunk **TypeScript** (editor) | **3,45 MB** (raw) | Lazy-load hanya saat Run TS; satu-satunya chunk besar |
| Chunk per kategori CySec | 33-57 KB | 7 chunk terpisah (crypto, forensics, pcap, re, web, ctf, log) |
| KaTeX fonts | 30-64 KB × 10 | Font dirender dari bundle |
| **Total `dist/`** | **48 MB** | Termasuk full docs JSON (4,5 MB), 226 aset, php-wasm (~5 MB) |

### 13.2 Strategi Loading

| Data | Strategi |
|---|---|
| `tree.json` + `metadata.json` | Dimuat sekali di awal (SiteProvider) |
| `search-index.json` (1,4 MB) | **Lazy** - hanya saat halaman Search |
| `graph.json`, `roadmaps.json` | **Lazy** per halaman |
| Dokumen individual | **On-demand** per dokumen (4,5 MB total, dibagi 441 file) |
| Runtime Python/PHP/SQL | **Lazy** + cache sekali per sesi |
| Chunk tool CySec | **Lazy per kategori** |

### 13.3 Catatan Kinerja

- Scanner membaca seluruh file non-markdown ke memori untuk hashing (2× baca untuk
  aset tereferensi: scan + copy). Aman untuk vault tipikal, bisa lambat jika vault
  berisi video/ISO besar.
- Output parser deterministik (sorted, reproducible) - `generatedAt` satu-satunya
  nilai non-deterministik (wajar).
- Estimasi baca di beranda (`totalNotes / 200 jam`) menghasilkan **2 jam**, padahal
  reading time aktual **±20 jam** - formula menyesatkan (temuan).

---

## 14. Temuan & Risiko

### 🔴 Tinggi - berdampak nyata

| # | Temuan | Dampak |
|---|---|---|
| 1 | **Klaim subpath deployment tidak sepenuhnya benar** - URL aset hasil parse di-bake absolut (`/assets/vault/...`); tag `<base>` tidak menyelamatkan URL path-absolute | Di GitHub Pages (`user.github.io/repo/`) semua gambar 404; wiki-link & deep-link juga pecah. Berfungsi penuh hanya di Vercel root |
| 2 | **Tidak ada `public/404.html`** | Deep-link SPA di host tanpa rewrite (GitHub Pages) = 404 |
| 3 | **58 masalah konten vault** (40 broken links + 18 gambar hilang) tidak tampil di UI | Pengguna melihat link `href="#"` & ikon gambar rusak tanpa penjelasan |

### 🟡 Sedang - kualitas & konsistensi

| # | Temuan |
|---|---|
| 4 | Estimasi baca beranda menyesatkan (2 jam vs aktual ±20 jam) |
| 5 | `warnings.json` di-commit tapi tidak pernah dibaca frontend (fitur mati) |
| 6 | Chunk TypeScript 3,45 MB - berat untuk sekali fitur Run TS |
| 7 | `dist/` 48 MB - boros untuk hosting statis (docs JSON + aset + php-wasm) |
| 8 | Dokumen internal stale: `LaporanUpdate.md` masih menyebut konsep `alsoIn` (sudah diganti 1 tool = 1 kategori); komentar `base.ts` & README daftar route 7 (aktual 9) |
| 9 | Data `generatedAt: 2026-08-16` lebih tua dari commit kode terakhir - sinkronisasi data vs kode tidak sinkron sempurna |

### 🟢 Rendah - minor

| # | Temuan |
|---|---|
| 10 | Gambar yang hilang dibiarkan `src` relatif tak terselesaikan (ikon rusak) alih-alih dihapus |
| 11 | `postMessage(..., '*')` tanpa verifikasi `ev.source` |
| 12 | Sanitize mengizinkan `style` & `clobberPrefix: ''` (aman untuk vault pribadi) |
| 13 | Subskill "Html" 0 roadmap; ada duplikasi `src` gambar pada 1 dokumen |
| 14 | Tidak ada unit test untuk komponen React (hanya util murni) |
| 15 | Tidak ada CI check untuk PR frontend (check manual) |

---

## 15. Rekomendasi Prioritas

| Prioritas | Rekomendasi |
|---|---|
| **P1** | Ubah `assetPublicPrefix` & href wiki-link menjadi relatif terhadap root app (atau rewrite runtime) + tambah `404.html` → subpath GitHub Pages benar-benar berfungsi |
| **P1** | Tampilkan `warnings.json` di UI (badge "58 masalah konten" di halaman docs) agar masalah vault terlihat |
| **P2** | Perbaiki formula estimasi baca memakai sum `readingTime` aktual |
| **P2** | Renderer: hapus `src` gambar yang gagal resolve (hindari ikon rusak) |
| **P2** | Kecilkan chunk TypeScript (split transpileModule-only / worker) |
| **P3** | Update dokumen internal (LaporanUpdate.md, README, komentar base.ts) |
| **P3** | Tambah CI check `npm run check` + `npm run validate` di GitHub Actions |
| **P4** | Unit test komponen React inti (DocumentViewer, TreeExplorer, BranchTree) |

---

## 16. Kesimpulan

**CodeLearn adalah sistem pembelajaran personal kelas produksi dengan kualitas arsitektur
di atas rata-rata proyek personal:**

1. **Arsitektur yang bersih & aman** - parser 8 tahap modular dengan plugin lifecycle,
   deterministik, data-driven penuh, dan safety guarantee di setiap lapisan
   (sanitasi HTML, sandbox eksekusi, anti-bocor markdown, validasi fatal).
2. **Ruang lingkup yang luas** - dari dokumentasi statis biasa, berkembang menjadi
   ekosistem lengkap: graph pengetahuan, roadmap bercabang, code editor multi-bahasa
   tanpa backend, dan workstation keamanan 108 tool yang semuanya berjalan di browser.
3. **Diuji, bukan sekadar jalan** - kriptografi diverifikasi terhadap test vector resmi
   (RFC 8439, NIST, MD5), parser biner (PCAP/PE/ELF/EXIF) diuji dengan data sintetik
   byte-per-byte, dan registry dijamin konsisten oleh validator khusus.
4. **Temuan utama** berpusat pada kesenjangan antara klaim dokumentasi (subpath
   deployment) dan implementasi, plus kebersihan konten vault yang belum disadari
   pengguna - bukan pada cacat arsitektur fundamental.

Secara keseluruhan: **sistem stabil, teruji, dan siap dipakai serta dikembangkan
lebih lanjut** - dengan rekomendasi perbaikan yang jelas, kecil, dan terprioritas.

---

*Dokumen ini dibuat sebagai portofolio teknis. Seluruh analisis dilakukan dengan
pemeriksaan read-only (tidak ada kode sistem yang diubah).*

- **M. Aryanda Sanggadiennata** · CodeLearn
