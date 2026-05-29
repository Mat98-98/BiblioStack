export const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";

    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 3600000
        });
    }

    // Rinnovo il token per 7 giorni
    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 3600000
        });
    }
};

//
export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
};