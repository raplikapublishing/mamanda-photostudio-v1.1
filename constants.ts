export type StyleOption = {
  id: string;
  name_id: string;
  name_en: string;
};

export const PHOTO_TYPES: StyleOption[] = [
  { id: 'keluarga', name_id: 'Keluarga', name_en: 'Family' },
  { id: 'anak-anak', name_id: 'Anak-anak', name_en: 'Children' },
  { id: 'personal', name_id: 'Personal', name_en: 'Personal' },
  { id: 'profesional', name_id: 'Profesional', name_en: 'Professional' },
];

export const GENDER_OPTIONS: StyleOption[] = [
  { id: 'perempuan', name_id: 'Perempuan', name_en: 'Female' },
  { id: 'laki-laki', name_id: 'Laki-laki', name_en: 'Male' },
  { id: 'campuran', name_id: 'Laki-laki & Perempuan', name_en: 'Male & Female' },
];

export const ETHNICITY_OPTIONS: StyleOption[] = [
  { id: 'auto', name_id: 'Otomatis (sesuai foto asli)', name_en: 'Automatic (from original photo)' },
  { id: 'jawa', name_id: 'Jawa', name_en: 'Javanese' },
  { id: 'sunda', name_id: 'Sunda', name_en: 'Sundanese' },
  { id: 'melayu', name_id: 'Melayu', name_en: 'Malay' },
  { id: 'tionghoa', name_id: 'Tionghoa', name_en: 'Chinese' },
  { id: 'batak', name_id: 'Batak', name_en: 'Batak' },
  { id: 'kaukasia', name_id: 'Kaukasia', name_en: 'Caucasian' },
  { id: 'afrika', name_id: 'Afrika', name_en: 'African' },
  { id: 'hispanik', name_id: 'Hispanik', name_en: 'Hispanic' },
  { id: 'asia-timur', name_id: 'Asia Timur', name_en: 'East Asian' },
  { id: 'asia-selatan', name_id: 'Asia Selatan', name_en: 'South Asian' },
];

export const CHILDREN_AGE_CATEGORIES: StyleOption[] = [
  { id: 'balita', name_id: 'Balita (1-3 tahun)', name_en: 'Toddler (1-3 years)' },
  { id: 'prasekolah', name_id: 'Prasekolah (3-5 tahun)', name_en: 'Preschooler (3-5 years)' },
  { id: 'sekolah-dasar', name_id: 'Usia Sekolah Dasar (6-9 tahun)', name_en: 'Early Elementary (6-9 years)' },
  { id: 'remaja-awal', name_id: 'Pra-remaja (10-12 tahun)', name_en: 'Pre-teen (10-12 years)' },
];

export const ASPECT_RATIO_OPTIONS: StyleOption[] = [
  { id: 'square', name_id: 'Persegi (1:1)', name_en: 'Square (1:1)' },
  { id: 'portrait', name_id: 'Potret (3:4 - 1080x1440px)', name_en: 'Portrait (3:4 - 1080x1440px)' },
  { id: 'landscape', name_id: 'Lanskap (16:9)', name_en: 'Landscape (16:9)' },
  { id: 'story', name_id: 'Story (9:16 - 1080x1920px)', name_en: 'Story (9:16 - 1080x1920px)' },
];

export const OTHER_OPTION: StyleOption = { id: 'other', name_id: 'Lainnya (Tulis Sendiri)...', name_en: 'Other (Write your own)...' };
export const RANDOM_POSE_OPTION: StyleOption = { id: 'random', name_id: 'Pose Acak (Kejutan dari AI)', name_en: 'Random Pose (AI Surprise)' };

