import React, { useState, useCallback, useMemo } from 'react';
import { UploadCloudIcon, XIcon, ImageIcon } from './IconComponents';
import type { ImageUploaderLocale } from '../i18n/locales';
import type { SourceImages } from '../types';

interface ImageUploaderProps {
    onImageChange: (type: 'main' | 'reference', file: File | null) => void;
    sourceImages: SourceImages;
    t: ImageUploaderLocale;
    onError: (message: string) => void;
}

const UploaderBox: React.FC<{
    file: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    onError: (message: string) => void;
    title: string;
    subtitle: string;
    t: ImageUploaderLocale;
}> = ({ file, onFileSelect, onFileRemove, onError, title, subtitle, t }) => {
    const [isDragging, setIsDragging] = useState(false);

    const imageUrl = useMemo(() => {
        return file ? URL.createObjectURL(file) : null;
    }, [file]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
            const SUPPORTED_TYPES = ['image/png', 'image/jpeg'];

            if (!SUPPORTED_TYPES.includes(selectedFile.type)) {
                onError(t.fileTypeError);
                return;
            }

            if (selectedFile.size > MAX_SIZE_BYTES) {
                onError(t.fileSizeError);
                return;
            }
            onFileSelect(selectedFile);
        }
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }, [handleFileChange]);

    return (
        <div>
            <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-3">{subtitle}</p>
            {!imageUrl ? (
                <label
                    htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`}
                    className={`group block w-full cursor-pointer`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                >
                     <div className={`border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-xl p-6 text-center transition-all duration-200 ${isDragging ? 'border-primary-orange bg-orange-50/50 dark:bg-orange-900/20' : 'group-hover:border-primary-orange group-hover:bg-orange-50/30 dark:group-hover:bg-orange-900/10'}`}>
                        <UploadCloudIcon isHovered={isDragging} />
                        <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">{t.dragAndDrop}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t.fileConstraints}</p>
                     </div>
                     <input id={`file-upload-${title.replace(/\s+/g, '-')}`} type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e.target.files)} />
                </label>
            ) : (
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                    <img src={imageUrl} alt={t.imagePreviewAlt} className="w-full h-40 object-contain" />
                    <button onClick={onFileRemove} className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/80 transition-colors" aria-label={t.removeImage}>
                        <XIcon />
                    </button>
                </div>
            )}
        </div>
    );
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, sourceImages, t, onError }) => {
    return (
        <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-bold flex-shrink-0">1</span>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h2>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <UploaderBox
                    file={sourceImages.main}
                    onFileSelect={(file) => onImageChange('main', file)}
                    onFileRemove={() => onImageChange('main', null)}
                    onError={onError}
                    title={t.mainPhotoTitle}
                    subtitle={t.mainPhotoSubtitle}
                    t={t}
                />
                
                <UploaderBox
                    file={sourceImages.reference}
                    onFileSelect={(file) => onImageChange('reference', file)}
                    onFileRemove={() => onImageChange('reference', null)}
                    onError={onError}
                    title={t.referencePhotoTitle}
                    subtitle={t.referencePhotoSubtitle}
                    t={t}
                />
            </div>
        </div>
    );
};