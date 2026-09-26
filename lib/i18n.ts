export type Lang = "en" | "id";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const en = {
  nav: {
    tagline: "CapCut template search",
    themeDark: "Switch to light mode",
    themeLight: "Switch to dark mode",
    language: "Language",
  },
  hero: {
    titleA: "Search less.",
    titleB: "Edit more.",
    sub: "Search video and image templates, preview the edit before you commit, and jump straight to the one that fits.",
  },
  search: {
    video: "Video",
    image: "Image",
    both: "All",
    placeholder: "Search templates...",
    submit: "Search",
    submitting: "Searching",
    tryLabel: "Try",
    ariaSearch: "Search templates",
    ariaType: "Template type",
  },
  results: {
    loading: "Hitting the CapCut index",
    noResultsYet: "No results yet",
    resultsIn: "{n} results in {t}s",
    results: "{n} results",
    searchFailed: "Search failed",
    searching: "Searching",
    templatesFor: "Templates for",
    connectionProblem: "Connection problem",
    couldNotReach: "Could not reach CapCut",
    retry: "Retry search",
    nothingFor: "Nothing for",
    emptyBody:
      "CapCut returned no templates for that keyword. Try something broader, or switch between video and image above.",
  },
  faq: {
    eyebrow: "Frequently asked",
    headingA: "Questions,",
    headingB: "answered.",
    lead: "Six things people ask before their first search. Anything else, the footer has the legal pages.",
    items: [
      {
        q: "Where do these templates come from?",
        a: "Noisy queries public CapCut template listings by keyword. Every cover, video, and number you see is returned by CapCut's own listing API and belongs to the creator who published it.",
      },
      {
        q: "Do I need a CapCut account to browse?",
        a: "No. Search, preview, and watch as many templates as you want here without signing in. You only need CapCut when you decide to use a template, which is why that button is the only one that opens capcut.com.",
      },
      {
        q: "How do I actually use a template I like?",
        a: "Click a card to open the preview, watch the full edit, then hit Use template. It opens the template page on capcut.com (or hands off to the CapCut app if you have it installed). From there CapCut walks you through dropping in your own clips.",
      },
      {
        q: "Why does a search take a few seconds?",
        a: "Searches go out directly when CapCut accepts the host, and fall back to a small pool of public proxies when it refuses. Repeats of the same search are cached for five minutes and come back near-instantly.",
      },
      {
        q: "Video previews do not play. What now?",
        a: "Previews stream from CapCut's CDN. If one stalls, hover a card again or open the lightbox and press play on the video controls. On very tight connections, the cover image always loads first so you can still pick by frame.",
      },
      {
        q: "Is Noisy affiliated with CapCut?",
        a: "No. Noisy is an independent search front for public listings. Noisy is not endorsed by or affiliated with CapCut or ByteDance, and it never has access to your CapCut account.",
      },
    ],
  },
  card: {
    preview: "Preview",
  },
  lightbox: {
    close: "Close preview",
    uses: "uses",
    likes: "likes",
    by: "by",
    useTemplate: "Use template",
    copyLink: "Copy link",
    copied: "Copied",
    hint: "Use template opens capcut.com in a new tab.",
    previewLabel: "preview",
    imageNote: "This is an image template, so the preview here is a still.",
  },
  footer: {
    disclaimer:
      "Noisy searches public CapCut template listings. Not affiliated with CapCut or ByteDance. Templates belong to their creators.",
    api: "Search API by Noisy",
    sourced: "Templates sourced from capcut.com",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    wordmark: "Noisy",
  },
  dev: {
    eyebrow: "Developer",
    headingA: "Built by",
    name: "Noisy",
    role: "Developer & maintainer",
    status: "Open for collabs",
    bio: "Builds Noisy, keeps the proxy pool warm, and answers when something breaks. DM for bugs, ideas, or partnerships.",
    telegram: "Telegram",
    channel: "Channel",
    github: "GitHub",
    file: "noisy.ts",
    lang: "TypeScript",
    done: "24 results in 0.4s",
    viewProfile: "Open",
  },
  legal: {
    eyebrow: "Legal",
    back: "Back to search",
    lastUpdated: "Last updated",
    contact:
      "Questions about this document? Reach out through the channel where you found Noisy, and include the section number so it is easy to answer.",
  },
  docs: {
    privacy: {
      title: "Privacy Policy",
      updated: "25 September 2026",
      intro:
        "This policy covers the Noisy website only. It explains in plain language what happens to your data when you search for a CapCut template here.",
      sections: [
        {
          heading: "Summary",
          paragraphs: [
            "Noisy is a free search tool for public CapCut template listings. You do not need an account, we do not sell anything, and we do not profile you. The short version: we process what is required to run a search, we store very little, and we never see your CapCut credentials because we never ask for them.",
            "The longer version below explains exactly what passes through this site and what stays on your device.",
          ],
        },
        {
          heading: "What we process",
          paragraphs: [
            "When you run a search, the keyword and tab you chose are sent to our server so it can query CapCut's public listing API on your behalf. Those queries are handled transiently: they are used to return results, not to build a history of who you are.",
          ],
          bullets: [
            "Your search keyword and selected tab (video or image).",
            "Standard request metadata such as IP address and timestamp, which our host records briefly in server logs for abuse prevention.",
            "Your theme preference (light or dark), which never leaves your browser.",
          ],
        },
        {
          heading: "What we do not collect",
          paragraphs: [
            "Noisy has no accounts and no payment flow, so there is nothing to collect in the usual sense.",
          ],
          bullets: [
            "No names, email addresses, phone numbers, or payment details.",
            "No advertising identifiers and no cross-site tracking.",
            "No record of which templates you opened or used.",
            "No access to your CapCut account, drafts, or media library.",
          ],
        },
        {
          heading: "Search caching",
          paragraphs: [
            "To keep the proxy pool from being hammered, identical searches are cached on the server for five minutes and the proxy list for ten minutes. The cache stores the keyword and the results it returned, nothing else, and it expires on its own.",
          ],
        },
        {
          heading: "Cookies and local storage",
          paragraphs: [
            "Noisy does not set advertising or analytics cookies. The only thing kept on your device is your theme preference in localStorage, which stays in your browser and is never transmitted. Clearing site data removes it.",
          ],
        },
        {
          heading: "Third-party services",
          paragraphs: [
            "Templates are hosted by CapCut, so previews load from their infrastructure. Once media leaves our server, that provider's own privacy policy applies.",
          ],
          bullets: [
            "capcut.com and its CDN: template covers, video previews, and the Use template destination.",
            "The proxy provider used to reach CapCut's listing API: forwards your search request, sees no other data.",
            "Google Fonts: the site's typefaces are served by Google, which receives a standard request for the font files.",
          ],
        },
        {
          heading: "Children's privacy",
          paragraphs: [
            "Noisy is a general-audience tool and is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided personal data through this site, contact us and we will delete it.",
          ],
        },
        {
          heading: "Your rights and changes",
          paragraphs: [
            "Because we hold so little data, there is usually nothing to export or erase. If you want confirmation of anything associated with your IP in our transient logs, ask and we will check and remove it.",
            "If this policy changes materially, the updated date at the top of this page changes with it. Continued use after an update means you accept the revised policy.",
          ],
        },
      ],
    } as LegalDoc,
    terms: {
      title: "Terms of Service",
      updated: "25 September 2026",
      intro:
        "These terms govern your use of Noisy. Short, plain, and no surprises: a free search tool that points you back to CapCut when you find what you want.",
      sections: [
        {
          heading: "Agreement",
          paragraphs: [
            "By accessing or using Noisy, you agree to these terms. If you do not agree with any point below, do not use the site. Using the site after an update to these terms counts as accepting the updated version.",
          ],
        },
        {
          heading: "The service",
          paragraphs: [
            "Noisy is a free search interface for public CapCut template listings. It is provided as-is, with no account, no guarantee of uptime, and no promise that any specific template will be available when you look for it.",
          ],
          bullets: [
            "Features, layout, and supported tabs may change at any time.",
            "Searches depend on a third-party index and a proxy pool, so results can be slow or temporarily unavailable.",
            "There is no paid tier and we will never ask you to pay for access.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "Use Noisy for browsing and discovering templates. The following are not allowed.",
          ],
          bullets: [
            "Hammering the search endpoint with automated requests, scrapers, or scripts that bypass the cache.",
            "Reselling, republishing, or redistributing search results as your own dataset.",
            "Attempting to disrupt, overload, or reverse-engineer the service.",
            "Using results for anything unlawful or to infringe the rights of others.",
          ],
        },
        {
          heading: "Third-party content",
          paragraphs: [
            "Every template, cover, video, and statistic shown by Noisy comes from CapCut's public listings and belongs to CapCut's creators and to CapCut itself. Noisy does not claim ownership of any of it.",
            "When you press Use template you leave Noisy and enter capcut.com or the CapCut app, where CapCut's own terms and policies take over. Preview media is streamed from CapCut's CDN under their terms.",
          ],
        },
        {
          heading: "No affiliation",
          paragraphs: [
            "Noisy is an independent project. It is not affiliated with, endorsed by, sponsored by, or connected to CapCut or ByteDance in any official capacity. CapCut, CapCut logo, and related marks belong to their respective owners.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "The Noisy interface, code, and branding are the site's own work. The search functionality relies on publicly accessible listings, and template rights remain with their creators. If you are a rights holder and want something addressed, contact us with the specific link and we will act on it.",
          ],
        },
        {
          heading: "Disclaimer and liability",
          paragraphs: [
            "Noisy is provided without warranties of any kind, express or implied, including fitness for a particular purpose. We do not warrant that searches will be uninterrupted, that results are accurate, or that any template is safe to use.",
            "To the maximum extent permitted by law, Noisy is not liable for indirect, incidental, or consequential damages arising from your use of the site or from content reached through it.",
          ],
        },
        {
          heading: "Changes and termination",
          paragraphs: [
            "We may modify, suspend, or stop the service at any time. We may also restrict access from IPs that abuse the endpoint. The updated date at the top of this page reflects the current version of these terms.",
          ],
        },
      ],
    } as LegalDoc,
  },
};

