import React from 'react';

// Per @google/genai guidelines, UI for managing API keys is not permitted.
// The API key must be sourced exclusively from the `process.env.API_KEY` environment variable.
// This component's functionality is in violation of these guidelines and has been disabled.
// The problematic import for `SettingsModalLocale` has been removed, fixing the compilation error.

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any; // The `t` prop is kept for type compatibility but is unused.
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen }) => {
    // This component is unused and its functionality violates @google/genai guidelines.
    // Returning null to effectively disable it.
    if (!isOpen) {
        return null;
    }
    return null;
};
