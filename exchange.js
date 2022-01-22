const request = require('request');

// used to access Open Exchange to get the live exchange rates between currencies
const OPEN_EXCHANGE_API_KEY = process.env.OPEN_EXCHANGE_API_KEY || '';

async function api_call(url) {
    return new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}

async function getExchangeRateEUROverUSD() {
    exchangeURL = 'https://openexchangerates.org/api/latest.json?app_id=' + OPEN_EXCHANGE_API_KEY + '&base=USD';
    json_response = await api_call(exchangeURL);
    return json_response['rates']['EUR'];
}

module.exports = {
    getExchangeRateEUROverUSD
}