export const FAMILY_POSE_STYLES: StyleOption[] = [
    RANDOM_POSE_OPTION,
    { id: 'carry-hug-cheerful', name_id: 'Gendong & Peluk Ceria', name_en: 'Carry & Cheerful Hug' },
    { id: 'holding-hands-walking', name_id: 'Bergandengan Tangan Sambil Berjalan', name_en: 'Holding Hands While Walking' },
    { id: 'group-sitting-grass-sofa', name_id: 'Duduk Berkelompok di Rumput/Sofa', name_en: 'Sitting in a Group on Grass/Sofa' },
    { id: 'candid-laughing-interaction', name_id: 'Interaksi Candid (Tertawa Lepas)', name_en: 'Candid Interaction (Laughing Freely)' },
    { id: 'whispering-secrets', name_id: 'Bisikan Rahasia', name_en: 'Whispering Secrets' },
    { id: 'human-pyramid-joking', name_id: 'Piramida Manusia (Bercanda)', name_en: 'Human Pyramid (Joking)' },
    { id: 'future-look', name_id: 'Menatap ke Satu Arah (The Future Look)', name_en: 'Looking in One Direction (The Future Look)' },
    { id: 'group-hug-from-behind', name_id: 'Pelukan Grup dari Belakang', name_en: 'Group Hug from Behind' },
    { id: 'jumping-together-energetic', name_id: 'Lompat Bersama Penuh Energi', name_en: 'Jumping Together Energetically' },
    { id: 'reading-storybook-together', name_id: 'Membaca Buku Cerita Bersama', name_en: 'Reading a Storybook Together' },
    { id: 'lying-down-formation', name_id: 'Formasi Berbaring (Kepala Berdekatan)', name_en: 'Lying Down Formation (Heads Close)' },
    { id: 'dancing-twirling', name_id: 'Menari & Berputar', name_en: 'Dancing & Twirling' },
    { id: 'simultaneous-kisses', name_id: 'Cium Pipi & Kening Serentak', name_en: 'Kissing Cheeks & Foreheads Simultaneously' },
    { id: 'superhero-pose', name_id: 'Pose "Kekuatan Super"', name_en: '"Superhero" Pose' },
    { id: 'looking-smiling', name_id: 'Saling Bertatapan & Tersenyum', name_en: 'Looking at Each Other & Smiling' },
    OTHER_OPTION,
];

export const PERSONAL_POSE_STYLES: StyleOption[] = [
    RANDOM_POSE_OPTION,
    { id: 'charming-silhouette', name_id: 'Siluet Menawan', name_en: 'Charming Silhouette' },
    { id: 'gazing-horizon', name_id: 'Menatap Jauh ke Horizon', name_en: 'Gazing Far into the Horizon' },
    { id: 'mysterious-face-cover', name_id: 'Menutupi Sebagian Wajah (Misterius)', name_en: 'Partially Covering the Face (Mysterious)' },
    { id: 'euphoric-jump', name_id: 'Lompatan Euforia Penuh Kebebasan', name_en: 'Euphoric Jump of Freedom' },
    { id: 'interacting-with-nature', name_id: 'Interaksi dengan Elemen Alam', name_en: 'Interacting with Natural Elements' },
    { id: 'lying-on-grass-sand', name_id: 'Berbaring Santai di Rumput/Pasir', name_en: 'Lying Relaxed on Grass/Sand' },
    { id: 'dancing-freely', name_id: 'Menari Lepas Tanpa Aturan', name_en: 'Dancing Freely Without Rules' },
    { id: 'pondering-by-window', name_id: 'Duduk Merenung di Tepi Jendela', name_en: 'Sitting Pondering by the Window' },
    { id: 'playing-with-shadows', name_id: 'Bermain dengan Bayangan Tubuh', name_en: 'Playing with Body Shadows' },
    { id: 'self-reflection', name_id: 'Melihat Refleksi Diri (di Cermin/Air)', name_en: 'Looking at Self-Reflection (in Mirror/Water)' },
    { id: 'walking-away-from-camera', name_id: 'Berjalan Menjauhi Kamera', name_en: 'Walking Away from the Camera' },
    { id: 'hobby-action', name_id: 'Aksi Sesuai Hobi', name_en: 'Action According to Hobby' },
    { id: 'laughing-out-loud', name_id: 'Ekspresi Tertawa Terbahak-bahak', name_en: 'Expression of Loud Laughter' },
    { id: 'hands-framing-face', name_id: 'Tangan Membingkai Wajah', name_en: 'Hands Framing the Face' },
    { id: 'against-the-wind', name_id: 'Melawan Arah Angin (Rambut Berkibar)', name_en: 'Against the Wind (Hair Blowing)' },
    OTHER_OPTION,
];

