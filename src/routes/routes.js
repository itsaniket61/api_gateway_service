const dotenv = require('dotenv');
dotenv.config();

const ROUTES = require(process.env.PROXY_CONFIG_PATH || '../../GatewayConfig.json');

exports.ROUTES = ROUTES;
