import React from 'react';
import { LogoIcon, SunIcon, MoonIcon, CoffeeIcon } from './IconComponents';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { HeaderLocale } from '../i18n/locales';

interface HeaderProps {
    theme: string;
    toggleTheme: () => void;
    language: 'id' | 'en';
    toggleLanguage: () => void;
    t: HeaderLocale;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, language, toggleLanguage, t }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-3">
                        <LogoIcon />
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                            Mamanda Photo<span className="text-primary-orange">Studio</span>
                        </h1>
                    </div>
                     <div className="flex items-center space-x-2 sm:space-x-4">
                         <LanguageSwitcher currentLang={language} toggleLang={toggleLanguage} />
                         
                         <a href="https://lynk.id/trianonurhikmat/s/re0nnxqyd36k" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-primary-orange dark:hover:text-primary-orange transition-colors">
                            <CoffeeIcon />
                            <span>{t.support}</span>
                         </a>
                         
                         <button 
                            onClick={toggleTheme}
                            className="h-10 w-10 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label={t.toggleTheme}
                         >
                            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                         </button>
                     </div>
                </div>
            </div>
        </header>
    );
};