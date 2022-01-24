const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');


const router = express.Router();

router.get('/', async (req, res) => {
  const options = {
    uri: req.query.q,
    transform: function (body) {
      return cheerio.load(body)
    }
  }
  
  var book = {}
  
  rp(options)
  .then(($) => {
    let title = $('.titulo').text().split(' / ');
    let publisher = $('.publicacao').text().split(' : ')[1].split(', ')[0];
    let year = $('.publicacao').text().split(' : ')[1].split(', ')[1];
    let cover = 'http://acervo.bn.gov.br' + $('.capa-ficha').attr('src')
  
    book.title            = title[0].split(' : ')[0];
    book.subtitle         = title[0].split(' : ')[1];
    book.author           = title[1].split(' : ')[0].split(' ; ')[0];
    book.cover            = cover;
    book.publisher        = publisher;
    book.year             = year;
    book.isbn_code        = $('.isbn').text();
    book.description      = $('.descricaoFisica').text();
    book.dewey_centesimal = $('.classifDewey').text().substr(0,3);
    book.dewey            = $('.classifDewey').text().substr(0,1) + '00';
    
    return res.send(book);

  })
  .catch((err) => {
    return res.status(400).send({ error: 'Erro. ' + err });
  })

});

module.exports = app => app.use('/url', router);