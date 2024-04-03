const jwtService = require("../services/auth/JwtService");

const authWithFirebase = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    jwtService.verifyToken(token)
      .then((decodedToken) => {
        req.user = decodedToken.uuid;
        next();
      })
      .catch((error) => {
        console.error('Error verifying token:', error);
        return res.status(403).send('Forbidden');
      });
};

module.exports = authWithFirebase;