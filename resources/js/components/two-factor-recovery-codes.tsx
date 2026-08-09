import React from 'react';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

// Two-factor UI is disabled. Preserve the component API but render nothing.
export default function TwoFactorRecoveryCodes(_props: Props) {
    return null;
}
