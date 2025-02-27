import fs from "fs";

// Funzione per la validazione dei campi del Post
export function validazionePost(req, res, next){
    const post = req.body;
    if(!post.titolo){
        res.status(400);
        next(new Error("Il campo titolo è obbligatorio!"));
            }else if(!post.testo){
                        res.status(400);
                        next(new Error("Il campo testo è obbligatorio!"));
                    }
    next();
}

// Funzione che ordina i post in base alla data
export function ordinamentoPost(){
    const post = leggiPost();
    post.sort((a, b) => new Date(b.data) - new Date(a.data));
    return post;
}

// Funzione per la lettura di tutti i post nel fil post.json
export const leggiPost = () => {
    try{
        const datiRaw = fs.readFileSync("post.json").toString("utf-8");
        const dati = JSON.parse(datiRaw);
        return dati;
    }catch(error){
        return [];
    }
};