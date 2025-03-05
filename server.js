import express from "express";
import cors from "cors";
import { ordinamentoPost } from "./functionPost.js";
import { verifyToken } from "./token.js";
import utenti from "./utenti.js";
import post from "./post.js";
import { DateTime } from "luxon";
import pool from "./db.js";

const app = express();
app.use(cors("*"));
app.use(express.json());
app.use("/", utenti);
app.use("/post", post);

// Rotta home per ricevere tutti i post e visualizzarli in ordine di data
app.get("/home", verifyToken, (req, res, next) => {
    const post = ordinamentoPost();
    post.forEach(p => {
        p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_MED);
        });
    res.status(200).send(post);
});

app.listen(3000, () => {
    console.log("Server avviato con successo sulla porta 3000");
});

app.use((err, req, res, next) => {
    res.send(err.message);
    });