# API de consultas na BN

Esta API recupera dados de livros na Biblioteca Nacional e os devolvem em JSON.

Trata-se de uma API crawler utilizando Express e Cheerio. Foi construída para auxiliar no cadastro de Livros do sistema Libmin.

## Por que foi criado
Durante a concepção do Libmin, foi percebida a necessidade de simplificar a forma com que se cadastra materiais em bibliotecas.

A ideia, então, era que o cadastrador precisasse digitar todos os dados, apenas buscasse o título no acervo da Biblioteca Nacional e informasse ao Libmin a URL, preenchendo os campos necessários de forma automática.

## Como utilizar

Faça uma consulta para o endpoint abaixo informando a URl do livro que desejar parsear ([exemplo](http://acervo.bn.gov.br/sophia_web/acervo/detalhe/301431))
```http
https://consultasbn.herokuapp.com/url?q={url-do-livro-na-bn}
```

Exemplo de resposta:
```json
{
  "title": "Código limpo",
  "subtitle": "habilidades práticas do agile software",
  "author": "Robert C. Martin [et al.]",
  "cover": "http://acervo.bn.gov.br/sophia_web/capa/capa/301431",
  "publisher": "Alta Books",
  "year": "2009. ",
  "isbn_code": "9788576082675 (broch.)",
  "description": "xxi, 412p. : il. ; 24 cm.",
  "dewey_centesimal": "005",
  "dewey": "000"
}
```

## Como implementar
Se você gostou do <strong>consultas_bn</strong>, fique à vontade para melhorá-lo.

- Faça uma cópia deste projeto
```js
git clone https://github.com/tiagoon/consulta_bn.git
```

- Acesse o diretório
```js
cd consultas_bn
```

- Instale as dependências
```js
yarn install
```

- Inicie o server
```js
yarn dev
```

- Testando
```http 
http://localhost:3000
```

- Buscando um livro
```http
http://localhost:3000/url?q={url-do-livro-na-bn}
```