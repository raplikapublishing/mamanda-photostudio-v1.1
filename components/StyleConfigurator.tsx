import React, { useMemo } from 'react';
import type { GenerationConfig } from '../types';
import { 
    PHOTO_TYPES, 
    FAMILY_BACKGROUNDS, 
    PERSONAL_BACKGROUNDS, 
    PROFESSIONAL_BACKGROUNDS,
    CHILDREN_BACKGROUNDS,
    FAMILY_POSE_STYLES,
    PERSONAL_POSE_STYLES,
    PROFESSIONAL_POSE_STYLES,
    CHILDREN_POSE_STYLES,
    CHILDREN_AGE_CATEGORIES,
    GENDER_OPTIONS,
    ETHNICITY_OPTIONS,
    ASPECT_RATIO_OPTIONS,
    OTHER_OPTION,
    StyleOption 
} from '../constants';
import { MessageSquareIcon, ShirtIcon } from './IconComponents';
import type { StyleConfiguratorLocale } from '../i18n/locales';

interface StyleConfiguratorProps {
    config: GenerationConfig;
    onConfigChange: <K extends keyof GenerationConfig>(key: K, value: GenerationConfig[K]) => void;
    t: StyleConfiguratorLocale;
    lang: 'id' | 'en';
}

const SelectInput: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: StyleOption[], lang: 'id' | 'en' }> = ({ label, value, onChange, options, lang }) => (
    <div>
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            {label}
        </label>
        <select 
            value={value} 
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 text-neutral-900 dark:text-neutral-100 transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
            }}
        >
            {options.map(opt => <option key={opt.id} value={opt.id}>{opt[lang === 'id' ? 'name_id' : 'name_en']}</option>)}
        </select>
    </div>
);

const CustomInput: React.FC<{ placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ placeholder, value, onChange }) => (
    <div className="mt-2">
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 text-neutral-900 dark:text-neutral-100 text-sm transition"
        />
    </div>
);

