import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationConfig, GeneratedImage, SourceImages } from '../types';
import { 
    SYSTEM_PROMPT_TEMPLATE, 
    OTHER_OPTION, 
    RANDOM_POSE_OPTION,
    PHOTO_TYPES,
    FAMILY_POSE_STYLES,
    PERSONAL_POSE_STYLES,
    PROFESSIONAL_POSE_STYLES,
    CHILDREN_POSE_STYLES,
    FAMILY_BACKGROUNDS,
    PERSONAL_BACKGROUNDS,
    PROFESSIONAL_BACKGROUNDS,
    CHILDREN_BACKGROUNDS,
    CHILDREN_AGE_CATEGORIES,
    GENDER_OPTIONS,
    ETHNICITY_OPTIONS,
    ASPECT_RATIO_OPTIONS
} from '../constants';
import type { StyleOption } from '../constants';

/**
 * UTILITY KRITIS: Memaksa gambar input ke Aspect Ratio yang benar dengan cropping, 
 * dan mengkompresi ke JPEG untuk mengurangi ukuran payload data.
 */
const recomposeImageToDataUrl = (file: File, aspectRatio: GenerationConfig['aspectRatio']): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Failed to get canvas context.'));

                const inputWidth = img.width;
                const inputHeight = img.height;
                let targetRatio = 1;

                switch (aspectRatio) {
                    case 'portrait': targetRatio = 3 / 4; break;
                    case 'landscape': targetRatio = 16 / 9; break;
                    case 'story': targetRatio = 9 / 16; break;
                    case 'square': 
                    default: targetRatio = 1; break;
                }
                
                const inputRatio = inputWidth / inputHeight;
                let sourceX, sourceY, sourceW, sourceH; // Area yang akan dipotong dari gambar input

                // Tentukan area sumber (W dan H) agar rasionya sama dengan targetRatio
                if (inputRatio > targetRatio) {
                    // Input lebih lebar dari target -> Potong lebar
                    sourceH = inputHeight;
                    sourceW = inputHeight * targetRatio;
                    sourceX = (inputWidth - sourceW) / 2;
                    sourceY = 0;

                } else if (inputRatio < targetRatio) {
                    // Input lebih tinggi dari target -> Potong tinggi
                    sourceW = inputWidth;
                    sourceH = inputWidth / targetRatio;
                    sourceX = 0;
                    sourceY = (inputHeight - sourceH) / 2;

                } else {
                    // Rasio sudah cocok
                    sourceW = inputWidth;
                    sourceH = inputHeight;
                    sourceX = 0;
                    sourceY = 0;
                }
                
                // Set ukuran canvas baru sama dengan area yang dipotong (sourceW x sourceH)
                canvas.width = sourceW; 
                canvas.height = sourceH;
                
                // Draw only the cropped part of the input image onto the new canvas
                ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

                // Menggunakan JPEG untuk kompresi dan mengurangi ukuran payload
                resolve(canvas.toDataURL('image/jpeg', 0.95)); 

            };
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


