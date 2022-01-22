const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Amadeus = require('amadeus');
const url = require('url');
const { getExchangeRateEUROverUSD } = require('./exchange');

const PORT = process.env.PORT || 3000;
const app = express();

const amadeus = new Amadeus({
    clientId: 'curWjETsq1twPY5Y0m4NNXWgnDtvCRfC',
    clientSecret: 'Ce0wYhthwQUiR120'
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './avistad-frontend/build')));

app.get('/convert', async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const exchangeRateEUROverUSD = await getExchangeRateEUROverUSD();

    if (queryObject['usd']) {
        // convert from USD to EUR

        usd = parseFloat(queryObject['usd']);
        eur = exchangeRateEUROverUSD * usd;
        
        res.send("$" + usd + " in EUR: €" + parseFloat(eur));

    } else if (queryObject['eur']) {
        // convert from EUR to USD
        const exchangeRateUSDOverEUR = 1 / exchangeRateEUROverUSD;

        eur = parseFloat(queryObject['eur']);
        usd = exchangeRateUSDOverEUR * eur;

        res.send('€' + eur + " in USD: $" + parseFloat(usd));
    } else {
        res.send('');
    }
});

app.get('/api', (req, res) => {
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: 'GEG',
        destinationLocationCode: 'LAS',
        departureDate: '2022-03-04',
        adults: '1'
    }).then((response) => {
        res.json(response.data);
    }).catch((error) => {
        console.log("[-] Error: ", error.code);
    });
});

app.listen(PORT, () => {
    console.log(`[*] Backend server listening on :${PORT}...`);
});