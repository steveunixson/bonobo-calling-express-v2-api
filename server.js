/*
    Bonobo V2 API Entry point
    This app is lisenced via MIT licence
    Author: Steve Unixson
    copyright © BonoboContact 2018
*/
require('dotenv').config();
// const feathers = require('@feathersjs/feathers');
const os = require('os');
const cors = require('cors');
const compress = require('compression');
const formData = require('express-form-data');
const express = require('@feathersjs/express');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const swaggerDocument = require('./api/swagger.json');
const log = require('./utils/log')(module);
const config = require('./config/config');
const auth = require('./routers/auth');
const org = require('./routers/org');
const upload = require('./routers/upload');

const port = process.env.PORT || 3000;
const baseUrl = config.url;


const app = express();

app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
const options = {
  uploadDir: os.tmpdir(),
  autoClean: false,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());
/*
    Basic auth is going to be used for service needs such as deleting organization and all its data
    or something like swagger
    Credentials should be strong enough or generated and stored in .env file
    ONLY AT DEPLOYMENT STATE
*/

/**
 * @return {boolean}
 */
function BasicAuthorizer(username, password) {
  return username === process.env.ROOTUSER && password === process.env.ROOTPWD;
}

app.use(auth);
app.use(upload);
app.use(basicAuth({ authorizer: BasicAuthorizer }), org);


app.use(`${baseUrl}/swagger`, basicAuth({ authorizer: BasicAuthorizer, challenge: true, realm: 'Imb4T3st4pp' }), swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', basicAuth({ authorizer: BasicAuthorizer, challenge: true, realm: 'Imb4T3st4pp' }), (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  log.info('Calling Bonobo Now Running On :', config.colors.FgMagenta, `${port}`);
});
