const request = require('request');
const util = require('util');
const express = require('express');
const ip = require('ip');
const _data = require('./lib/data');
const helpers = require('./lib/helpers');

const app = express();
const handlers = {};
const serverPort = 3000;

const debug = util.debuglog('handlers');

// * NODE_DEBUG=handlers node index.js

handlers.init = function () {
    app.listen(serverPort, () => setTimeout(() => {
        console.log(
            `Web server running.\n\n\thttp://${ip.address()}:${serverPort}\n`,
        );
    }, 1000));
    app.get('/', (req, res) => {
        const { symbol, from, to } = req.query;
        const date = new Date();
        const fromDefault = from !== undefined ? from : date.setMonth(date.getMonth() - 1) / 1000;
        const toDefault = to !== undefined ? to : Date.now() / 1000;
        console.log(fromDefault, ' - ', toDefault);

        function filterData(data) {
            return (data.time > fromDefault && data.time < toDefault);
        }

        if (symbol) {
            _data.read('crypto', symbol, (err, data) => {
                if (!err && data) {
                    res.json(data.filter(filterData));
                } else {
                    debug(
                        'ID 132 - ',
                        helpers.GetTime(),
                        ' - ',
                        symbol,
                        '- error reading file', err
                    );
                }
            });
        } else {
            res.json({ status: 'invalid parameters' });
        }
    });
    setInterval(() => {
        const date = new Date();
        if (date.getMinutes() % 5 === 0) {
            handlers.update();
        }
    }, 60000);
};

handlers.update = function () {
    request('https://api.binance.com/api/v3/ticker/price', (error, response) => {
        if (error) throw new Error(error);
        const cryptoData = JSON.parse(response.body);
        let time;
        cryptoData.forEach((symbolData, i) => {
            if (i === 0) {
                time = helpers.GetTime();
            } else if (i === cryptoData.length - 1) {
                time = helpers.GetTime() - time;
                console.log(`created / updated ${cryptoData.length} files in ${(time * 1000).toFixed(2)} ms`);
            }
            _data.exist('crypto', symbolData.symbol, (err) => {
                if (!err) {
                    // ? EXIST UPDATE FILE
                    _data.read('crypto', symbolData.symbol, (err, data) => {
                        if (!err && data) {
                            data.push({
                                time: helpers.GetTime(),
                                price: symbolData.price,
                            });
                            _data.update('crypto', symbolData.symbol, data, (err) => {
                                if (!err) {
                                    debug(
                                        'ID 217 - ',
                                        helpers.GetTime(),
                                        ' - ',
                                        symbolData.symbol,
                                        '- file updated',
                                    );
                                } else {
                                    debug(
                                        'ID 250 - ',
                                        helpers.GetTime(),
                                        ' - ',
                                        symbolData.symbol,
                                        '- error ',
                                        err,
                                    );
                                }
                            });
                        } else {
                            debug('ID 107 - ', err);
                        }
                    });
                } else {
                    // ? NOT EXIST CREATE FILE
                    const fileData = [
                        {
                            time: helpers.GetTime(),
                            price: symbolData.price,
                        },
                    ];
                    _data.create('crypto', symbolData.symbol, fileData, (err) => {
                        if (!err) {
                            debug(
                                'ID 147 - ',
                                helpers.GetTime(),
                                ' - ',
                                symbolData.symbol,
                                '- file created',
                            );
                        } else {
                            debug(
                                'ID 204 - ',
                                helpers.GetTime(),
                                ' - ',
                                symbolData.symbol,
                                '- error ',
                                err,
                            );
                        }
                    });
                }
            });
        });
    });
};

module.exports = handlers;

handlers.init();
