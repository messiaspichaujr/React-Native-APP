import express from "express";
import { getSummaryByUserId, deleteTransacoes, createTransacoes, getTransacoesByUserId } from "../controllers/transacoesController.js"


const router = express.Router();

// endpoint para listar informações de um user em específico
router.get("/:user_id", getTransacoesByUserId);

// endpoint para criar nova transação do banco de dados
router.post("/", createTransacoes);

// endpoint para deletar novas transações
router.delete("/:id", deleteTransacoes);

router.get("/summary/:user_id", getSummaryByUserId);

export default router;