import React from 'react';
import type { ResultItem } from '../types';
import { DownloadIcon, ImageIcon, CopyIcon, CheckIcon, Loader2Icon, UpscaleIcon, InfoIcon } from './IconComponents';
import type { ResultsGridLocale } from '../i18n/locales';

interface ResultsGridProps {
    results: ResultItem[];
    onDownloadAll: () => void;
    onUpscaleAll: () => void;
    isUpscaling: boolean;
    t: ResultsGridLocale;
    aspectRatio: 'portrait' | 'square' | 'landscape' | 'story';
}

const ResultCard: React.FC<{ result: ResultItem; t: ResultsGridLocale; aspectRatio: 'portrait' | 'square' | 'landscape' | 'story'; }> = ({ result, t, aspectRatio }) => {
    const [copied, setCopied] = React.useState(false);
    const [showPrompt, setShowPrompt] = React.useState(false);

    const handleCopy = () => {
        if (!result.data?.prompt) return;
        navigator.clipboard.writeText(result.data.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const aspectRatioClass = {
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-[16/9]',
        story: 'aspect-[9/16]',
    }[aspectRatio];

    const renderContent = () => {
        switch (result.status) {
            case 'empty':
                return (
                    <div className={`${aspectRatioClass} bg-neutral-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center`}>
                        <div className="text-center">
                            <ImageIcon />
                            <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{t.emptyState}</p>
                        </div>
                    </div>
                );
            
            case 'generating':
            case 'upscaling':
                 return (
                    <div className={`${aspectRatioClass} bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden`}>
                        {result.data?.imageUrl && <img src={result.data.imageUrl} alt={t.altText} className="w-full h-full object-contain blur-sm brightness-90" />}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent animate-shimmer" />
                        <div className="text-center z-10 absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                            <Loader2Icon />
                            <p className="mt-2 text-xs text-white font-medium drop-shadow-md">
                                {result.status === 'generating' ? t.generatingState : t.upscalingState}
                            </p>
                        </div>
                    </div>
                );

            case 'error':
                return (
                     <div className={`${aspectRatioClass} bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border-2 border-dashed border-red-200 dark:border-red-500/30 flex items-center justify-center p-4`}>
                        <div className="text-center">
                            <p className="text-xs font-semibold">{t.errorState}</p>
                        </div>
                    </div>
                );

            case 'completed':
                if (!result.data) return null;
                const imageUrl = result.upscaledImageUrl || result.data.imageUrl;
                const isUpscaled = !!result.upscaledImageUrl;
                return (
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800 flex flex-col group">
                        <div className={`relative ${aspectRatioClass} bg-neutral-100 dark:bg-neutral-800`}>
                           {isUpscaled && (
                                <div className="absolute top-2 left-2 z-10 bg-primary-orange/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {t.upscaled}
                                </div>
                            )}
                            <img 
                                src={imageUrl} 
                                alt={t.altText}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center space-x-2">
                                <a href={imageUrl} download={`ano_foto_pro_${Date.now()}.png`} className="p-2.5 bg-white/90 rounded-lg hover:bg-white transition-colors" title={t.download}>
                                    <DownloadIcon small />
                                </a>
                                <button onClick={handleCopy} className="p-2.5 bg-white/90 rounded-lg hover:bg-white transition-colors" title={copied ? t.copied : t.copyPrompt}>
                                    {copied ? <CheckIcon small /> : <CopyIcon small />}
                                </button>
                                <button onClick={() => setShowPrompt(p => !p)} className="p-2.5 bg-white/90 rounded-lg hover:bg-white transition-colors" title={showPrompt ? t.hidePrompt : t.showPrompt}>
                                    <InfoIcon small />
                                </button>
                            </div>
                        </div>
                        {showPrompt && result.data.prompt && (
                            <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700">
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 custom-scrollbar max-h-20 overflow-y-auto">
                                    {result.data.prompt}
                                </p>
                            </div>
                        )}
                    </div>
                );
            
            default: return null;
        }
    };
    
    return <div>{renderContent()}</div>;
};

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results, onDownloadAll, onUpscaleAll, isUpscaling, t, aspectRatio }) => {
    const hasCompletedResults = results.some(r => r.status === 'completed');
    const hasUpscalableResults = results.some(r => r.status === 'completed' && !r.upscaledImageUrl);

    return (
        <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-start justify-between mb-6">
                 <div>
                    <div className="flex items-center gap-3">
                         <span className="flex items-center justify-center w-7 h-7 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-bold flex-shrink-0">3</span>
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h2>
                    </div>
                     <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 ml-10">
                        {t.subtitle}
                    </p>
                </div>
                {hasCompletedResults && (
                    <button onClick={onDownloadAll} className="flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 bg-primary-orange text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                        <DownloadIcon small />
                        <span>{t.downloadAll}</span>
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {results.map((result) => (
                    <ResultCard key={result.id} result={result} t={t} aspectRatio={aspectRatio} />
                ))}
            </div>

            {hasUpscalableResults && (
                <div className="mt-6">
                    <button
                        onClick={onUpscaleAll}
                        disabled={isUpscaling}
                        className="w-full bg-gradient-to-r from-primary-orange-light to-primary-orange text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-orange hover:to-primary-dark transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                    >
                        {isUpscaling ? (
                            <>
                                <Loader2Icon />
                                <span>{t.upscalingState}</span>
                            </>
                        ) : (
                            <>
                                <UpscaleIcon />
                                <span className="ml-2">{t.upscaleAll}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};