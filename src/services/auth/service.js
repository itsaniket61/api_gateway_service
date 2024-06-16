const { firebaseDb } = require("../../helpers/FirebaseHelper");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { generateRandomId } = require("../../utils/Utils");
const jwtService = require("./JwtService");

dotenv.config();

var usersCollection = firebaseDb && firebaseDb.collection(process.env.USERS_DB_COLLECTION_NAME||'gateway/auth/users');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Example: at least 8 characters
  return password?.length >= 8;
};

const signup = async (name,email,password) => {
    try {
        // Validate values of Name, Email, and Password
        if(!name || !email || !password) throw new Error("Please enter Name,Email and Password");
        if(!isValidEmail(email)) throw new Error('Please enter a valid email address');
        if(!isValidPassword(password)) throw new Error('Please enter Password at least 8 characters or more');
        
        const userRecords = (await usersCollection.where('email','==',email).get()).docs;
        if(userRecords.length>0) throw new Error('User already exists');
        
        const userId = generateRandomId(8);
        const hashedPassword = await bcrypt.hash(password,10);
        await usersCollection
          .doc(userId)
          .set({ name, email, hashedPassword });
        const token = jwtService.generateJwtToken(userId);
        return ({token, email});
    } catch (error) {
        console.error('Error signing up:', error);
        return ({ error: error.message });
    }
}

const signin = async (email,password) => {
    try {
      const userRecords = (await usersCollection.where('email','==',email).get()).docs;
      if(userRecords.length<=0) throw new Error('User not found');
      
      const userRecord = userRecords[0];
      
      if(userRecord.exists){
        const { hashedPassword } = userRecord.data();
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) throw new Error('Invalid password');

        const userId = userRecord.id;
        const token = jwtService.generateJwtToken(userId);
        return { token };
      } 
      else throw new Error('User not found');
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error.message };
    }
}

const authService = {signup,signin};

module.exports = authService;