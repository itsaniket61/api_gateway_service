const { AppConstants } = require("../constants/AppConstants");
const jwtService = require("../services/auth/JwtService");
const authService = require("../services/auth/service");

const signup = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const user = await authService.signup(name,email,password);
        if(user.error) throw new Error(user.error);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    } 
}

const signin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const { token, error } = await authService.signin(email, password);
        if(error) throw new Error(error);
        res.cookie(AppConstants.JWT_KEY_NAME, token.token, { maxAge: token.validity, httpOnly: true });
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getToken = async (req, res)=>{
    try {
        let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token && req.cookies.jwtToken) {
          token = req.cookies.jwtToken;
        }

        if (!token) {
          return res.status(401).send('Missing token');
        }
        token = (await jwtService.getToken(token)).token;
        if(!token) throw new Error('Token not found');
        res.cookie(AppConstants.JWT_KEY_NAME, token.token, { maxAge: token.validity, httpOnly: true });
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const authController = { signup, signin, getToken };

module.exports = authController;