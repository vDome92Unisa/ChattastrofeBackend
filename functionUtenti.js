import fs from "fs";

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
export const datiUtente = (req, res, next) => {
    try{
        const utenti = leggiUtenti();
        const utente = utenti.find((u) => u.username === req.username);
        if(!utente){
            res.status(404);
            next(new Error("Utente non trovato"));
            }else{
                req.utente = utente;
                utente.sesso = req.body.sesso;
                utente.eta = req.body.eta;
                utente.email = req.body.email;
                utente.citta = req.body.citta;
                utente.situazioneSentimentale = req.body.situazioneSentimentale;
                utente.professione = req.body.professione;
                utente.hobby = req.body.hobby;
                fs.writeFileSync("utenti.json", JSON.stringify(utenti, null, 4));
                next();
            }
    }catch(error){
        res.status(500);
        next(new Error("Errore nella modifica dati utente"));
    }
};

// Funzione per leggere gli utenti dal file utenti.json
export const leggiUtenti = () => {
    try {
        const datiRaw = fs.readFileSync("utenti.json").toString("utf-8");
        const dati = JSON.parse(datiRaw);
        return dati;
    } catch (error) {
        return [];
    }
};

// Funzione per scrivere gli utenti nel file utenti.json, se non presenti, dopo averli crittografati
export const scriviUtenti = (req, res, next) => {
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
};

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