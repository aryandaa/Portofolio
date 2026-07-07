const certificateImages = {
  // Add certificate images here after placing files in public/assets/certificates.
  // If a certificate has one image, put one URL in the array.
  // If a certificate has multiple images, put multiple URLs and the UI will show < > controls.
  // Example with two images:
  // "Belajar Fundamental Back-End Dengan Javascript": [
  //   "/assets/certificates/backend-fundamental-js-1.jpg",
  //   "/assets/certificates/backend-fundamental-js-2.jpg",
  // ],
  // Example with one image:
  // "Figma Camp": ["/assets/certificates/figma-camp.jpg"],
};

export const certifications = [
  {
    name: "Belajar Fundamental Back-End Dengan Javascript",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Back-End Web",
  },
  {
    name: "Belajar Back-End Pemula dengan JavaScript",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Back-End Web",
  },
  {
    name: "Belajar Fundamental Aplikasi Web dengan React",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "React",
  },
  {
    name: "Belajar Membuat Aplikasi Web dengan React",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "React",
  },
  {
    name: "Belajar Membuat Front-End Web untuk Pemula",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Front-End Web",
  },
  {
    name: "Belajar Dasar Pemrograman JavaScript",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "JavaScript",
  },
  {
    name: "Belajar Dasar Pemrograman Web",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Web Development",
  },
  {
    name: "Belajar Dasar Cloud dan Gen AI di AWS",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Cloud & AI",
  },
  {
    name: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Software Development",
  },
  {
    name: "Pengenalan ke Logika Pemrograman",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Programming Logic",
  },
  {
    name: "Introduction to Financial Literacy",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Dicoding Indonesia",
    category: "Financial Literacy",
  },
  {
    name: "Junior Web Developer",
    type: "Certification",
    date: "Not specified in CV",
    issuer: "Vocational School Graduate Academy - Digital Talent Scholarship",
    category: "Web Development",
  },
  {
    name: "Keamanan Informasi (Micro Skill)",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Digital Talent Scholarship",
    category: "Cybersecurity",
  },
  {
    name: "Pemrograman (Micro Skill)",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Digital Talent Scholarship",
    category: "Programming",
  },
  {
    name: "Figma Camp",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "Ousean School",
    category: "UI/UX",
  },
  {
    name: "Sertifikat Kompetensi Teknisi Pendukung Operasional Jaringan",
    type: "Competency Certification",
    date: "Not specified in CV",
    issuer: "BNSP",
    category: "Networking",
  },
  {
    name: "2nd UI/UX Design Poliban Competition",
    type: "Award Certificate",
    date: "Not specified in CV",
    issuer: "Poliban",
    category: "UI/UX",
  },
  {
    name: "ITS Nabu Event CyberSecurity",
    type: "Certificate",
    date: "Not specified in CV",
    issuer: "ITS University",
    category: "Cybersecurity",
  },
].map((certificate) => ({
  ...certificate,
  images: certificateImages[certificate.name] ?? [],
}));
