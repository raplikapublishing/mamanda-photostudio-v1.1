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

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

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
                ratioDescription = 'persegi (1:1)';
                break;
            case 'portrait':
                ratioDescription = 'potret (3:4), dengan resolusi ideal 1080x1440 piksel';
                break;
            case 'landscape':
                ratioDescription = 'lanskap (16:9)';
                break;
            case 'story':
                ratioDescription = 'vertikal/story (9:16), dengan resolusi ideal 1080x1920 piksel';
                break;
            default:
                 // Fallback to keep it working if something unexpected is passed
                const ratioName = getIndonesianName(config.aspectRatio, ASPECT_RATIO_OPTIONS).split(' ')[0].toLowerCase();
                ratioDescription = ratioName;
        }
        aspectRatioInstruction = `Aspek rasio gambar harus ${ratioDescription}. `;
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
    
    const mainImagePart = await fileToGenerativePart(sourceImages.main);
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
                // Perubahan PENTING: Tambahkan nesting imageGenerationConfig
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
            let errorMessage = "Gagal menghasilkan gambar. Coba sesuaikan prompt Anda atau gunakan gambar lain.";
            if (textResponse && textResponse.length > 5) {
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
        const textResponse = result.text || "API did not return an upscaled image.";
        console.warn("Upscale failed. Text response:", textResponse);
        throw new Error(`Gagal melakukan upscale: ${textResponse}`);
    }
};