const id: typeof en = {
  nav: {
    tagline: "Pencarian template CapCut",
    themeDark: "Ganti ke mode terang",
    themeLight: "Ganti ke mode gelap",
    language: "Bahasa",
  },
  hero: {
    titleA: "Cari lebih sedikit.",
    titleB: "Edit lebih banyak.",
    sub: "Cari template video dan image, pratinjau hasil editnya sebelum dipakai, dan langsung ke template yang cocok.",
  },
  search: {
    video: "Video",
    image: "Gambar",
    both: "Semua",
    placeholder: "Cari template...",
    submit: "Cari",
    submitting: "Mencari",
    tryLabel: "Coba",
    ariaSearch: "Cari template",
    ariaType: "Jenis template",
  },
  results: {
    loading: "Menyambung ke indeks CapCut",
    noResultsYet: "Belum ada hasil",
    resultsIn: "{n} hasil dalam {t} dtk",
    results: "{n} hasil",
    searchFailed: "Pencarian gagal",
    searching: "Mencari",
    templatesFor: "Template untuk",
    connectionProblem: "Masalah koneksi",
    couldNotReach: "Tidak bisa menghubungi CapCut",
    retry: "Coba lagi",
    nothingFor: "Tidak ada untuk",
    emptyBody:
      "CapCut tidak mengembalikan template untuk kata kunci itu. Coba kata yang lebih umum, atau ganti antara video dan gambar di atas.",
  },
  faq: {
    eyebrow: "Pertanyaan umum",
    headingA: "Pertanyaan,",
    headingB: "terjawab.",
    lead: "Enam hal yang paling sering ditanyakan sebelum pencarian pertama. Untuk sisanya, footer punya halaman hukumnya.",
    items: [
      {
        q: "Darimana template ini berasal?",
        a: "Noisy mengambil daftar template CapCut publik lewat kata kunci. Setiap sampul, video, dan angka yang Anda lihat dikembalikan oleh API listing milik CapCut dan menjadi milik kreator yang mempublikasikannya.",
      },
      {
        q: "Perlu akun CapCut untuk menelusuri?",
        a: "Tidak. Cari, pratinjau, dan tonton template sepuasnya di sini tanpa masuk akun. Anda hanya butuh CapCut saat memutuskan memakai template, itulah kenapa tombol itu satu-satunya yang membuka capcut.com.",
      },
      {
        q: "Bagaimana cara memakai template yang saya suka?",
        a: "Klik kartu untuk membuka pratinjau, tonton editan penuhnya, lalu tekan Pakai template. Tombol itu membuka halaman template di capcut.com (atau langsung ke aplikasi CapCut jika sudah terpasang). Dari sana CapCut membantu Anda memasukkan video sendiri.",
      },
      {
        q: "Kenapa pencarian butuh beberapa detik?",
        a: "Pencarian dikirim langsung saat CapCut menerima host kita, dan beralih ke sejumlah kecil proxy publik saat ditolak. Pencarian ulang dengan kata yang sama di-cache selama lima menit dan hasilnya hampir instan.",
      },
      {
        q: "Pratinjau video tidak jalan, bagaimana?",
        a: "Pratinjau di-stream dari CDN CapCut. Jika berhenti, arahkan kursor ke kartu lagi atau buka lightbox lalu tekan play di kontrol video. Di koneksi sempit, gambar sampul selalu dimuat lebih dulu supaya Anda tetap bisa memilih dari frame-nya.",
      },
      {
        q: "Apakah Noisy berafiliasi dengan CapCut?",
        a: "Tidak. Noisy adalah antarmuka pencarian independen untuk daftar publik. Noisy tidak didukung atau berafiliasi dengan CapCut atau ByteDance, dan tidak pernah mengakses akun CapCut Anda.",
      },
    ],
  },
  card: {
    preview: "Pratinjau",
  },
  lightbox: {
    close: "Tutup pratinjau",
    uses: "kali dipakai",
    likes: "suka",
    by: "oleh",
    useTemplate: "Pakai template",
    copyLink: "Salin tautan",
    copied: "Tersalin",
    hint: "Pakai template membuka capcut.com di tab baru.",
    previewLabel: "pratinjau",
    imageNote: "Ini template gambar, jadi pratinjaunya berupa gambar.",
  },
  footer: {
    disclaimer:
      "Noisy menelusuri daftar template CapCut publik. Tidak berafiliasi dengan CapCut atau ByteDance. Template milik kreatornya masing-masing.",
    api: "Search API by Noisy",
    sourced: "Template bersumber dari capcut.com",
    privacy: "Kebijakan Privasi",
    terms: "Ketentuan Layanan",
    wordmark: "Noisy",
  },
  dev: {
    eyebrow: "Pengembang",
    headingA: "Dibuat oleh",
    name: "Noisy",
    role: "Pengembang & perawat",
    status: "Terbuka untuk kolaborasi",
    bio: "Membangun Noisy, menjaga pool proxy tetap hangat, dan menjawab saat ada yang rusak. DM untuk bug, ide, atau kerja sama.",
    telegram: "Telegram",
    channel: "Channel",
    github: "GitHub",
    file: "noisy.ts",
    lang: "TypeScript",
    done: "24 hasil dalam 0,4 dtk",
    viewProfile: "Buka",
  },
  legal: {
    eyebrow: "Hukum",
    back: "Kembali ke pencarian",
    lastUpdated: "Terakhir diperbarui",
    contact:
      "Pertanyaan soal dokumen ini? Hubungi lewat kanal tempat Anda menemukan Noisy, dan sertakan nomor bagian agar mudah dijawab.",
  },
  docs: {
    privacy: {
      title: "Kebijakan Privasi",
      updated: "25 September 2026",
      intro:
        "Kebijakan ini hanya mencakup situs Noisy. Ini menjelaskan dengan bahasa sederhana apa yang terjadi pada data Anda saat mencari template CapCut di sini.",
      sections: [
        {
          heading: "Ringkasan",
          paragraphs: [
            "Noisy adalah alat pencarian gratis untuk daftar template CapCut publik. Anda tidak perlu akun, kami tidak menjual apa pun, dan kami tidak membangun profil tentang Anda. Versi singkatnya: kami hanya memproses apa yang dibutuhkan untuk menjalankan pencarian, menyimpan sangat sedikit, dan tidak pernah melihat kredensial CapCut Anda karena kami tidak pernah memintanya.",
            "Versi panjangnya di bawah menjelaskan persis apa yang melewati situs ini dan apa yang tetap tinggal di perangkat Anda.",
          ],
        },
        {
          heading: "Yang kami proses",
          paragraphs: [
            "Saat Anda menjalankan pencarian, kata kunci dan tab yang Anda pilih dikirim ke server kami agar bisa mengambil daftar template publik CapCut atas nama Anda. Permintaan itu diproses sementara: dipakai untuk mengembalikan hasil, bukan untuk membangun riwayat siapa Anda.",
          ],
          bullets: [
            "Kata kunci pencarian dan tab yang dipilih (video atau gambar).",
            "Data standar permintaan seperti alamat IP dan waktu, yang dicatat host kami sebentar di log server untuk pencegahan penyalahgunaan.",
            "Preferensi tema (terang atau gelap), yang tidak pernah meninggalkan browser Anda.",
          ],
        },
        {
          heading: "Yang tidak kami kumpulkan",
          paragraphs: [
            "Noisy tidak punya akun dan alur pembayaran, jadi tidak ada yang dikumpulkan dalam arti biasa.",
          ],
          bullets: [
            "Tanpa nama, email, nomor telepon, atau detail pembayaran.",
            "Tanpa identitas periklanan dan tanpa pelacakan lintas situs.",
            "Tanpa catatan template yang Anda buka atau gunakan.",
            "Tanpa akses ke akun CapCut, draf, atau pustaka media Anda.",
          ],
        },
        {
          heading: "Cache pencarian",
          paragraphs: [
            "Untuk mencegah pool proxy kelebihan beban, pencarian identik di-cache di server selama lima menit dan daftar proxy selama sepuluh menit. Cache menyimpan kata kunci beserta hasilnya saja, tidak ada yang lain, dan kedaluwarsa dengan sendirinya.",
          ],
        },
        {
          heading: "Cookie dan penyimpanan lokal",
          paragraphs: [
            "Noisy tidak memasang cookie periklanan atau analitik. Satu-satunya yang disimpan di perangkat Anda adalah preferensi tema di localStorage, yang tetap di browser Anda dan tidak pernah dikirim ke mana pun. Menghapus data situs akan menghapusnya.",
          ],
        },
        {
          heading: "Layanan pihak ketiga",
          paragraphs: [
            "Template dihosting oleh CapCut, jadi pratinjau dimuat dari infrastruktur mereka. Begitu media keluar dari server kami, kebijakan privasi penyedia tersebut yang berlaku.",
          ],
          bullets: [
            "capcut.com dan CDN-nya: sampul template, pratinjau video, dan tujuan tombol Pakai template.",
            "Penyedia proxy yang dipakai menjangkau API daftar CapCut: meneruskan permintaan pencarian Anda, tidak melihat data lain.",
            "Google Fonts: font situs disediakan Google, yang menerima permintaan standar untuk berkas font.",
          ],
        },
        {
          heading: "Privasi anak",
          paragraphs: [
            "Noisy adalah alat untuk publik umum dan tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak sengaja mengumpulkan data pribadi dari anak. Jika Anda yakin seorang anak telah memberikan data pribadi melalui situs ini, hubungi kami dan kami akan menghapusnya.",
          ],
        },
        {
          heading: "Hak Anda dan perubahan",
          paragraphs: [
            "Karena data yang kami simpan sangat sedikit, biasanya tidak ada yang perlu diekspor atau dihapus. Jika Anda ingin konfirmasi apa pun yang terkait dengan IP Anda di log sementara kami, tanyakan dan kami akan memeriksa serta menghapusnya.",
            "Jika kebijakan ini berubah secara material, tanggal pembaruan di bagian atas halaman ini ikut berubah. Penggunaan setelah pembaruan berarti Anda menerima versi yang direvisi.",
          ],
        },
      ],
    },
    terms: {
      title: "Ketentuan Layanan",
      updated: "25 September 2026",
      intro:
        "Persyaratan ini mengatur penggunaan Noisy. Singkat, jelas, tanpa kejutan: alat pencarian gratis yang mengembalikan Anda ke CapCut saat menemukan yang Anda cari.",
      sections: [
        {
          heading: "Persetujuan",
          paragraphs: [
            "Dengan mengakses atau menggunakan Noisy, Anda menyetujui persyaratan ini. Jika Anda tidak setuju dengan salah satu poin di bawah, jangan gunakan situs ini. Menggunakan situs setelah persyaratan diperbarui dihitung sebagai penerimaan versi yang diperbarui.",
          ],
        },
        {
          heading: "Layanan",
          paragraphs: [
            "Noisy adalah antarmuka pencarian gratis untuk daftar template CapCut publik. Disediakan apa adanya, tanpa akun, tanpa jaminan uptime, dan tanpa janji bahwa template tertentu akan tersedia saat Anda mencarinya.",
          ],
          bullets: [
            "Fitur, tata letak, dan tab yang didukung bisa berubah sewaktu-waktu.",
            "Pencarian bergantung pada indeks pihak ketiga dan pool proxy, jadi hasil bisa lambat atau sementara tidak tersedia.",
            "Tidak ada paket berbayar dan kami tidak akan pernah meminta Anda membayar untuk akses.",
          ],
        },
        {
          heading: "Penggunaan yang diizinkan",
          paragraphs: [
            "Gunakan Noisy untuk menelusuri dan menemukan template. Hal berikut tidak diizinkan.",
          ],
          bullets: [
            "Menghantam endpoint pencarian dengan permintaan otomatis, skrip pengambil massal, atau kode yang melewati cache.",
            "Menjual ulang, menerbitkan ulang, atau mendistribusikan hasil pencarian sebagai dataset Anda sendiri.",
            "Mencoba mengganggu, membanjiri, atau membongkar layanan.",
            "Memakai hasil untuk hal yang melanggar hukum atau hak orang lain.",
          ],
        },
        {
          heading: "Konten pihak ketiga",
          paragraphs: [
            "Setiap template, sampul, video, dan statistik yang ditampilkan Noisy berasal dari daftar publik CapCut dan menjadi milik kreator yang mempublikasikannya serta CapCut itu sendiri. Noisy tidak mengklaim kepemilikan apa pun atasnya.",
            "Saat Anda menekan Pakai template, Anda meninggalkan Noisy dan masuk ke capcut.com atau aplikasi CapCut, di mana persyaratan dan kebijakan CapCut yang berlaku. Media pratinjau di-stream dari CDN CapCut sesuai ketentuan mereka.",
          ],
        },
        {
          heading: "Tanpa afiliasi",
          paragraphs: [
            "Noisy adalah proyek independen. Noisy tidak berafiliasi, didukung, disponsori, atau terhubung dengan CapCut atau ByteDance dalam kapasitas resmi apa pun. CapCut, logo CapCut, dan merek terkait tetap milik pemiliknya masing-masing.",
          ],
        },
        {
          heading: "Kekayaan intelektual",
          paragraphs: [
            "Antarmuka, kode, dan branding Noisy adalah karya situs ini sendiri. Fungsi pencarian mengandalkan daftar yang dapat diakses publik, dan hak template tetap milik kreatornya. Jika Anda pemegang hak dan ingin sesuatu ditangani, hubungi kami dengan tautan spesifiknya dan kami akan menindaklanjuti.",
          ],
        },
        {
          heading: "Penafian dan tanggung jawab",
          paragraphs: [
            "Noisy disediakan tanpa jaminan apa pun, tersurat maupun tersirat, termasuk kelayakan untuk tujuan tertentu. Kami tidak menjamin pencarian akan tanpa gangguan, hasil akurat, atau setiap template aman digunakan.",
            "Sejauh diizinkan undang-undang, Noisy tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan situs atau konten yang dijangkau melaluinya.",
          ],
        },
        {
          heading: "Perubahan dan penghentian",
          paragraphs: [
            "Kami dapat mengubah, menangguhkan, atau menghentikan layanan kapan saja. Kami juga dapat membatasi akses dari IP yang menyalahgunakan endpoint. Tanggal pembaruan di bagian atas halaman ini mencerminkan versi persyaratan terkini.",
          ],
        },
      ],
    },
  },
};

export const dict = { en, id };

export type Dict = typeof en;

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}
