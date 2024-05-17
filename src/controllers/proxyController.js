const { createProxyMiddleware } = require('http-proxy-middleware');

const setupProxies = (app, routes) => {
  routes.forEach((route) => {
    console.log("Route Registered : "+route.url);
    app.use(route.url, createProxyMiddleware(route.proxy));
  });
};

exports.setupProxies = setupProxies;
