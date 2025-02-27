import jwt from "jsonwebtoken";
import router from "./post.js";

// Funzione per la verifica del token
export function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (token) {
        const bearer = token.split(" ")[1];
        req.token = bearer;
        jwt.verify(req.token, "chiaveSegreta", (err, data) => {
            if (err) {
                res.status(403).json({ message: "Token non valido" });
                } else {
                    req.username = data.utente;
                    next();
                }
            });
                } else {
                    res.status(403);
                    next(new Error("Token non fornito"));
                }
}

export default router;