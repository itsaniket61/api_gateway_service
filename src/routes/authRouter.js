const { Router } = require("express");
const authController = require("../controllers/authController");

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  return await authController.signup(req, res);
});

authRouter.post('/signin', async (req, res) => {
  return await authController.signin(req, res);
});

authRouter.get('/token', async (req, res) => {
  return await authController.getToken(req, res);
});

module.exports = authRouter;