export const PROFESSIONAL_POSE_STYLES: StyleOption[] = [
    RANDOM_POSE_OPTION,
    { id: 'arms-folded-chest', name_id: 'Tangan Dilipat di Depan Dada', name_en: 'Arms Folded Across Chest' },
    { id: 'sharp-stare-camera', name_id: 'Menatap Lurus & Tajam ke Kamera', name_en: 'Staring Straight & Sharp at the Camera' },
    { id: 'tilted-body-friendly-smile', name_id: 'Badan Miring dengan Senyum Ramah', name_en: 'Body Tilted with a Friendly Smile' },
    { id: 'walking-talking-team', name_id: 'Berjalan Sambil Berbicara (Tim)', name_en: 'Walking While Talking (Team)' },
    { id: 'casual-lean-wall-desk', name_id: 'Bersandar Santai di Dinding/Meja', name_en: 'Leaning Casually on a Wall/Desk' },
    { id: 'sitting-at-desk-working', name_id: 'Duduk di Meja Seolah Bekerja', name_en: 'Sitting at a Desk as if Working' },
    { id: 'looking-out-window', name_id: 'Menatap ke Luar Jendela', name_en: 'Looking Out the Window' },
    { id: 'active-discussion-team', name_id: 'Diskusi Aktif (Tim)', name_en: 'Active Discussion (Team)' },
    { id: 'thinking-pose-hand-chin', name_id: 'Pose Berpikir (Tangan di Dagu)', name_en: 'Thinking Pose (Hand on Chin)' },
    { id: 'holding-professional-props', name_id: 'Memegang Atribut Profesi', name_en: 'Holding Professional Attributes' },
    { id: 'walking-towards-camera', name_id: 'Berjalan Tegas Menuju Kamera', name_en: 'Walking Firmly Towards the Camera' },
    { id: 'looking-over-shoulder', name_id: 'Melihat ke Arah Bahu (Over the Shoulder)', name_en: 'Looking Over the Shoulder' },
    { id: 'hands-in-pockets', name_id: 'Tangan di Saku Celana', name_en: 'Hands in Pants Pockets' },
    { id: 'candid-laugh-personality', name_id: 'Tertawa Candid (Menunjukkan Kepribadian)', name_en: 'Candid Laugh (Showing Personality)' },
    { id: 'presentation-pose', name_id: 'Pose Presentasi atau Berbicara', name_en: 'Presentation or Speaking Pose' },
    OTHER_OPTION,
];

export const CHILDREN_POSE_STYLES: StyleOption[] = [
    RANDOM_POSE_OPTION,
    { id: 'playing-toys', name_id: 'Bermain dengan Mainan', name_en: 'Playing with Toys' },
    { id: 'blowing-bubbles', name_id: 'Meniup Gelembung Sabun', name_en: 'Blowing Bubbles' },
    { id: 'superhero-action', name_id: 'Aksi Pahlawan Super', name_en: 'Superhero Action' },
    { id: 'reading-storybook', name_id: 'Membaca Buku Cerita', name_en: 'Reading a Storybook' },
    { id: 'laughing-candidly', name_id: 'Tertawa Lepas (Candid)', name_en: 'Laughing Candidly' },
    { id: 'hugging-stuffed-animal', name_id: 'Memeluk Boneka Kesayangan', name_en: 'Hugging a Favorite Stuffed Animal' },
    { id: 'silly-face', name_id: 'Ekspresi Wajah Lucu', name_en: 'Making a Silly Face' },
    { id: 'running-joyfully', name_id: 'Berlari Penuh Suka Cita', name_en: 'Running Joyfully' },
    { id: 'dress-up-costume', name_id: 'Memakai Kostum (Dokter, Putri)', name_en: 'Wearing a Costume (Doctor, Princess)' },
    { id: 'curious-explorer', name_id: 'Gaya Penjelajah Cilik', name_en: 'Curious Little Explorer' },
    { id: 'jumping-on-bed', name_id: 'Melompat di Tempat Tidur', name_en: 'Jumping on the Bed' },
    { id: 'painting-drawing', name_id: 'Melukis atau Menggambar', name_en: 'Painting or Drawing' },
    OTHER_OPTION,
];

