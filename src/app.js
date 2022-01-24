const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


// Rotas
app.get('/', (req, res) => {
  res.send({
    "title": "API de consultas na BN",
    "description": "Esta API recupera dados de livros na Biblioteca Nacional e os devolvem em JSON.",
    "version": "1.0.0",
  })
});
require('./bn_controller')(app);


const port = process.env.PORT || 3000;
app.listen(port);