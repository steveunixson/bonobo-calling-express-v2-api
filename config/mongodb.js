require('dotenv').config();

module.exports = {
  database: process.env.MONGODB_URI,
  secret: process.env.SRV_SECRET,
  autoIndex: false,
  useNewUrlParser: true,
};
