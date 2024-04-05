const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');

const getToken = async (token) => {
  // Verify the existing token
  const {userId} = await verifyToken(token);;
  token = generateJwtToken(userId);
  return { token };
}

const generateJwtToken = (userId)=>{
  const tokenValue = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_VALIDITY || '2m',
  });
  const validity = process.env.JWT_VALIDITY || '120000';
  const token = {token: tokenValue, validity: validity};
  return {token};
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