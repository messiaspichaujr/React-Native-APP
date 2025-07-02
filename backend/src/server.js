import express from "express";
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

import transacoesRoute from "./routes/transacoesRoute.js"

dotenv.config();

const app = express();

//middleware - quando tu manda um request tu espera um pedido (request) do cliente, e no meio desse retorno (response) pode acontecer alterações (middleware).
//implementação de limite de pedido
app.use(ratelimiter);
app.use(express.json());

const PORT = process.env.PORT || 5002;

app.use("/api/transacoes", transacoesRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor sendo executado na porta:", PORT);
    })
});