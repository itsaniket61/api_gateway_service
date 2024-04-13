const AppConstants = require("../constants/AppConstants");
const jwtService = require("../services/auth/JwtService");
const cookieKeyName = AppConstants.JWT_KEY_NAME;
const authMiddleware = (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token && req.cookies[cookieKeyName]) {
    token = req.cookies[cookieKeyName];
  }

  if (!token) {
    return res.status(401).send('Missing token');
  }

  jwtService
    .verifyToken(token)
    .then((decodedToken) => {
      // Set userId in request headers
      const { userId } = decodedToken;
      req.headers['userid'] = userId;
      const newToken = jwtService.generateJwtToken(userId);
      res.cookie(cookieKeyName, newToken.token, { httpOnly: true, secure: true });
      next();
    })
    .catch((error) => {
      console.error('Error verifying token:', error);
      return res.status(403).send('Invalid token');
    });
};

module.exports = authMiddleware;