export const StyleConfigurator: React.FC<StyleConfiguratorProps> = ({ config, onConfigChange, t, lang }) => {
    
    const backgroundOptions = useMemo(() => {
        switch (config.photoType) {
            case 'personal':
                return PERSONAL_BACKGROUNDS;
            case 'profesional':
                return PROFESSIONAL_BACKGROUNDS;
            case 'anak-anak':
                return CHILDREN_BACKGROUNDS;
            case 'keluarga':
            default:
                return FAMILY_BACKGROUNDS;
        }
    }, [config.photoType]);
    
    const poseOptions = useMemo(() => {
        switch (config.photoType) {
            case 'personal':
                return PERSONAL_POSE_STYLES;
            case 'profesional':
                return PROFESSIONAL_POSE_STYLES;
            case 'anak-anak':
                return CHILDREN_POSE_STYLES;
            case 'keluarga':
            default:
                return FAMILY_POSE_STYLES;
        }
    }, [config.photoType]);

    const showCustomPose = config.poseStyle === OTHER_OPTION.id;
    const showCustomBackground = config.backgroundStyle === OTHER_OPTION.id;

    const handlePhotoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as GenerationConfig['photoType'];
        onConfigChange('photoType', newType);
        
        let defaultBg, defaultPose, defaultGender;
        if (newType === 'personal') {
            defaultBg = PERSONAL_BACKGROUNDS[0];
            defaultPose = PERSONAL_POSE_STYLES[0];
            defaultGender = 'perempuan';
        } else if (newType === 'profesional') {
            defaultBg = PROFESSIONAL_BACKGROUNDS[0];
            defaultPose = PROFESSIONAL_POSE_STYLES[0];
            defaultGender = 'perempuan';
        } else if (newType === 'anak-anak') {
            defaultBg = CHILDREN_BACKGROUNDS[0];
            defaultPose = CHILDREN_POSE_STYLES[0];
            defaultGender = 'campuran';
            onConfigChange('ageCategory', CHILDREN_AGE_CATEGORIES[0].id);
        } else {
            defaultBg = FAMILY_BACKGROUNDS[0];
            defaultPose = FAMILY_POSE_STYLES[0];
            defaultGender = 'campuran';
        }
        
        onConfigChange('backgroundStyle', defaultBg.id);
        onConfigChange('poseStyle', defaultPose.id);
        onConfigChange('gender', defaultGender as GenerationConfig['gender']);
    };

    return (
        <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
             <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-7 h-7 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-bold flex-shrink-0">2</span>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h2>
            </div>
             <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 ml-10 -mt-4 mb-6">
                {t.subtitle}
            </p>
            
            <div className="space-y-4">
                <div>
                    <SelectInput 
                        label={t.photoType}
                        value={config.photoType}
                        onChange={handlePhotoTypeChange}
                        options={PHOTO_TYPES}
                        lang={lang}
                    />
                </div>
                <div>
                    <SelectInput 
                        label={t.aspectRatio}
                        value={config.aspectRatio || 'square'}
                        onChange={(e) => onConfigChange('aspectRatio', e.target.value as GenerationConfig['aspectRatio'])}
                        options={ASPECT_RATIO_OPTIONS}
                        lang={lang}
                    />
                </div>
                {config.photoType === 'anak-anak' && (
                    <div>
                        <SelectInput 
                            label={t.ageCategory}
                            value={config.ageCategory || ''}
                            onChange={(e) => onConfigChange('ageCategory', e.target.value)}
                            options={CHILDREN_AGE_CATEGORIES}
                            lang={lang}
                        />
                    </div>
                )}
                <div>
                    <SelectInput 
                        label={t.gender}
                        value={config.gender || ''}
                        onChange={(e) => onConfigChange('gender', e.target.value as GenerationConfig['gender'])}
                        options={GENDER_OPTIONS}
                        lang={lang}
                    />
                </div>
                <div>
                    <SelectInput 
                        label={t.ethnicity}
                        value={config.ethnicity || 'auto'}
                        onChange={(e) => onConfigChange('ethnicity', e.target.value)}
                        options={ETHNICITY_OPTIONS}
                        lang={lang}
                    />
                </div>
                <div>
                    <SelectInput 
                        label={t.poseStyle}
                        value={config.poseStyle}
                        onChange={(e) => onConfigChange('poseStyle', e.target.value)}
                        options={poseOptions}
                        lang={lang}
                    />
                    {showCustomPose && (
                        <CustomInput
                            placeholder={t.customPosePlaceholder}
                            value={config.customPoseStyle || ''}
                            onChange={(e) => onConfigChange('customPoseStyle', e.target.value)}
                        />
                    )}
                </div>
                <div>
                    <SelectInput 
                        label={t.backgroundStyle}
                        value={config.backgroundStyle}
                        onChange={(e) => onConfigChange('backgroundStyle', e.target.value)}
                        options={backgroundOptions}
                        lang={lang}
                    />
                    {showCustomBackground && (
                        <CustomInput
                            placeholder={t.customBackgroundPlaceholder}
                            value={config.customBackgroundStyle || ''}
                            onChange={(e) => onConfigChange('customBackgroundStyle', e.target.value)}
                        />
                    )}
                </div>
                 <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block flex items-center">
                      <ShirtIcon />
                      <span className="ml-1.5">{t.clothingMaterial}</span>
                    </label>
                    <textarea
                      placeholder={t.clothingMaterialPlaceholder}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 text-neutral-900 dark:text-neutral-100 text-sm resize-none custom-scrollbar"
                      rows={2}
                      value={config.clothingMaterial || ''}
                      onChange={(e) => onConfigChange('clothingMaterial', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block flex items-center">
                      <MessageSquareIcon />
                      <span className="ml-1.5">{t.extraInstructions}</span>
                    </label>
                    <textarea
                      placeholder={t.extraInstructionsPlaceholder}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/20 text-neutral-900 dark:text-neutral-100 text-sm resize-none custom-scrollbar"
                      rows={3}
                      value={config.extraInstructions}
                      onChange={(e) => onConfigChange('extraInstructions', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};