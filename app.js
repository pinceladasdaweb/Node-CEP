"use strict";

var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    route   = express.Router(),
    app     = express(),
    port    = process.env.PORT || 3002;

function getAddress(answers) {
    return {
        logradouro: answers.eq(0).text().trim(),
        bairro:     answers.eq(1).text().trim(),
        localidade: answers.eq(2).text().trim().split('/')[0].trim(),
        uf:         answers.eq(2).text().trim().split('/')[1].trim()
    };
}

route.get('/:cep', function (req, res) {
    var data = 'cepEntrada=' + req.params.cep + '&metodo=buscarCep';

    request({
        'url': 'http://m.correios.com.br/movel/buscaCepConfirma.do',
        'method': 'POST',
        'encoding': 'binary',
        'headers': {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Host': 'm.correios.com.br',
            'Origin': 'http://m.correios.com.br/movel/buscaCepConfirma.do',
            'Referer': 'http://m.correios.com.br/movel/buscaCepConfirma.do',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:35.0) Gecko/20100101 Firefox/35.0',
            "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3"
        },
        'jar': true,
        'form': data
    }, function (err, resp, body) {
        if (!err && res.statusCode === 200) {
            var $     = cheerio.load(body),
                error = $('.erro'),
                cepError, answers, address;

            res.setHeader('Content-Type', 'application/json');

            if (error.length) {
                cepError = {
                    status: 'error',
                    message: error.text().trim()
                };

                res.send(JSON.stringify(cepError));
            } else {
                answers = $('.respostadestaque');
                address = getAddress(answers);

                res.send(JSON.stringify(address));
            }
        }
    });
});

app.use('/', route);

app.listen(port);

console.log('Your server goes on localhost:' + port);