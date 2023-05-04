const express = require('express');
const routes = express.Router();

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const addUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Internal Server Error',
  });
};

routes.route('/').get(getAllUsers).post(addUser);
routes.route('/:id').patch(updateUser).delete(deleteUser);

module.exports = routes;
