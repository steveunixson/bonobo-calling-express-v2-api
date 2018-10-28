/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Sales = new Schema({
  shift: { type: Number },
  total: { type: Number, default: 1 },
  project: { type: String },
  date: {
    type: Date,
  },
  operator: {
    type: String,
  },
  status: String,
  apikey: String,
});
const SalesModel = mongoose.model('Sales', Sales);
module.exports = SalesModel;
