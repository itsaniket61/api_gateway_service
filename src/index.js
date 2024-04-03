const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyControllers = require('./controllers/proxyController');
const authRouter = require('./routes/authRouter');
const authWithFirebase = require('./middlewares/firebaseAuth');
const { setupLogging } = require('./logs/logging');
const { ROUTES } = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth',authRouter);
app.use('/api',authWithFirebase);

setupLogging(app);
proxyControllers.setupProxies(app,ROUTES);  

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${PORT}`);
});