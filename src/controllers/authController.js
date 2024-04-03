const jwtService = require("../services/auth/JwtService");
const authService = require("../services/auth/service");

const signup = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await authService.signup(email,password);
        if(user.error) throw new Error(user.error);
        return res.json(user).status(201);
    } catch (error) {
        return res.json({ error: error.message }).status(500);
    } 
}

const signin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const { token, error } = await authService.signin(email, password);
        if(error) throw new Error(error);
        return res.json({token}).status(200);
    } catch (error) {
        return res.json({ error: error.message }).status(500);
    }
};

const getToken = async (req, res)=>{
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        return res.json(await jwtService.getToken(token)).status(200);
    } catch (error) {
        return res.json({ error: error.message }).status(500);
    }
}

const authController = { signup, signin, getToken };

module.exports = authController;