export const FAMILY_BACKGROUNDS: StyleOption[] = [
  { id: 'sunny-park', name_id: 'Taman cerah dengan pepohonan', name_en: 'Sunny park with trees' },
  { id: 'cozy-living-room', name_id: 'Ruang keluarga yang nyaman', name_en: 'Cozy living room' },
  { id: 'studio-backdrop-neutral', name_id: 'Latar belakang studio netral (putih/abu-abu)', name_en: 'Neutral studio backdrop (white/gray)' },
  { id: 'beach-sunset', name_id: 'Pantai saat matahari terbenam', name_en: 'Beach at sunset' },
  { id: 'garden-backyard', name_id: 'Taman di halaman belakang rumah', name_en: 'Backyard garden' },
  { id: 'mountain-view', name_id: 'Pemandangan pegunungan', name_en: 'Mountain view' },
  { id: 'rustic-barn', name_id: 'Lumbung pedesaan (rustic)', name_en: 'Rustic barn' },
  { id: 'picnic-blanket', name_id: 'Tikar piknik di padang rumput', name_en: 'Picnic blanket on a meadow' },
  { id: 'decorated-room', name_id: 'Ruangan dengan dekorasi', name_en: 'Decorated room' },
  { id: 'lakeside', name_id: 'Tepi danau yang tenang', name_en: 'Quiet lakeside' },
  { id: 'flower-field', name_id: 'Ladang bunga', name_en: 'Field of flowers' },
  OTHER_OPTION,
];

export const PERSONAL_BACKGROUNDS: StyleOption[] = [
  { id: 'urban-street-art', name_id: 'Jalanan kota dengan seni grafiti', name_en: 'Urban street with graffiti art' },
  { id: 'modern-cafe', name_id: 'Kafe modern dengan interior menarik', name_en: 'Modern cafe with interesting interior' },
  { id: 'minimalist-studio', name_id: 'Studio minimalis dengan cahaya natural', name_en: 'Minimalist studio with natural light' },
  { id: 'library-bookshelves', name_id: 'Perpustakaan dengan rak buku tinggi', name_en: 'Library with tall bookshelves' },
  { id: 'nature-trail-forest', name_id: 'Jalur alam di hutan', name_en: 'Nature trail in a forest' },
  { id: 'rooftop-city-view', name_id: 'Atap gedung dengan pemandangan kota', name_en: 'Rooftop with a city view' },
  { id: 'neon-lights-night', name_id: 'Lampu neon di malam hari', name_en: 'Neon lights at night' },
  { id: 'cozy-home-corner', name_id: 'Sudut rumah yang nyaman (misal dekat jendela)', name_en: 'Cozy home corner (e.g., by a window)' },
  { id: 'industrial-loft', name_id: 'Loteng bergaya industrial', name_en: 'Industrial-style loft' },
  { id: 'botanical-garden', name_id: 'Kebun raya', name_en: 'Botanical garden' },
  OTHER_OPTION,
];

export const PROFESSIONAL_BACKGROUNDS: StyleOption[] = [
  { id: 'solid-neutral-backdrop', name_id: 'Latar belakang warna netral solid (abu-abu, putih)', name_en: 'Solid neutral color backdrop (gray, white)' },
  { id: 'modern-office-blurry', name_id: 'Kantor modern (latar belakang blur)', name_en: 'Modern office (blurry background)' },
  { id: 'bookshelf-wall', name_id: 'Dinding rak buku yang tertata rapi', name_en: 'Tidy bookshelf wall' },
  { id: 'architectural-building', name_id: 'Gedung dengan arsitektur menarik', name_en: 'Building with interesting architecture' },
  { id: 'conference-room', name_id: 'Ruang konferensi profesional', name_en: 'Professional conference room' },
  { id: 'textured-wall', name_id: 'Dinding bertekstur (misal bata, beton)', name_en: 'Textured wall (e.g., brick, concrete)' },
  { id: 'studio-lighting-setup', name_id: 'Studio dengan setup pencahayaan', name_en: 'Studio with lighting setup' },
  { id: 'minimalist-workspace', name_id: 'Area kerja minimalis', name_en: 'Minimalist workspace' },
  { id: 'outdoor-corporate-plaza', name_id: 'Plaza luar ruangan di area perkantoran', name_en: 'Outdoor corporate plaza' },
  { id: 'dark-gradient-backdrop', name_id: 'Latar belakang gradien gelap', name_en: 'Dark gradient backdrop' },
  OTHER_OPTION,
];

