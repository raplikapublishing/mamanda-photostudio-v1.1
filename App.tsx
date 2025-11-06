import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { StyleConfigurator } from './components/StyleConfigurator';
import { ResultsGrid } from './components/ResultDisplay';
import { FeaturesModal } from './components/FeaturesModal';
import { FaqModal } from './components/FaqModal';
import type { GenerationConfig, ResultItem, HistoryItem, SourceImages } from './types';
import { generatePhotography, buildPrompt } from './services/geminiService';
import { upscaleImage } from './services/geminiService';
import { 
    FAMILY_POSE_STYLES, 
    PHOTO_TYPES, 
    FAMILY_BACKGROUNDS, 
    CHILDREN_AGE_CATEGORIES,
    PERSONAL_BACKGROUNDS, 
    PROFESSIONAL_BACKGROUNDS,
    CHILDREN_BACKGROUNDS,
    PERSONAL_POSE_STYLES,
    PROFESSIONAL_POSE_STYLES,
    CHILDREN_POSE_STYLES,
    ASPECT_RATIO_OPTIONS,
} from './constants';
import type { StyleOption } from './constants';
import { LogoIcon, WandIcon, HistoryIcon, TrashIcon, ChevronDownIcon, CheckIcon as ApplyIcon } from './components/IconComponents';
import { getCookie, setCookie } from './utils/cookies';
import { locales, Locale, HistoryPanelLocale } from './i18n/locales';

declare const JSZip: any;

// +--------------------------+
// |   History Panel Component  |
// +--------------------------+

// Helper function to get a user-friendly time difference string
const timeAgo = (timestamp: number, lang: 'id' | 'en' = 'en'): string => {
    const now = new Date();
    const secondsPast = (now.getTime() - timestamp) / 1000;

    const intervals = [
        { label_en: 'year', label_id: 'tahun', seconds: 31536000 },
        { label_en: 'month', label_id: 'bulan', seconds: 2592000 },
        { label_en: 'week', label_id: 'minggu', seconds: 604800 },
        { label_en: 'day', label_id: 'hari', seconds: 86400 },
        { label_en: 'hour', label_id: 'jam', seconds: 3600 },
        { label_en: 'minute', label_id: 'menit', seconds: 60 },
        { label_en: 'second', label_id: 'detik', seconds: 1 }
    ];

    const getStrings = (l: 'id' | 'en') => ({
        ago: l === 'id' ? 'yang lalu' : 'ago',
        justNow: l === 'id' ? 'Baru saja' : 'Just now',
    });

    const strings = getStrings(lang);

    if (secondsPast < 10) return strings.justNow;

    for (const interval of intervals) {
        const count = Math.floor(secondsPast / interval.seconds);
        if (count >= 1) {
            const label = lang === 'id' ? interval.label_id : interval.label_en + (count > 1 ? 's' : '');
            return `${count} ${label} ${strings.ago}`;
        }
    }

    return strings.justNow;
};

const allPoseOptions = [...FAMILY_POSE_STYLES, ...PERSONAL_POSE_STYLES, ...PROFESSIONAL_POSE_STYLES, ...CHILDREN_POSE_STYLES];
const allBackgroundOptions = [...FAMILY_BACKGROUNDS, ...PERSONAL_BACKGROUNDS, ...PROFESSIONAL_BACKGROUNDS, ...CHILDREN_BACKGROUNDS];

const getOptionName = (id: string, options: StyleOption[], lang: 'id' | 'en') => {
    if (!id) return '-';
    const option = options.find(opt => opt.id === id);
    const name = option ? option[lang === 'id' ? 'name_id' : 'name_en'] : id;
    return name.length > 25 ? name.substring(0, 22) + '...' : name;
};

