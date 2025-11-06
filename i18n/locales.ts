export interface Locale {
    header: HeaderLocale;
    app: AppLocale;
    imageUploader: ImageUploaderLocale;
    styleConfigurator: StyleConfiguratorLocale;
    resultsGrid: ResultsGridLocale;
    historyPanel: HistoryPanelLocale;
    featuresModal: FeaturesModalLocale;
    faqModal: FaqModalLocale;
    footer: FooterLocale;
}

export interface HeaderLocale {
    support: string;
    toggleTheme: string;
}

export interface AppLocale {
    uploadError: string;
    generationErrorGeneral: string;

    generationErrorSpecific: string;
    upscaleError: string;
    processing: string;
    generateButton: string;
    errorTitle: string;
}

export interface ImageUploaderLocale {
    title: string;
    mainPhotoTitle: string;
    mainPhotoSubtitle: string;
    referencePhotoTitle: string;
    referencePhotoSubtitle: string;
    dragAndDrop: string;
    fileConstraints: string;
    fileTypeError: string;
    fileSizeError: string;
    imagePreviewAlt: string;
    removeImage: string;
}

export interface StyleConfiguratorLocale {
    title: string;
    subtitle: string;
    photoType: string;
    ageCategory: string;
    gender: string;
    ethnicity: string;
    poseStyle: string;
    customPosePlaceholder: string;
    backgroundStyle: string;
    customBackgroundPlaceholder: string;
    clothingMaterial: string;
    clothingMaterialPlaceholder: string;
    extraInstructions: string;
    extraInstructionsPlaceholder: string;
    aspectRatio: string;
}

export interface ResultsGridLocale {
    title: string;
    subtitle: string;
    downloadAll: string;
    emptyState: string;
    generatingState: string;
    upscalingState: string;
    upscaled: string;
    errorState: string;
    altText: string;
    download: string;
    copied: string;
    copyPrompt: string;
    showPrompt: string;
    hidePrompt: string;
    upscaleAll: string;
}

export interface HistoryPanelLocale {
    title: string;
    clearAll: string;
    clearAllConfirm: string;
    empty: string;
    useConfig: string;
    delete: string;
    photoType: string;
    pose: string;
    background: string;
    aspectRatio: string;
}

export interface FeaturesModalLocale {
    title: string;
    features: { title: string; description: string }[];
    close: string;
}

export interface FaqModalLocale {
    title: string;
    questions: { question: string; answer: string }[];
    close: string;
}

export interface FooterLocale {
    tagline: string;
    product: string;
    features: string;
    faq: string;
    followUs: string;
    rights: string;
}


