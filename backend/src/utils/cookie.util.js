//@TODO: sistemare il sameSite a seconda di come verrà hostato il servizio. Se con lo stesso dominio si  può usare strict o lax (nel caso di login google)
export const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";

    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 15 * 60 * 1000 // 15 minuti
        });
    }

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 14 * 24 * 3600000 // 14 giorni
        });
    }
};

export const clearAuthCookies = (res) => {
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
};