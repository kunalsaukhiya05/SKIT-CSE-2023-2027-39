import { useState } from 'react';

export const useProfile = (initialData = {}) => {
    const [profile, setProfile] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const updateProfile = async (updates) => {
        setIsSaving(true);
        setError(null);
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 800));
            setProfile(prev => ({ ...prev, ...updates }));
            return true;
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return { profile, isSaving, error, updateProfile, handleFieldChange, setProfile };
};