const id: Locale = {
    header: {
        support: "Dukungan Admin",
        toggleTheme: "Ganti tema",
    },
    app: {
        uploadError: "Harap unggah Foto Utama Anda terlebih dahulu.",
        generationErrorGeneral: "Terjadi kesalahan saat membuat gambar.",
        generationErrorSpecific: "Gagal membuat gambar.",
        upscaleError: "Beberapa gambar gagal di-upscale.",
        processing: "Memproses...",
        generateButton: "Buat Foto Profesional",
        errorTitle: "Terjadi Kesalahan",
    },
    imageUploader: {
        title: "Unggah Foto Anda",
        mainPhotoTitle: "Foto Utama",
        mainPhotoSubtitle: "Dasar untuk pose, komposisi, dan subjek.",
        referencePhotoTitle: "Logo Brand (Opsional)",
        referencePhotoSubtitle: "Unggah logo (PNG transparan) untuk ditambahkan di kanan bawah foto.",
        dragAndDrop: "Klik untuk mengunggah atau seret foto",
        fileConstraints: "PNG atau JPG (maks. 10MB)",
        fileTypeError: "Jenis file tidak didukung. Harap unggah PNG atau JPG.",
        fileSizeError: "Ukuran file melebihi 10MB. Harap unggah file yang lebih kecil.",
        imagePreviewAlt: "Pratinjau Foto",
        removeImage: "Hapus gambar",
    },
    styleConfigurator: {
        title: "Konfigurasi Gaya",
        subtitle: "Pilih jenis, pose, dan latar untuk foto Anda.",
        photoType: "Jenis Foto",
        ageCategory: "Kategori Usia",
        gender: "Jenis Kelamin",
        ethnicity: "Etnis",
        poseStyle: "Gaya Pose",
        customPosePlaceholder: "Tulis gaya pose kustom...",
        backgroundStyle: "Latar Belakang",
        customBackgroundPlaceholder: "Tulis latar belakang kustom...",
        clothingMaterial: "Bahan Baju (Opsional)",
        clothingMaterialPlaceholder: "Contoh: katun, sutra, denim",
        extraInstructions: "Instruksi Tambahan (Opsional)",
        extraInstructionsPlaceholder: "Contoh: semua orang tersenyum, pencahayaan sore hari",
        aspectRatio: "Aspek Rasio",
    },
    resultsGrid: {
        title: "Hasil Foto",
        subtitle: "Enam variasi akan dibuat di sini.",
        downloadAll: "Unduh Semua",
        emptyState: "Hasil akan muncul di sini",
        generatingState: "Membuat foto...",
        upscalingState: "Meningkatkan resolusi...",
        upscaled: "Resolusi Tinggi",
        errorState: "Gagal membuat gambar",
        altText: "Foto hasil AI",
        download: "Unduh",
        copied: "Disalin!",
        copyPrompt: "Salin Prompt",
        showPrompt: "Tampilkan Prompt",
        hidePrompt: "Sembunyikan Prompt",
        upscaleAll: "Tingkatkan Semua ke 2K",
    },
    historyPanel: {
        title: "Riwayat Konfigurasi",
        clearAll: "Hapus Semua Riwayat",
        clearAllConfirm: "Anda yakin ingin menghapus semua riwayat?",
        empty: "Belum ada riwayat. Buat foto baru untuk menyimpannya di sini.",
        useConfig: "Gunakan",
        delete: "Hapus riwayat",
        photoType: "Jenis",
        pose: "Pose",
        background: "Latar",
        aspectRatio: "Rasio",
    },
    featuresModal: {
        title: "Fitur Unggulan Mamanda PhotoStudio",
        close: "Tutup",
        features: [
            { title: "Peningkatan Foto oleh AI", description: "Ubah foto biasa menjadi potret berkualitas studio. AI kami akan memperbaiki pencahayaan, ketajaman, dan komposisi sambil mempertahankan kemiripan subjek." },
            { title: "Kustomisasi Gaya Lengkap", description: "Pilih jenis foto (Keluarga, Personal, Profesional), lalu pilih dari 30+ gaya pose dan 30+ latar belakang yang disesuaikan secara dinamis." },
            { title: "Watermark Logo Otomatis", description: "Unggah logo brand Anda (disarankan format PNG transparan) dan secara otomatis akan ditambahkan sebagai watermark di pojok kanan bawah setiap hasil foto. Sempurna untuk branding." },
            { title: "Upscale ke Resolusi 2K", description: "Tingkatkan resolusi gambar hasil generate menjadi 2K. Dapatkan detail yang lebih tajam dan kualitas yang lebih tinggi, cocok untuk dicetak atau ditampilkan di layar besar." },
            { title: "Enam Variasi Sekaligus", description: "Hemat waktu dan dapatkan lebih banyak pilihan. Setiap proses generate akan menghasilkan enam variasi foto yang berbeda, memberikan Anda kebebasan untuk memilih yang terbaik." },
            { title: "Kualitas Profesional", description: "Setiap foto yang dihasilkan memiliki kualitas tinggi sekelas studio profesional, siap untuk dicetak atau dibagikan." },
        ],
    },
    faqModal: {
        title: "Pertanyaan yang Sering Diajukan (FAQ)",
        close: "Tutup",
        questions: [
            { question: "Apa itu Mamanda PhotoStudio?", answer: "Ini adalah aplikasi web berbasis AI untuk mengubah foto personal, keluarga, atau profesional menjadi gambar berkualitas tinggi sekelas studio foto secara instan." },
            { question: "Bagaimana cara kerjanya?", answer: "Anda cukup mengunggah foto, memilih Jenis Foto, Gaya Pose, dan Latar Belakang, lalu klik 'Buat'. AI kami akan memproses gambar dan memberikan enam variasi foto baru yang telah disempurnakan. Anda juga bisa mengunggah logo untuk ditambahkan sebagai watermark." },
            { question: "Jenis foto seperti apa yang memberikan hasil terbaik?", answer: "Gunakan foto yang fokusnya jelas pada subjek (orang) dan memiliki pencahayaan yang baik. Hindari foto yang terlalu buram, gelap, atau wajah subjek terlalu kecil/jauh. Untuk logo, disarankan menggunakan format PNG dengan latar belakang transparan." },
            { question: "Apakah privasi saya aman?", answer: "Kami sangat menjaga privasi Anda. Foto yang diunggah hanya digunakan untuk proses pembuatan gambar saat itu juga. Kami <b>tidak menyimpan</b> atau membagikan foto Anda kepada pihak lain." },
            { question: "Apakah gambar yang dihasilkan bebas untuk penggunaan komersial?", answer: "Ya, semua gambar yang Anda hasilkan sepenuhnya menjadi milik Anda dan bebas digunakan untuk keperluan pribadi maupun komersial." }
        ],
    },
    footer: {
        tagline: "Studio foto AI untuk potret personal dan keluarga yang menakjubkan.",
        product: "Produk",
        features: "Fitur",
        faq: "FAQ",
        followUs: "Ikuti Kami",
        rights: "Semua hak dilindungi undang-undang.",
    },
};

