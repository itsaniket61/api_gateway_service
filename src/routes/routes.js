const dotenv = require('dotenv');
dotenv.config();

const ROUTES = require(process.env.PROXY_CONFIG_PATH);

exports.ROUTES = ROUTES;
