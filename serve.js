import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { popularTabelas, criarTabelas } from "./app.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/enviar-formulario", async (req, res) => {
    try {
        await criarTabelas();       // cria as tabelas (se ainda não existirem)
        await popularTabelas(req.body); // popula com os dados enviados
        res.status(200).json({ mensagem: "Dados salvos com sucesso!" });
    } catch (erro) {
        console.error("Erro ao salvar dados:", erro);
        res.status(500).json({ erro: "Erro ao salvar dados." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
