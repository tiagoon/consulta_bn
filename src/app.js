import express from 'express';
import cors from 'cors';
import bnRouter from './bn_controller.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    title: "API de consultas na BN",
    description: "Esta API recupera dados de livros na Biblioteca Nacional e os devolvem em JSON.",
    version: "1.0.0",
  });
});

app.use('/url', bnRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
