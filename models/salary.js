/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Salary = new Schema({

  intern: Number,
  operator: Number,
  demo: Number,
  vite: Number,
  apikey: String,

});
const SalaryModel = mongoose.model('Salary', Salary);
module.exports = SalaryModel;
