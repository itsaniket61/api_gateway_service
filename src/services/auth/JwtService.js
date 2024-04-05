const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

const getToken = async (token) => {
  // Verify the existing token
  const {userId} = await verifyToken(token);;

  token = generateJwtToken(userId);
  const validity = process.env.JWT_VALIDITY || '120000';
  return { token, validity };
}

const generateJwtToken = (userId)=>{
  return jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_VALIDITY || '2m',
  });
}

const verifyToken = async (token)=>{
  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    return decodedToken;
  } catch (error) {
    // If token verification fails, throw an error
    throw new Error('Token verification failed');
  }
}

const jwtService = {getToken, generateJwtToken, verifyToken};

module.exports = jwtService;