export const CHILDREN_BACKGROUNDS: StyleOption[] = [
  { id: 'colorful-playroom', name_id: 'Ruang Bermain Penuh Warna', name_en: 'Colorful Playroom' },
  { id: 'sunny-playground', name_id: 'Taman Bermain Cerah', name_en: 'Sunny Playground' },
  { id: 'fantasy-world', name_id: 'Dunia Fantasi (Istana, Luar Angkasa)', name_en: 'Fantasy World (Castle, Outer Space)' },
  { id: 'cozy-bedroom', name_id: 'Kamar Tidur Nyaman dengan Bantal', name_en: 'Cozy Bedroom with Pillows' },
  { id: 'field-of-wildflowers', name_id: 'Padang Bunga Liar', name_en: 'Field of Wildflowers' },
  { id: 'beach-sandcastles', name_id: 'Pantai sambil Membuat Istana Pasir', name_en: 'Beach Building Sandcastles' },
  { id: 'backyard-treehouse', name_id: 'Halaman Belakang dengan Rumah Pohon', name_en: 'Backyard with a Treehouse' },
  { id: 'carnival-carousel', name_id: 'Karnaval dengan Komidi Putar', name_en: 'Carnival with a Carousel' },
  { id: 'children-library', name_id: 'Perpustakaan Anak', name_en: 'Children\'s Library' },
  { id: 'solid-neutral-backdrop', name_id: 'Latar belakang warna netral solid (abu-abu, putih)', name_en: 'Solid neutral color backdrop (gray, white)' },
  { id: 'simple-colorful-studio', name_id: 'Latar Studio Warna-warni', name_en: 'Simple Colorful Studio Backdrop' },
  { id: 'studio-single-color', name_id: 'Latar studio 1 warna (mix and match dengan warna baju)', name_en: 'Single color studio background (mix and match with clothing color)' },
  OTHER_OPTION,
];


export const SYSTEM_PROMPT_TEMPLATE = `Sebuah foto {{photo_type}} profesional, realistis, dan berkualitas tinggi yang menampilkan subjek dari foto yang diunggah. {{gender_instruction}}{{ethnicity_instruction}}{{age_instruction}}Gaya pose: "{{pose_style}}". Latar belakang: "{{background_style}}". {{clothing_material_instruction}}{{aspect_ratio_instruction}}Instruksi tambahan: "{{extra_instructions}}". PENTING: Wajah subjek harus selalu terlihat jelas dan tidak terhalang oleh apapun (seperti tangan atau rambut). Untuk setiap gambar yang dihasilkan, berikan sedikit variasi pada sudut kamera, komposisi, dan ekspresi subjek agar setiap hasil terasa unik seolah-olah diambil dari sesi foto yang sama. SANGAT PENTING: Jika subjek pada foto yang diunggah adalah MANEKIN, ubah menjadi model manusia (anak-anak) yang realistis dan fotogenik, mengenakan pakaian yang sama persis. HILANGKAN SEMUA ELEMEN MANEKIN, TERUTAMA DUDUKAN TIANG SILVER DI BAWAH KAKI, dan pastikan tidak ada bagian manekin yang terlihat sama sekali. Jika subjek pada foto asli adalah MANUSIA, pastikan semua gambar yang dihasilkan menampilkan ORANG YANG SAMA PERSIS dari foto asli. Jangan mengubah wajah atau identitas subjek sama sekali. Pertahankan subjek asli dari foto, termasuk wajah, pakaian, dan penampilan umum, namun tingkatkan kualitas foto secara keseluruhan menjadi terlihat seperti hasil jepretan fotografer profesional. Pencahayaan harus natural dan menarik, dengan depth of field yang sesuai. Hanya hasilkan gambar final, jangan tambahkan teks deskriptif apapun.
`;