const dataURLToGenerativePart = (dataUrl: string) => {
    const [mimePart, base64Part] = dataUrl.split(',');
    const mimeTypeMatch = mimePart.match(/:(.*?);/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'; 
    
    return {
        inlineData: { data: base64Part, mimeType: mimeType },
    };
}


const allPoseOptions = [
    ...FAMILY_POSE_STYLES,
    ...PERSONAL_POSE_STYLES,
    ...PROFESSIONAL_POSE_STYLES,
    ...CHILDREN_POSE_STYLES,
];
const allBackgroundOptions = [
    ...FAMILY_BACKGROUNDS,
    ...PERSONAL_BACKGROUNDS,
    ...PROFESSIONAL_BACKGROUNDS,
    ...CHILDREN_BACKGROUNDS,
];

const getIndonesianName = (id: string, options: StyleOption[]): string => {
    const option = options.find(opt => opt.id === id);
    return option ? option.name_id : id;
};

export const buildPrompt = (config: GenerationConfig, hasReferenceImage: boolean): string => {
    const photoTypeName = getIndonesianName(config.photoType, PHOTO_TYPES);
    
    let finalPoseStyle: string;
    if (config.poseStyle === OTHER_OPTION.id) {
        finalPoseStyle = config.customPoseStyle || 'Gaya pose yang ditentukan oleh pengguna';
    } else if (config.poseStyle === RANDOM_POSE_OPTION.id) {
        finalPoseStyle = 'Pose yang kreatif dan natural yang dipilih oleh AI, yang paling sesuai dengan subjek dan suasana foto.';
    } else {
        finalPoseStyle = getIndonesianName(config.poseStyle, allPoseOptions);
    }
    
    let finalBackgroundStyle: string;
    if (config.backgroundStyle === OTHER_OPTION.id) {
        finalBackgroundStyle = config.customBackgroundStyle || 'Latar belakang yang ditentukan oleh pengguna';
    } else if (config.backgroundStyle === 'studio-single-color') {
        finalBackgroundStyle = '1 warna background, tidak perlu sama dengan warna baju, bisa berbeda warna, tapi match dengan warna baju.';
    } else {
        finalBackgroundStyle = getIndonesianName(config.backgroundStyle, allBackgroundOptions);
    }

    let aspectRatioInstruction = '';
    if (config.aspectRatio) {
        let ratioDescription = '';
        switch(config.aspectRatio) {
            case 'square':
                ratioDescription = 'persegi (1:1 - 1080x1080 piksel)';
                break;
            case 'portrait':
                ratioDescription = 'potret (3:4 - 1080x1440 piksel)';
                break;
            case 'landscape':
                ratioDescription = 'lanskap (16:9 - 1920x1080 piksel)';
                break;
            case 'story':
                ratioDescription = 'vertikal/story (9:16 - 1080x1920 piksel)';
                break;
            default:
                const ratioName = getIndonesianName(config.aspectRatio, ASPECT_RATIO_OPTIONS).split(' ')[0].toLowerCase();
                ratioDescription = ratioName;
        }
        
        // Prompt disederhanakan dan menjadi penegasan, karena gambar input sudah diubah rasionya
        aspectRatioInstruction = `Aspek rasio gambar **SUDAH** dalam rasio ${ratioDescription}. Pastikan komposisi subjek berada di tengah bingkai rasio ini.`;
    }

    let ageInstruction = '';
    if (config.photoType === 'anak-anak' && config.ageCategory) {
        const ageCategoryName = getIndonesianName(config.ageCategory, CHILDREN_AGE_CATEGORIES);
        ageInstruction = `Subjek adalah anak-anak dalam kategori usia: ${ageCategoryName}. Pastikan suasana ceria, menyenangkan, dan menangkap kepolosan serta kegembiraan yang sesuai dengan usia tersebut. Gunakan warna-warna cerah dan bersemangat. `;
    }

    let genderInstruction = '';
    if (config.gender) {
        const genderName = getIndonesianName(config.gender, GENDER_OPTIONS);
        genderInstruction = `Subjek dalam foto adalah ${genderName}. `;
    }
    
    let ethnicityInstruction = '';
    if (config.ethnicity && config.ethnicity !== 'auto') {
        const ethnicityName = getIndonesianName(config.ethnicity, ETHNICITY_OPTIONS);
        ethnicityInstruction = `Subjek dalam foto adalah etnis ${ethnicityName}. `;
    }

    let clothingMaterialInstruction = '';
    if (config.clothingMaterial && config.clothingMaterial.trim() !== '') {
        clothingMaterialInstruction = `Bahan pakaian: "${config.clothingMaterial}". Pastikan tekstur dan jatuhnya bahan terlihat realistis. `;
    }

    let prompt = SYSTEM_PROMPT_TEMPLATE
        .replace('{{photo_type}}', photoTypeName)
        .replace('{{gender_instruction}}', genderInstruction)
        .replace('{{ethnicity_instruction}}', ethnicityInstruction)
        .replace('{{age_instruction}}', ageInstruction)
        .replace('{{pose_style}}', finalPoseStyle)
        .replace('{{background_style}}', finalBackgroundStyle)
        .replace('{{clothing_material_instruction}}', clothingMaterialInstruction)
        .replace('{{aspect_ratio_instruction}}', aspectRatioInstruction)
        .replace('{{extra_instructions}}', config.extraInstructions || 'Tidak ada instruksi tambahan.');
        
    return prompt;
};

export const generatePhotography = async (sourceImages: SourceImages, config: GenerationConfig): Promise<GeneratedImage[]> => {
    if (!sourceImages.main) {
        throw new Error("Main source image is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image';
    
    // PERBAIKAN KRITIS: Pre-process gambar utama SEBELUM dikirim ke API (sudah dicrop dan dikompresi ke JPEG)
    const precomposedDataUrl = await recomposeImageToDataUrl(sourceImages.main, config.aspectRatio);
    const mainImagePart = dataURLToGenerativePart(precomposedDataUrl);

    const textPrompt = buildPrompt(config, false); // hasReferenceImage is always false now
    const textPart = { text: textPrompt };

    const parts = [mainImagePart, textPart];

    // +++ TAMBAHAN: Buat pemetaan untuk API +++
    const aspectRatioMap = {
      'square': 'SQUARE',
      'portrait': 'PORTRAIT',
      'landscape': 'LANDSCAPE',
      'story': 'STORY',
    };
    
    // Ambil nilai yang benar untuk API, default ke SQUARE jika tidak ada
    const apiAspectRatio = aspectRatioMap[config.aspectRatio] || 'SQUARE';

    const generateSingleImage = async (): Promise<string> => {
        const result = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },

           // +++ PERBAIKAN: Tambahkan generationConfig di sini +++
            generationConfig: {
                // Konfigurasi API ini sekarang akan bekerja karena input gambarnya sendiri sudah sesuai rasio
                imageGenerationConfig: { 
                    aspectRatio: apiAspectRatio,
                }
            },

            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (!result.candidates || result.candidates.length === 0) {
            throw new Error("API response does not contain any candidates.");
        }
        
        const imagePartResponse = result.candidates[0]?.content?.parts.find(part => part.inlineData);

        if (imagePartResponse && imagePartResponse.inlineData) {
            const base64ImageBytes = imagePartResponse.inlineData.data;
            return `data:${imagePartResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else {
            const textResponsePart = result.candidates[0]?.content?.parts.find(part => part.text);
            const textResponse = textResponsePart?.text?.trim() || "No text response found.";
            
            console.warn("API did not return an image. Text response:", textResponse);
            
            // Perbaikan Error Handling: Cek jika respons hanya terdiri dari backtick/whitespace
            const cleanedText = textResponse.replace(/`/g, '').trim();

            const isEmptyOrProblematic = cleanedText.length === 0 || 
                                         textResponse === 'No text response found.';
            
            let errorMessage = "Gagal menghasilkan gambar. Model AI tidak dapat memproses permintaan ini. Coba sesuaikan konfigurasi gaya, kurangi instruksi tambahan, atau gunakan foto utama yang berbeda.";
            
            // Jika respons adalah teks yang substansial dan bukan hanya backtick/whitespace
            if (!isEmptyOrProblematic) {
                errorMessage = `Gagal menghasilkan gambar. Pesan dari AI: "${textResponse}"`;
            }
            
            throw new Error(errorMessage);
        }
    };

    const imagePromises = Array(6).fill(null).map(() => generateSingleImage());
    const imageResults = await Promise.all(imagePromises);
    
    return imageResults.map(imageUrl => ({
        imageUrl,
        prompt: textPrompt,
    }));
};

export const upscaleImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image';

    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: 'Tingkatkan resolusi gambar ini menjadi 2K. Pertajam detail, tingkatkan kualitas dan pencahayaan secara keseluruhan, namun JANGAN mengubah subjek, komposisi, atau elemen asli apa pun di dalam gambar. Hasil harus terlihat seperti versi resolusi tinggi dari gambar asli.',
    };

    const result = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    if (!result.candidates || result.candidates.length === 0) {
        throw new Error("API response for upscale does not contain any candidates.");
    }

    const imagePartResponse = result.candidates[0]?.content?.parts.find(part => part.inlineData);

    if (imagePartResponse && imagePartResponse.inlineData) {
        const base64ImageBytes = imagePartResponse.inlineData.data;
        return `data:${imagePartResponse.inlineData.mimeType};base64,${base64ImageBytes}`;
    } else {
        const textResponse = result.text || "API didakt return an upscaled image.";
        console.warn("Upscale failed. Text response:", textResponse);
        throw new Error(`Gagal melakukan upscale: ${textResponse}`);
    }
};