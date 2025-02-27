import { DateTime } from "luxon";
import fs from "fs";
import { Router } from "express";
import { verifyToken } from "./token.js";
import { validazionePost, leggiPost } from "./functionPost.js";

const router = Router();

// Rotta per creare un nuvo post, richiama sial la verifica token che la validazione post, controllando che tutti i campi siano compilati
// Inoltre assegna un id univoco ad ogni post prima di esser salvato nel file
router.post("/", verifyToken, validazionePost, (req, res, next) => {
    try{
        const nuovoPost = req.body;
        nuovoPost.username = req.username;
        const dati = leggiPost();
        const maxID = dati.reduce((max, post) => (post.id > max ? post.id : max), 0);
        nuovoPost.id = maxID + 1;
        nuovoPost.data = DateTime.now();
        dati.push(nuovoPost);
        fs.writeFileSync("post.json", JSON.stringify(dati, null, 4));
        res.status(201).send("Post aggiunto con successo");
    }catch(error){
        res.status(500);
        next(new Error("Errore nella scrittura del Post"));
    }
});

// Rotta per eliminare un post, richiede l'id del post e l'username dell'utente che lo ha creato
// Controlla che il post esista e se si procede con l'eliminazione
router.post("/elimina", verifyToken, (req, res, next) => {
    try{
        const username = req.username;
        const id = req.body.id;
        const post = leggiPost();
        const postDaEliminare = post.find((p) => p.username === username && p.id === id);
        if(!postDaEliminare){
            res.status(404);
            next(new Error("Post non trovato"));
            }else{
                const postFiltrati = post.filter((u) => u.id !== username && u.id !== id);
                fs.writeFileSync("post.json", JSON.stringify(postFiltrati, null, 4));
                res.status(200).send("Post eliminato con successo");
            }
    }catch(error){
        res.status(500);
        next(new Error("Errore nell'eliminazione del Post"));
    }
});

// Rotta per modificare un post, richiede l'id del post e l'username dell'utente che lo ha creato
// Controlla che il post esista e se si procede con la modifica
// Gli assegna la data attuale e il flag modificato a true
router.post("/modifica", verifyToken, (req, res, next) => {
    try{
        const username = req.username;
        const id = req.body.id;
        const post = leggiPost();
        const postDaModificare = post.find((p) => p.username === username && p.id === id);
        if(!postDaModificare){
            res.status(404);
            next(new Error("Post non trovato"));
            }else{
                postDaModificare.titolo = req.body.titolo;
                postDaModificare.testo = req.body.testo;
                postDaModificare.data = DateTime.now();
                postDaModificare.modificato = true;
                fs.writeFileSync("post.json", JSON.stringify(post, null, 4));
                res.status(200).send("Post modificato con successo");
            }
    }catch(error){
        res.status(500);
        next(new Error("Errore nella modifica del Post"));
    }
});

// Rotta per aggiungere un like ad un post, richiede l'id del post e l'username dell'utente che lo ha creato
// Controlla che il post esista e se si procede con l'aggiunta del like
// Se l'utente ha già messo like al post, lo rimuove
router.post("/like", verifyToken, (req, res, next) => {
    try {
        const username = req.username;
        const id = req.body.id;
        const post = leggiPost();
        const postDaLike = post.find((p) => p.id === id);

        if (!postDaLike) {
            res.status(404);
            next(new Error("Post non trovato"));
            }else{
                if (!postDaLike.likes) {
                    postDaLike.likes = [];
                }

            if (postDaLike.likes.includes(username)) {
                postDaLike.likes.pop(username);
                postDaLike.like = (postDaLike.like || 0) - 1;
                fs.writeFileSync("post.json", JSON.stringify(post, null, 4));
                res.status(200).send("Like rimosso con successo");     
                } else {
                    postDaLike.likes.push(username);
                    postDaLike.like = (postDaLike.like || 0) + 1;
                    fs.writeFileSync("post.json", JSON.stringify(post, null, 4));
                    res.status(200).send("Like aggiunto con successo");
                }
            }
    } catch (error) {
        res.status(500);
        next(new Error("Errore nell'aggiunta del Like"));
    }
});

export default router;