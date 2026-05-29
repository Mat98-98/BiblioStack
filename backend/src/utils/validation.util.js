export const emailValidator = (email) => {
    const regex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,4}$/;

    if (!email || !regex.test(email)) {
        return {
            code: "INVALID_EMAIL",
            message: "Invalid email format"
        }
    }
    return null;
}

export const passwordValidator = (password) => {
    const errors = [];

    if (!password || password.length < 8) {
        errors.push({
            code: "PASSWORD_TOO_SHORT",
            message: "Password must be at least 8 characters"
        });
    }

    if (password.length > 16) {
        errors.push({
            code: "PASSWORD_TOO_LONG",
            message: "Password must be at most 16 characters"
        })
    }

    if (!/[a-z]/.test(password)) {
        errors.push({
            code: "PASSWORD_NO_LOWERCASE",
            message: "Password must contain a lowercase letter"
        })
    }

    if (!/[A-Z]/.test(password)) {
        errors.push({
            code: "PASSWORD_NO_UPPERCASE",
            message: "Password must contain a uppercase letter"
        })
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push({
            code: "PASSWORD_NO_SPECIAL_CHARACTER",
            message: "Password must contain a special character"
        })
    }

    if (!/[0-9]/.test(password)) {
        errors.push({
            code: "PASSWORD_NO_NUMBER",
            message: "Password must contain a number"
        })
    }

    return errors.length ? errors : null;
}