export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // Requires at least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
};

export const validatePhone = (phone) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
};

export const formatName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const checkProfileCompletion = (profileData) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'department'];
    let completed = 0;
    requiredFields.forEach(field => {
        if (profileData[field] && profileData[field].trim() !== '') {
            completed += 1;
        }
    });
    return Math.round((completed / requiredFields.length) * 100);
};
