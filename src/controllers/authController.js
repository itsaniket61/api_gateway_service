const jwtService = require("../services/auth/JwtService");
const authService = require("../services/auth/service");

const signup = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await authService.signup(email,password);
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
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getToken = async (req, res)=>{
    try {
        let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        token = (await jwtService.getToken(token)).token;
        if(!token) throw new Error('Token not found');
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const authController = { signup, signin, getToken };

module.exports = authController;