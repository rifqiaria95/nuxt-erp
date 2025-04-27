export const menuItems = [
    {
        name: "Beranda",
        path: "/",
    },
    {
        name: "Profil",
        path: "#",
        children: [
        { name: "PPID", path: "/profil/ppid" },
        { name: "Visi dan Misi", path: "/profil/visimisi" },
        { name: "Struktur", path: "/profil/struktur" },
        { name: "Tugas, Fungsi dan Wewenang", path: "/profil/tugas" },
        ],
    },
    {
        name: "Regulasi",
        path: "/regulasi",
    },
    {
        name: "Informasi Publik",
        path: "#",
        children: [
        { name: "Daftar Informasi Publik", path: "/informasi/infopublik" },
        { name: "Informasi Berkala", path: "/informasi/infoberkala" },
        { name: "Informasi Serta Merta", path: "/informasi/infosertamerta" },
        { name: "Informasi Wajib Tersedia", path: "/informasi/infotersedia" },
        { name: "Informasi Dikecualikan", path: "/informasi/infodikecualikan" },
        { name: `Informasi Khusus Angkatan Lebaran ${new Date().getFullYear()}`, path: "/informasi/infoangkatanlebaran" },
        ],
    },
    {
        name: "Sustainability",
        path: "/sustainability",
    },
    {
        name: "Standar Layanan",
        path: "#",
        children: [
        { name: "Maklumat", path: "/standar/standarmaklumat" },
        { name: "Prosedur Permohonan Informasi", path: "/standar/permohonaninformasi" },
        { name: "Prosedur Permohonan Keberatan", path: "/standar/permohonankeberatan" },
        { name: "Prosedur Sengketa Informasi", path: "/standar/sengketainformasi" },
        { name: "Jalur dan Waktu Layanan", path: "/standar/jalurwaktulayanan" },
        ],
    },
    {
        name: "Layanan Informasi",
        path: "/layananinformasi",
    },
    {
        name: "FAQ",
        path: "/faq",
    },
];  