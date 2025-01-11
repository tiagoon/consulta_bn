import express from 'express';
import { writeFile } from 'fs/promises';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());
const router = express.Router();

// Browser singleton
let browser;
const initBrowser = async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
};

// Inicializa o browser quando o servidor inicia
initBrowser();

router.get('/', async (req, res) => {
  try {
    const page = await browser.newPage();
    await page.goto(req.query.q, {
      waitUntil: 'domcontentloaded', // Mais rápido que networkidle0
      timeout: 30000
    });

    const html = await page.content();
    await page.close(); // Fecha apenas a página, mantém o browser

    const $ = cheerio.load(html);

    /* Formato geral da URL: http://127.0.0.1:3000/url?q=https://acervo.bn.gov.br/Sophia_web/acervo/detalhe/{bn_id}
     * Onde 127.0.0.1:3000 é a URL do servidor onde a API está rodando, nesse caso, o equivalente ao localhost
     * e 3000 e {bn_id} é o ID do livro na BN. Para obter o ID do livro, basta acessar a URL do livro na BN
     * e copiar o número que vem depois de "acervo/detalhe/".
     *
     * Exemplo: https://acervo.bn.gov.br/Sophia_web/acervo/detalhe/1739805
     * Onde 1739805 é o ID do livro.
     */

    const book = {
      title: $('h1.titulo[itemprop="name"]').first().text().trim(),
      material: $('p[itemprop="genre"]').text().trim(),
      language: $('p[itemprop="inLanguage"]').text().trim(),
      isbn_code: $('p[itemprop="isbn"]').text().trim(),
      dewey: $('.classifDewey').text().trim(),
      location: $('.localizacao').text().trim(),
      uniform_title: $('.outrosTitulos').text().trim(),
      publisher: $('p[itemprop="publisher"]').text().trim(),
      physical_description: $('p[itemprop="numberOfPages"]').text().trim(),
      general_note: $('.texto-completo').first().text().trim(),
      subjects: $('span[itemprop="about"] a').map((_, el) => $(el).text().trim()).get(),
      authors: $('span[itemprop="name"] a').map((_, el) => $(el).text().trim()).get(),
      cover_image: 'https://acervo.bn.gov.br' + $('img[itemprop="image"]').attr('src')
    };

    book.bn_id = req.query.bn_id;
    book.user_id = req.headers.user_id;

    /**
     * // Imprime no terminal
     * console.log('Dados do livro:', JSON.stringify(book, null, 2));
     *
     * // Salva em um arquivo JSON
     * await writeFile('books.json', JSON.stringify(book, null, 2));
     * 
    **/

    res.json(book);
  } catch (err) {
    res.status(400).json({ error: `Erro: ${err.message}` });
  }
});

export default router;
