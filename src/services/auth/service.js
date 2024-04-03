const { firebaseDb } = require("../../helpers/FirebaseHelper");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { generateRandomId } = require("../../utils/Utils");
const jwtService = require("./JwtService");

dotenv.config();

const usersCollection = firebaseDb.collection(process.env.FIREBASE_DB_NAME||'gateway'+'/auth/users');

const signup = async (email,password) => {
    try {
        const userRecords = (await usersCollection.where('email','==',email).get()).docs;
        if(userRecords.length>0) throw new Error('User already exists');
        
        const userId = generateRandomId(8);
        const hashedPassword = await bcrypt.hash(password,10);
        await usersCollection
          .doc(userId)
          .set({ email, hashedPassword });
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