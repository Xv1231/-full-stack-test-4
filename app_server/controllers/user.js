const Notes = require('../models/notes');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const createToken = (id) => {
  return jwt.sign({ id: id }, 'secret key');
};

module.exports.login = async (req, res) => {
  if (req.body.username && req.body.password) {
    const user = await User.findOne(
      { username: req.body.username, password: req.body.password },
      (err, data) => {
        if (err) {
          sendJsonResponse(res, 400, err);
          return;
        } else if (data != null) {
          req.session.authentication = true;
          sendJsonResponse(res, 400, { Message: 'Successfully logged in' });
        } else {
          sendJsonResponse(res, 400, { Message: 'User not registered' });
        }
      }
    );
    // const token = createToken(user._id);
    // console.log('token is ' + token);
    // //res.cookie('jwt', token, { httpOnly: false });
  } else {
    sendJsonResponse(res, 400, {
      Message: 'Username and Password are required',
    });
  }
};

module.exports.register = async (req, res) => {
  if (req.body.name && req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }, (err, data) => {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else if (data != null) {
        sendJsonResponse(res, 403, {
          Message: 'User with same username already exists',
        });
      } else {
        const usr = new User(req.body);
        usr.save((err, user) => {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            sendJsonResponse(res, 201, user);
          }
        });
      }
    });
  } else {
    sendJsonResponse(res, 400, {
      Message: 'username, password and name are required',
    });
  }
};

module.exports.notes = (req, res) => {
  if (req.session.authentication == false) {
    sendJsonResponse(res, 401, 'Unauthorized');
    return;
  }
  Notes.find({}).exec((err, notes) => {
    if (!notes) {
      sendJsonResponse(res, 404, {
        message: 'Notes not found',
      });
      return;
    } else if (err) {
      sendJsonResponse(res, 404, err);
      return;
    }
    sendJsonResponse(res, 201, notes);
  });
};

module.exports.create = (req, res) => {
  if (req.session.authentication == false) {
    sendJsonResponse(res, 401, 'Unauthorized');
    return;
  }
  const note = new Notes(req.body);
  note.save((err) => {
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      sendJsonResponse(res, 201, note);
    }
  });
};

module.exports.changestatus = (req, res) => {
  Notes.updateOne(
    { _id: req.params.noteID },
    { status: 'completed' },
    (err, data) => {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else if (data.matchedCount != 0) {
        sendJsonResponse(res, 200, { Message: 'Successfully Updated' });
      } else {
        sendJsonResponse(res, 200, { Message: 'note never exists' });
      }
    }
  );
};

module.exports.completed = (req, res) => {
  if (req.session.authentication == false) {
    sendJsonResponse(res, 401, 'Unauthorized');
    return;
  }
  Notes.find({ status: 'completed' }).exec((err, notes) => {
    if (!notes) {
      sendJsonResponse(res, 404, {
        message: 'Notes not found',
      });
      return;
    } else if (err) {
      sendJsonResponse(res, 404, err);
      return;
    }
    sendJsonResponse(res, 201, notes);
  });
};
module.exports.incomplete = (req, res) => {
  if (req.session.authentication == false) {
    sendJsonResponse(res, 401, 'Unauthorized');
    return;
  }
  Notes.find({ status: 'incomplete' }).exec((err, notes) => {
    if (!notes) {
      sendJsonResponse(res, 404, {
        message: 'Notes not found',
      });
      return;
    } else if (err) {
      sendJsonResponse(res, 404, err);
      return;
    }
    sendJsonResponse(res, 201, notes);
  });
};

module.exports.delete = function (req, res) {
  const id = req.params.noteID;
  Notes.findByIdAndDelete(id, (err) => {
    if (err) {
      sendJsonResponse(res, 404, err);
      return;
    }
    sendJsonResponse(res, 201, id);
  });
};

module.exports.logout = function (req, res) {
  const directory = 'sessions';
  const fs = require('fs');
  const path = require('path');

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.log('Error reading directory:', err);
    } else {
      files.forEach((file) => {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 202, file);
          }
        });
      });
    }
  });
};
