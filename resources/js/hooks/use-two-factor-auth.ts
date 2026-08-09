export type UseTwoFactorAuthReturn = {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    recoveryCodesList: string[];
    hasSetupData: boolean;
    errors: string[];
    clearErrors: () => void;
    clearSetupData: () => void;
    fetchQrCode: () => Promise<void>;
    fetchSetupKey: () => Promise<void>;
    fetchSetupData: () => Promise<void>;
    fetchRecoveryCodes: () => Promise<void>;
};

export const OTP_MAX_LENGTH = 6;

// Two-factor is disabled. Provide a no-op hook preserving the API.
export const useTwoFactorAuth = (): UseTwoFactorAuthReturn => {
    const noopAsync = async (): Promise<void> => undefined;

    return {
        qrCodeSvg: null,
        manualSetupKey: null,
        recoveryCodesList: [],
        hasSetupData: false,
        errors: [],
        clearErrors: () => undefined,
        clearSetupData: () => undefined,
        fetchQrCode: noopAsync,
        fetchSetupKey: noopAsync,
        fetchSetupData: noopAsync,
        fetchRecoveryCodes: noopAsync,
    };
};
