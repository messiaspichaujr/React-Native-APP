import { sql } from "../config/db.js";

export async function getTransacoesByUserId(req, res) {
    try {
        const { user_id } = req.params;

        const transacoes = await sql`
            SELECT * FROM transacoes WHERE user_id = ${user_id} ORDER BY created_at DESC
        `;

        res.status(200).json(transacoes);

    } catch (error) {
        console.log("erro ao criar a transação", error)
        return res.status(500).json({ message: "Erro do servidor interno" });
    }
}

export async function createTransacoes (req, res) {

    try {
        const { title, amount, category, user_id } = req.body

        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" })
            //400 - dados inválidos, malformado
        }

        const transacoes = await sql`
            INSERT INTO transacoes(user_id,title,amount,category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `

        console.log(transacoes);
        res.status(201).json(transacoes[0])
        //201 - algo foi criado

    } catch (error) {
        console.log("erro ao criar a transação", error)
        return res.status(500).json({ message: "Erro do servidor interno" });
        //500 - erro do servidor
    }
}

export async function deleteTransacoes (req, res) {
    try {

        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Transação inválida" });
        }

        const resultado = await sql`
          DELETE FROM transacoes WHERE id = ${id} RETURNING *  
        `

        if (resultado.length === 0) {
            return res.status(404).json({ message: "Transação nao encontrada" });
        }

        res.status(200).json({ message: "Transação deletada com sucesso!" });
    } catch (error) {

        console.log("erro ao deletar a transação", error)
        return res.status(500).json({ message: "Erro do servidor interno" });
    }
}

export async function getSummaryByUserId (req, res) {
    try {
        const {user_id} = req.params;

        const resultadoSaldo = await sql `
            SELECT COALESCE(SUM(amount),0) as saldo FROM transacoes
            WHERE user_id = ${user_id}
        `
        const resultadoRenda = await sql `
            SELECT COALESCE(SUM(amount), 0) as renda FROM transacoes
            WHERE user_id = ${user_id} AND amount > 0
        `
        const resultadoDespesas = await sql `
            SELECT COALESCE(SUM(amount), 0) as despesas FROM transacoes
            WHERE user_id = ${user_id} AND amount < 0
        `

        res.status(200).json({
            saldo: resultadoSaldo[0].saldo,
            renda: resultadoRenda[0].renda,
            despesas: resultadoDespesas[0].despesas,
        });

    } catch (error) {
        console.log("erro ao emitir o sumário", error)
        return res.status(500).json({ message: "Erro do servidor interno" });
    }
}; 

