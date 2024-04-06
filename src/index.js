const express = require('express')
const proxyControllers = require('./controllers/proxyController');
const authRouter = require('./routes/authRouter');
const { setupLogging } = require('./logs/logging');
const { ROUTES } = require('./routes/routes');
const authMiddleware = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/auth',authRouter);
app.use('/api',authMiddleware)

setupLogging(app);
proxyControllers.setupProxies(app,ROUTES);  

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${PORT}`);
});