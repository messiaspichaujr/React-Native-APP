import express from "express";
import dotenv from "dotenv"
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

//middleware - quando tu manda um request tu espera um pedido (request) do cliente, e no meio desse retorno (response) pode acontecer alterações (middleware).
app.use(express.json());

const PORT = process.env.PORT || 5001;

//Inicialização do banco
async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transacoes(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

        console.log("Banco conectado com sucesso!");

    } catch (error) {
        console.log("Erro na inicialização do banco", error)
        process.exit(1); // status code 1 fracasso na leitura, 0 sucesso
    }
}

//endpoints

app.get("/", (req,res) => {
    res.send("its working");
});

app.post("/api/transacoes", async (req, res) => {

    try {
        const { title, amount, category, user_id } = req.body
        
        if(!title || !user_id || !category || !amount === undefined) {
            return res.status(400).json({message: "Todos os campos são obrigatórios"})
            //400 - dados inválidos, malformado
        }

        const transacoes = await sql `
            INSERT INTO transacoes(user_id,title,amount,category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `

        console.log(transacoes);
        res.status(201).json(transacoes[0])
        //201 - algo foi criado

    } catch (error) {
        console.log("error creating the transaction", error)
        return res.status(500).json({message:"Erro do servidor interno"});
        //500 - erro do servidor
    }
});

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor sendo executado na porta:", PORT);
    })
});