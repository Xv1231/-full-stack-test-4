const jwt = require('jsonwebtoken');

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'secret key', (err, decodedToken) => {
      if (err) {
        sendJsonResponse(res, 404, err);
        res.redirect('/users/login/');
      } else {
        sendJsonResponse(res, 201, decodedToken);
        next();
      }
    });
  } else {
    sendJsonResponse(res, 404, 'No Token');
  }
};

// const requireAuth = (req, res) => {
//   try {
//     const token = req.cookies.jwt;
//     if (token) {
//       //const token = authHeader.split(' ')[1];

//       jwt.verify(token, 'secret key', (err, user) => {
//         if (err) res.status(403).json('Token is Invalid!');
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(401).json('You are not Authenticated!');
//     }
//   } catch (err) {
//     sendJsonResponse(res, 404, err);
//   }
// };

module.exports = { requireAuth };
