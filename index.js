const fs = require('fs');
const http = require('http');
const { type } = require('os');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

require('dotenv').config({ path: './config.env' });


//Blocking, Sync

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we now about the avacado: ${textIn}.\nCreated on ${Date.now()}.`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non Blocking, Async
//FILES
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('File Written :)');
//       });
//     });
//   });
// });

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

//SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  //Product Page
  else if (pathname === '/product') {
    let productid = dataObj[query.id];

    const output = replaceTemplate(tempProduct, productid);
    res.end(output);
  }

  //Api Page
  else if (pathname === '/api') {
    res.end(data);
  }

  //404 Page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'holy smokes',
    });
    res.end('<h1> PAGE NOT FOUND </h1>');
  }
});


const port = process.env.PORT
//Server Listening....
server.listen(port ,() => {
  console.log('Listening on port 8000(ignore)');
});
