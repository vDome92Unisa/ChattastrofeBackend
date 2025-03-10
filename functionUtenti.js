import fs from "fs";
import pool from "./db.js";

// Funzione per la crittografia della password
export function cryptoPassword(password) {
    let  critPassword = '';
    for (let i = 0; i < password.length; i++) {
        critPassword += String.fromCharCode(password.charCodeAt(i) + 7);
        }
    return critPassword;
}

// Funzione per la decrittografia della password
export function decryptoPassword(password) {
    let  critPassword = '';
    for (let i = 0; i < password.length; i++) {
        critPassword += String.fromCharCode(password.charCodeAt(i) - 7);
        }
    return critPassword;
}

// Funzione per aggiungere ulteriori dati all'utente se trova il suo username
export const datiUtente = async (utente) => {
    
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE chattastrofe.utenti SET eta = '${utente.body.eta}' WHERE utenti.username = '${utente.username}'`, (err, result) => {
            if(err){
                console.log(err);
                reject("Errore nella lettura degli utenti");
            }else{
                resolve (true);
            }
        });
    });
};

// Funzione per leggere gli utenti dal file utenti.json
/*export const leggiUtenti = () => {
    try {
        const datiRaw = fs.readFileSync("utenti.json").toString("utf-8");
        const dati = JSON.parse(datiRaw);
        return dati;
    } catch (error) {
        return [];
    }
};*/

export const leggiUtenti = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM chattastrofe.utenti WHERE utenti.username = '${username}'`, (err, result) => {
            if(err){
                console.log(err);
                reject("Errore nella lettura degli utenti");
            }else{
                resolve (result.rows[0]);
            }
        });
    });  
};

export const trovaUtente = (utente) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT utenti.username, utenti.password FROM chattastrofe.utenti WHERE utenti.username = '${ utente.username }' LIMIT 1`, (err, result) => {
            if(err){
                console.log(err);
                reject("Errore");
            }else if(result.rows.length === 0){
                reject(new Error("Utente non trovato"));
            }else{
                resolve (result.rows[0]);
            }
        });
    });  
};

export const trovaUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT utenti.username FROM chattastrofe.utenti WHERE utenti.username = '${ username }' LIMIT 1`, (err, result) => {
            if(err){
                console.log(err);
                reject("Errore");
            }else if(result.rows.length === 0){
                resolve (false)
            }else{
                reject(new Error("Utente già esistente"));
            }
        });
    });  
};
// Funzione per scrivere gli utenti nel file utenti.json, se non presenti, dopo averli crittografati
/*export const scriviUtenti = (req, res, next) => {
    try {
        const nuovoUtente = req.body;
        const dati = leggiUtenti();
        dati.push(nuovoUtente);
        nuovoUtente.password = cryptoPassword(nuovoUtente.password);
        fs.writeFileSync("utenti.json", JSON.stringify(dati, null, 4));
        res.status(201).send("Utente aggiunto con successo");
    } catch (error) {
        res.status(500);
        next(new Error("Errore nella scrittura dell'utente"));
    }
};*/

export const scriviUtenti = (utente) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO chattastrofe.utenti (username, nome, cognome, password) VALUES ($1, $2, $3, $4)`, [utente.username, utente.nome, utente.cognome, cryptoPassword(utente.password)], (err, result) => {
            if(err){
                console.log(err);
                reject();
            }else{
                resolve("Utente aggiunto con successo");
            }
        });
    });
}

// Funzione per la validazione del login
export function validazioneLogin(req, res, next){
    const utente = req.body;
    if(!utente.username){
        res.status(400);
        next(new Error({message:"Il campo username è obbligatorio!"}));
        }else if(!utente.password){
            res.status(400);
            next(new Error({message:"Il campo password è obbligatorio!"}));
        }
        next();
}

// Funzione per la validazione della registrazione
export const validazioneReg = (req, res, next) => {
    const utente = req.body;
    if (!utente.username) {
        res.status(400);
        next(new Error("Il campo username è obbligatorio!"));
        } else if(!utente.nome){
            res.status(404);
            next(new Error("Il campo nome è obbligatorio!"));
            } else if(!utente.cognome){
                res.status(400);
                next(new Error("Il campo cognome è obbligatorio!"));
                }else if(!utente.password){
                    res.status(400);
                    next(new Error("Il campo password è obbligatorio!"));
                    }
    next();
};