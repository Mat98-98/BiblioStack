

const getUserFromRequest = (req) => ({
    id: req.user?.id,
    role: req.user?.role
})

export const getPublic = async (req, res) => {
    try {
        const { id, role} = getUserFromRequest(req);
        return res.json({
            message: "Access granted to anyone",
            user: id || null,
            role: role || null
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getMember = async (req, res) => {
    try {
        const { id, role } = getUserFromRequest(req);
        return res.json({
            message: "Access granted to registered members",
            user: id,
            role: role
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getLibrarian = async (req, res) => {
    try {
        const { id, role } = getUserFromRequest(req);
        return res.json({
            message: "Access granted to librarians and administrators",
            user: id,
            role
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getAdmin = async (req, res) => {
    try {
        const { id, role } = getUserFromRequest(req);
        return res.json({
            message: "Access granted to administrators",
            user: id,
            role
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}