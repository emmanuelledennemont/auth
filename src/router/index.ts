import express from 'express';
import authentication from '../router/authentication';
import users from './users';
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router); // Remove the argument when calling the authentication function
  return router;
};