const en: Locale = {
    header: {
        support: "Support Admin",
        toggleTheme: "Toggle theme",
    },
    app: {
        uploadError: "Please upload your Main Photo first.",
        generationErrorGeneral: "An error occurred while generating images.",
        generationErrorSpecific: "Failed to create image.",
        upscaleError: "Some images failed to upscale.",
        processing: "Processing...",
        generateButton: "Generate Pro Photos",
        errorTitle: "An Error Occurred",
    },
    imageUploader: {
        title: "Upload Your Photos",
        mainPhotoTitle: "Main Photo",
        mainPhotoSubtitle: "The base for pose, composition, and subject.",
        referencePhotoTitle: "Brand Logo (Optional)",
        referencePhotoSubtitle: "Upload a logo (transparent PNG) to add to the bottom right of the photo.",
        dragAndDrop: "Click to upload or drag and drop",
        fileConstraints: "PNG or JPG (max. 10MB)",
        fileTypeError: "File type not supported. Please upload a PNG or JPG.",
        fileSizeError: "File size exceeds 10MB. Please upload a smaller file.",
        imagePreviewAlt: "Photo Preview",
        removeImage: "Remove image",
    },
    styleConfigurator: {
        title: "Style Configuration",
        subtitle: "Choose the type, pose, and background for your photo.",
        photoType: "Photo Type",
        ageCategory: "Age Category",
        gender: "Gender",
        ethnicity: "Ethnicity",
        poseStyle: "Pose Style",
        customPosePlaceholder: "Enter custom pose style...",
        backgroundStyle: "Background",
        customBackgroundPlaceholder: "Enter custom background...",
        clothingMaterial: "Clothing Material (Optional)",
        clothingMaterialPlaceholder: "e.g., cotton, silk, denim",
        extraInstructions: "Additional Instructions (Optional)",
        extraInstructionsPlaceholder: "e.g., everyone smiling, golden hour lighting",
        aspectRatio: "Aspect Ratio",
    },
    resultsGrid: {
        title: "Photo Results",
        subtitle: "Six variations will be generated here.",
        downloadAll: "Download All",
        emptyState: "Results will appear here",
        generatingState: "Generating photos...",
        upscalingState: "Upscaling...",
        upscaled: "Upscaled",
        errorState: "Failed to create image",
        altText: "AI-generated photo",
        download: "Download",
        copied: "Copied!",
        copyPrompt: "Copy Prompt",
        showPrompt: "Show Prompt",
        hidePrompt: "Hide Prompt",
        upscaleAll: "Upscale All to 2K",
    },
    historyPanel: {
        title: "Configuration History",
        clearAll: "Clear All History",
        clearAllConfirm: "Are you sure you want to delete all history?",
        empty: "No history yet. Generate new photos to save them here.",
        useConfig: "Use",
        delete: "Delete history",
        photoType: "Type",
        pose: "Pose",
        background: "Background",
        aspectRatio: "Ratio",
    },
    featuresModal: {
        title: "Mamanda PhotoStudio Key Features",
        close: "Close",
        features: [
            { title: "AI Photo Enhancement", description: "Transform regular photos into studio-quality portraits. Our AI corrects lighting, sharpness, and composition while preserving the subject's likeness." },
            { title: "Full Style Customization", description: "Select a photo type (Family, Personal, Professional), then choose from 30+ pose styles and 30+ dynamically adapted backgrounds." },
            { title: "Automatic Logo Watermarking", description: "Upload your brand logo (transparent PNG recommended) and it will be automatically added as a watermark to the bottom right of every photo result. Perfect for branding." },
            { title: "Upscale to 2K Resolution", description: "Enhance your generated images to 2K resolution. Get sharper details and higher quality, perfect for printing or large screen displays." },
            { title: "Six Variations at Once", description: "Save time and get more options. Each generation process produces six different photo variations, giving you the freedom to choose the best one." },
            { title: "Professional Quality", description: "Each generated photo has high, professional studio-level quality, ready to be printed or shared." },
        ],
    },
    faqModal: {
        title: "Frequently Asked Questions (FAQ)",
        close: "Close",
        questions: [
            { question: "What is Mamanda PhotoStudio?", answer: "It's an AI-powered web app to instantly transform your personal, family, or professional photos into high-quality, studio-grade images." },
            { question: "How does it work?", answer: "Simply upload a photo, choose the Photo Type, Pose Style, and Background, then click 'Generate'. Our AI will process the image and provide six new, enhanced photo variations. You can also upload a logo to be added as a watermark." },
            { question: "What kind of photos work best?", answer: "Use photos with a clear focus on the subject (person) and good lighting. Avoid images that are too blurry, dark, or where the subject's face is too small/distant. For the logo, using a PNG format with a transparent background is recommended." },
            { question: "Is my privacy protected?", answer: "We take your privacy very seriously. Uploaded photos are only used for the image generation process at that moment. We <b>do not store</b> or share your photos with any third parties." },
            { question: "Are the generated images free for commercial use?", answer: "Yes, all images you generate are entirely yours and are free to be used for personal or commercial purposes." }
        ],
    },
    footer: {
        tagline: "AI photo studio for stunning personal and family portraits.",
        product: "Product",
        features: "Features",
        faq: "FAQ",
        followUs: "Follow Us",
        rights: "All rights reserved.",
    },
};

export const locales = { id, en };