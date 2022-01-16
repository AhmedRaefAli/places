//json web token lib
const jwt = require('jsonwebtoken');
//error handler 
const HttpError = require('./http-error');

module.exports = (req, res, next) => {
  //web behavior send option req before all req except get req so we bass all option req
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    //our token comes in req.header in shape of {Authorization: 'Bearer TOKEN'}
    const token = req.headers.authorization.split(' ')[1]; //split by space and take second index of the array that is the real token 
    if (!token) {
      throw new Error('Authentication failed!');
    }
    //token is made by  1-algorithm/ 2- key=> :supersecret_dont_share/  3-payload=> {id:123,email:abc}
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    //decodedToken=>payload   we extract user_id from it and add it to the req
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
