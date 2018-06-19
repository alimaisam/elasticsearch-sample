const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const elasticsearch = require('elasticsearch')

const app = express()

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.listen((process.env.PORT || 3000))

const client = new elasticsearch.Client({
    host: '<PUT_YOUR_ES_URL>',
    log: 'trace'
});

app.get('/', function (req, res) {
    res.send('This is ES Server')

    client.ping({
        requestTimeout: 30000,
    }, function (error) {
        if (error) {
          console.error('elasticsearch cluster is down!');
        } else {
          console.log('All is well');
        }
    });
    
})

app.get('/search', function(req, res) {
    client.search({
        index: 'i',
        type: 'companies',
        body: {
          query: {
            match: {
              'company name': 'China'
            }
          }
        }
    }).then(function (resp) {
        
        var hits = resp.hits.hits
        var totalHits = resp.hits.total
        console.log(hits)
        console.log(totalHits)
        res.send(resp)
    }, function (err) {
        console.trace(err.message)
    });
})