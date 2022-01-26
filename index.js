const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Amadeus = require('amadeus');
const url = require('url');
const cors = require('cors'); 
const mariadb = require('mariadb');
const sanitizer = require('sanitize');

const { fetchStartingLocations,
        fetchDestinationLocations,
        linkExists,
        insertStartingLocation,
        insertDestinationLocation } = require('./db/db');
const { getExchangeRateEUROverUSD } = require('./exchange');

const PORT = process.env.PORT || 3000;
const app = express();

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

const amadeus = new Amadeus({
    clientId: AMADEUS_CLIENT_ID,
    clientSecret: AMADEUS_CLIENT_SECRET
});

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, './avistad-frontend/build')));

// sanitize inputs
app.use(sanitizer.middleware);

app.post('/synchronize', async (req, res) => {
    console.log('Connected to /synchronize endpoint: ', req.body);

    if (req.body && req.body["link"]) {
        const link = req.body["link"];

        if (req.body["startingLocation"]) {
            const location = req.body["startingLocation"]
            
            const address = location["address"];
            const lat = location["lat"];
            const lng = location["lng"];

            // add new location to the database
            await insertStartingLocation(link, address, lat, lng);
        } else if (req.body["destinationLocation"]) {
            const location = req.body["destinationLocation"];

            const address = location["address"];
            const lat = location["lat"];
            const lng = location["lng"];

            // add new location to the database
            await insertDestinationLocation(link, address, lat, lng);
        }
    }
});

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

app.get('*', (req, res) => {
    // pass users along to the main page
    res.sendFile(path.join(__dirname, './avistad-frontend/build/index.html'));
});

app.post('*', async (req, res) => {
    const link = req.path.slice(1); // remove leading forward slash

    if (await linkExists(link)) {
        // link does exist in the database (recovered instance)
        const startingLocations = await fetchStartingLocations(link);
        const destinationLocations = await fetchDestinationLocations(link);

        console.log(startingLocations);
        console.log(destinationLocations);

        res.json({
            previousInstance: true,
            startingLocations: startingLocations,
            destiantionLocations: destinationLocations
        });
    } else {
        // link does not exist in the database (new instance)
        res.json({
            previousInstance: false
        });
    }
});


app.listen(PORT, () => {
    console.log(`[*] Backend server listening on :${PORT}...`);
});