interface HistoryPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    history: HistoryItem[];
    onApply: (config: GenerationConfig) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    t: HistoryPanelLocale;
    lang: 'id' | 'en';
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onToggle, history, onApply, onDelete, onClear, t, lang }) => {
    return (
        <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 mt-6">
            <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left" aria-expanded={isOpen}>
                <div className="flex items-center gap-3">
                    <HistoryIcon />
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{t.title}</h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                    {history.length === 0 ? (
                        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 py-4">{t.empty}</p>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar pr-2 -mr-2">
                                {history.map(item => (
                                    <div key={item.id} className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{timeAgo(item.timestamp, lang)}</p>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => onApply(item.config)} title={t.useConfig} className="flex items-center gap-1.5 text-xs font-semibold text-primary-orange hover:text-primary-dark transition-colors px-2 py-1 rounded-md hover:bg-primary-orange/10">
                                                    <ApplyIcon small />
                                                    {t.useConfig}
                                                </button>
                                                <button onClick={() => onDelete(item.id)} title={t.delete} className="p-1.5 text-neutral-500 hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-500 text-[10px]">{t.photoType}</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{getOptionName(item.config.photoType, PHOTO_TYPES, lang)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-500 text-[10px]">{t.aspectRatio}</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{getOptionName(item.config.aspectRatio, ASPECT_RATIO_OPTIONS, lang)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-500 text-[10px]">{t.pose}</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{getOptionName(item.config.poseStyle, allPoseOptions, lang)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-400 dark:text-neutral-500 text-[10px]">{t.background}</span>
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">{getOptionName(item.config.backgroundStyle, allBackgroundOptions, lang)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <button onClick={onClear} className="w-full text-center text-sm text-red-500 hover:text-red-700 font-semibold transition-colors py-1">
                                    {t.clearAll}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// +--------------------------+
// |  Watermark Utility       |
// +--------------------------+
const applyWatermark = (baseImageUrl: string, logoImageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const baseImage = new Image();
        const logoImage = new Image();

        baseImage.crossOrigin = "Anonymous";
        logoImage.crossOrigin = "Anonymous";

        let loaded = 0;
        const onBothLoaded = () => {
            if (++loaded < 2) return;

            const canvas = document.createElement('canvas');
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw base image
            ctx.drawImage(baseImage, 0, 0);

            // Calculate logo size and position
            const padding = baseImage.width * 0.03; // 3% padding
            const maxLogoWidth = baseImage.width * 0.24; // max 24% of image width (increased by 1.2x)
            const scale = Math.min(1, maxLogoWidth / logoImage.width);
            const logoWidth = logoImage.width * scale;
            const logoHeight = logoImage.height * scale;

            const x = canvas.width - logoWidth - padding;
            const y = canvas.height - logoHeight - padding;
            
            // Draw logo
            ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);

            resolve(canvas.toDataURL('image/png'));
        };

        baseImage.onload = onBothLoaded;
        logoImage.onload = onBothLoaded;
        baseImage.onerror = reject;
        logoImage.onerror = reject;
        
        baseImage.src = baseImageUrl;
        logoImage.src = logoImageUrl;
    });
};

const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


const App: React.FC = () => {
    const [sourceImages, setSourceImages] = useState<SourceImages>({ main: null, reference: null });
    const [results, setResults] = useState<ResultItem[]>(
        Array.from({ length: 6 }, (_, i) => ({ id: i, status: 'empty' }))
    );
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState<'id' | 'en'>(() => {
        const savedLang = getCookie('language');
        return savedLang === 'en' ? 'en' : 'id';
    });
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const t: Locale = locales[language];

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    useEffect(() => {
        setCookie('language', language, 365);
        document.documentElement.lang = language;
    }, [language]);
    
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('mamanda_history');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === 'id' ? 'en' : 'id');
    };

    const [config, setConfig] = useState<GenerationConfig>({
        photoType: 'keluarga',
        poseStyle: FAMILY_POSE_STYLES[0].id,
        customPoseStyle: '',
        backgroundStyle: FAMILY_BACKGROUNDS[0].id,
        customBackgroundStyle: '',
        extraInstructions: '',
        ageCategory: CHILDREN_AGE_CATEGORIES[0].id,
        gender: 'campuran',
        clothingMaterial: '',
        ethnicity: 'auto',
        aspectRatio: 'square',
    });

    const updateHistory = (newHistory: HistoryItem[]) => {
        const sortedHistory = newHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sortedHistory);
        try {
            localStorage.setItem('mamanda_history', JSON.stringify(sortedHistory));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    };

    const handleImageChange = (type: 'main' | 'reference', file: File | null) => {
        setSourceImages(prev => ({ ...prev, [type]: file }));
        if (type === 'main' && !file) { // If main image is removed
            setSourceImages(prev => ({ ...prev, reference: null })); // Also remove logo
        }
        if (type === 'main') {
            setResults(Array.from({ length: 6 }, (_, i) => ({ id: i, status: 'empty' })));
            setError(null);
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!sourceImages.main) {
            setError(t.app.uploadError);
            return;
        }
        
        // Note: hasReferenceImage is now effectively hasLogoImage
        const prompt = buildPrompt(config, false); // Always false, logo is not for prompt
        const newHistoryItem: HistoryItem = {
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            config,
            prompt,
        };
        const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Keep last 50
        updateHistory(updatedHistory);

        setIsGenerating(true);
        setError(null);
        setResults(prev => prev.map(r => ({ ...r, status: 'generating' })));

        try {
            const generatedData = await generatePhotography(sourceImages, config);

            let finalData = generatedData;

            // Apply watermark if logo is provided
            if (sourceImages.reference) {
                const logoDataUrl = await fileToDataURL(sourceImages.reference);
                const watermarkedImages = await Promise.all(
                    generatedData.map(img => applyWatermark(img.imageUrl, logoDataUrl))
                );
                finalData = generatedData.map((data, index) => ({
                    ...data,
                    imageUrl: watermarkedImages[index],
                }));
            }

            setResults(prev => prev.map((item, index) => ({
                ...item,
                status: 'completed',
                data: finalData[index],
            })));
        } catch (e) {
            let errorMessage = e instanceof Error ? e.message : t.app.generationErrorGeneral;
            console.error(e);
            setError(errorMessage);
            setResults(prev => prev.map(item => ({
                ...item,
                status: 'error',
                errorMessage: t.app.generationErrorSpecific,
            })));
        } finally {
            setIsGenerating(false);
        }
    }, [sourceImages, config, history, t]);

    const handleUpscaleAll = useCallback(async () => {
        const targets = results.filter(r => r.status === 'completed' && !r.upscaledImageUrl);
        if (targets.length === 0) return;

        setIsUpscaling(true);
        setError(null);

        setResults(prev => prev.map(r => 
            targets.some(t => t.id === r.id) ? { ...r, status: 'upscaling' } : r
        ));

        const upscalePromises = targets.map(async (result) => {
            try {
                if (!result.data?.imageUrl) throw new Error("Source image URL not found for upscaling.");
                const base64Data = result.data.imageUrl.split(',')[1];
                const mimeType = result.data.imageUrl.split(';')[0].split(':')[1];
                let upscaledImageUrl = await upscaleImage(base64Data, mimeType);

                // Re-apply watermark to upscaled image if logo exists
                if (sourceImages.reference) {
                    const logoDataUrl = await fileToDataURL(sourceImages.reference);
                    upscaledImageUrl = await applyWatermark(upscaledImageUrl, logoDataUrl);
                }

                return { id: result.id, upscaledImageUrl, error: null };
            } catch (e) {
                console.error(`Upscale failed for result ${result.id}:`, e);
                return { id: result.id, upscaledImageUrl: null, error: e as Error };
            }
        });

        const settledResults = await Promise.all(upscalePromises);

        setResults(prev => {
            const newResults = [...prev];
            settledResults.forEach(res => {
                const index = newResults.findIndex(r => r.id === res.id);
                if (index !== -1) {
                    newResults[index] = {
                        ...newResults[index],
                        status: 'completed',
                        upscaledImageUrl: res.upscaledImageUrl ?? newResults[index].upscaledImageUrl,
                    };
                }
            });
            return newResults;
        });
        
        if (settledResults.some(res => res.error)) {
            setError(t.app.upscaleError);
        }

        setIsUpscaling(false);
    }, [results, t, sourceImages.reference]);

    const handleDownloadAll = async () => {
        const completedResults = results.filter(r => r.status === 'completed' && (r.data?.imageUrl || r.upscaledImageUrl));
        if (completedResults.length === 0) return;

        const zip = new JSZip();
        const timestamp = new Date().getTime();

        await Promise.all(completedResults.map(async (result, index) => {
            const imageUrl = result.upscaledImageUrl || result.data!.imageUrl;
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            zip.file(`mamanda_foto_studio_${timestamp}_v${index + 1}.png`, blob);
        }));

        zip.generateAsync({ type: "blob" }).then((content: Blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `mamanda_foto_studio_${timestamp}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
    
    const handleApplyHistory = (configToApply: GenerationConfig) => {
        setConfig(configToApply);
        setIsHistoryOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteHistoryItem = (id: string) => {
        const updatedHistory = history.filter(item => item.id !== id);
        updateHistory(updatedHistory);
    };

    const handleClearHistory = () => {
        if (window.confirm(t.historyPanel.clearAllConfirm)) {
            updateHistory([]);
        }
    };

    const updateConfig = <K extends keyof GenerationConfig>(key: K, value: GenerationConfig[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 flex flex-col">
            <Header 
                theme={theme}
                toggleTheme={toggleTheme}
                language={language}
                toggleLanguage={toggleLanguage}
                t={t.header}
            />
            <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Input & Configuration */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="space-y-6">
                            <ImageUploader 
                                onImageChange={handleImageChange}
                                sourceImages={sourceImages}
                                t={t.imageUploader}
                                onError={setError}
                            />
                            <StyleConfigurator 
                              config={config}
                              onConfigChange={updateConfig}
                              t={t.styleConfigurator}
                              lang={language}
                            />
                            <HistoryPanel
                                isOpen={isHistoryOpen}
                                onToggle={() => setIsHistoryOpen(p => !p)}
                                history={history}
                                onApply={handleApplyHistory}
                                onDelete={handleDeleteHistoryItem}
                                onClear={handleClearHistory}
                                t={t.historyPanel}
                                lang={language}
                            />
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !sourceImages.main}
                                className="w-full bg-gradient-to-r from-primary-orange-light to-primary-orange text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-orange hover:to-primary-dark transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                            >
                               {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{t.app.processing}</span>
                                    </>
                                ) : (
                                    <>
                                        <WandIcon />
                                        <span>{t.app.generateButton}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Panel: Results Grid */}
                    <div className="col-span-12 lg:col-span-7">
                        <div className="lg:sticky lg:top-28">
                            <ResultsGrid
                                results={results}
                                onDownloadAll={handleDownloadAll}
                                onUpscaleAll={handleUpscaleAll}
                                isUpscaling={isUpscaling}
                                t={t.resultsGrid}
                                aspectRatio={config.aspectRatio}
                            />
                        </div>
                    </div>
                </div>
            </main>
             <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Brand */}
                        <div className="col-span-1">
                            <div className="flex items-center gap-3">
                                <LogoIcon />
                                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Mamanda PhotoStudio</h2>
                            </div>
                            <p className="mt-4 text-sm">{t.footer.tagline}</p>
                        </div>
                        
                        {/* Column 2: Links */}
                        <div className="col-span-1">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{t.footer.product}</h3>
                            <ul className="space-y-3 mt-4 text-sm">
                                <li><button onClick={() => setIsFeaturesModalOpen(true)} className="hover:text-primary-orange transition-colors">{t.footer.features}</button></li>
                                <li><button onClick={() => setIsFaqModalOpen(true)} className="hover:text-primary-orange transition-colors">{t.footer.faq}</button></li>
                            </ul>
                        </div>
                        
                        {/* Column 3: Social */}
                        <div className="col-span-1">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{t.footer.followUs}</h3>
                            <div className="flex items-center gap-4 mt-4">
                                <a href="https://www.instagram.com/anotechhub/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" aria-label="Instagram">
                                    <img src="https://cdn.simpleicons.org/instagram/9ca3af" alt="Instagram Icon" className="w-6 h-6" />
                                </a>
                                <a href="https://www.threads.net/@anotechhub" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75" aria-label="Threads">
                                    <img src="https://cdn.simpleicons.org/threads/9ca3af" alt="Threads Icon" className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Mamanda. {t.footer.rights}</p>
                    </div>
                </div>
            </footer>

            {error && (
                <div role="alert" className="fixed bottom-8 right-8 z-50 max-w-md w-full p-4 bg-error text-white rounded-xl shadow-2xl transition-transform">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <strong className="block font-medium">{t.app.errorTitle}</strong>
                            <p className="mt-1 text-sm">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="ml-auto text-white/80 hover:text-white">&times;</button>
                    </div>
                </div>
            )}
            <FeaturesModal isOpen={isFeaturesModalOpen} onClose={() => setIsFeaturesModalOpen(false)} t={t.featuresModal} />
            <FaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} t={t.faqModal} />
        </div>
    );
};

export default App;