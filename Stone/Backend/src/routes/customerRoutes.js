const express = require('express');
const customerRouter = express.Router();
const CustomerController = require('../controllers/customerController');

customerRouter.get('/', CustomerController.getAll);       // GET all
customerRouter.get('/:id', CustomerController.getById);   // GET by id
customerRouter.post('/', CustomerController.create);      // CREATE
customerRouter.put('/:id', CustomerController.update);    // UPDATE
customerRouter.delete('/:id', CustomerController.delete);// DELETE

module.exports = customerRouter;
