import {Router} from "express";
import { verifyToken } from "./token.js";
import { ordinamentoPost } from "./functionPost.js";
import { DateTime } from "luxon";
import jwt from "jsonwebtoken";
import{validazioneLogin, validazioneReg, datiUtente, cryptoPassword, decryptoPassword, leggiUtenti, scriviUtenti} from "./functionUtenti.js";

const router = Router();



// Rotta per il login, richiede la validazione del login e controlla se l'utente esiste e se la password è corretta
// Se tutto è corretto genera un token con scadenza di 1 ora
router.post("/login", validazioneLogin, (req, res, next) => {
    const utente = req.body;
    const utenti = leggiUtenti();
    const utenteEsistente = utenti.find((u) => u.username === utente.username);

    if (utenteEsistente) {
        if (decryptoPassword(utenteEsistente.password) !== utente.password) {
            res.status(400);
            next(new Error("Password errata"));
            } else {
                jwt.sign({ utente: utenteEsistente.username },
                    "chiaveSegreta",
                    { expiresIn: "1h" },
                    (err, token) => {
                        if (err) {
                            res.status(500);
                            next(new Error("Errore nella generazione del token"));
                            } else {
                                res.status(200).send({message:"Login effettuato con successo", token});
                        }
                    });
                }
    } else {
        res.status(404);
        next(new Error("Utente non trovato"));
    }
});

// Rotta per la registrazione, richiede la validazione della registrazione e controlla se l'utente esiste
// Se l'utente non esiste scrive l'utente nel file utenti.json
router.post("/registrazione", validazioneReg, (req, res, next) => {
    const utenti = leggiUtenti();
    const utente = req.body;
    const utenteEsistente = utenti.find((u) => u.username === utente.username);
    if (utenteEsistente) {
        res.status(404);
        next(new Error("Utente già esistente"));
        } else {
            scriviUtenti(req, res, next);
        }
});

// Rotta per visualizzare il profilo dell'utente, richiede il token e controlla se l'utente esiste
// Se l'utente esiste visualizza i post dell'utente
router.get("/profilo", verifyToken, (req, res, next) => {

    const utente = leggiUtenti().find((u) => u.username === req.username);
    const post = ordinamentoPost();
    const postUtente = post.filter((p) => p.username === req.username);
    post.forEach(p => {
        p.data = DateTime.fromISO(p.data).toLocaleString(DateTime.DATETIME_MED);
        });
    res.status(200).send(postUtente);   
});

// Rotta per modificare o inserire ulteriori dati dell'utente, richiede il token e controlla se l'utente esiste
// Se l'utente esiste modifica i dati dell'utente
router.post("/profilo/areapersonale",verifyToken, datiUtente, (req, res, next) => {
const username = req.username;
const utenti = leggiUtenti();
const utente = utenti.find((u) => u.username === username);
    if(!utente){
        res.status(404);
        next(new Error("Utente non trovato"));
        }else{
            res.status(200).send(utente);
        }
});

// Rotta per visualizzare i dati dell'utente nella barra laterale, richiede il token e controlla se l'utente esiste
// Se l'utente esiste visualizza i dati dell'utente
router.get("/profilo/datiutente",verifyToken, (req, res, next) => {
const utenti = leggiUtenti();
const utente = utenti.find((u) => u.username === req.username);
if(!utente){
    res.status(404);
    next(new Error("Utente non trovato"));
    }else{
        res.status(200).send(utente);
    }
});

router.use((err, req, res, next) => {
    res.send(err.message);
});

export default router;