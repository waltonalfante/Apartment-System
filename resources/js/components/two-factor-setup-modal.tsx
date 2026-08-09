import React from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

// Two-factor UI is disabled. This stub component preserves the API
// shape so pages can import it without the original implementation.
export default function TwoFactorSetupModal(_props: Props) {
    return null;
}
