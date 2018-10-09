const xlsxj = require('xlsx-to-json');
const JSONStream = require('JSONStream');
const fs = require('fs');
const path = require('path');
const SaveToMongo = require('save-to-mongo');
const os = require('os');
const mongoose = require('mongoose');

const Match = require('../models/phonebase');
const log = require('../utils/log')(module);
const config = require('../config/mongodb');

function postUpload(req, res) {
  if (!req.body || !req.files.xlsx || !req.body.name || !req.body.type || !req.body.comment || !req.headers['x-api-key']) {
    return res.status(400).json({ error: 1, msg: 'Bad Request' });
  }
  const xlsxFile = req.files.xlsx.path;
  const jsonfile = `${os.tmpdir()}/${req.body.name}.json`;
  const apiKey = { key: req.headers['x-api-key'] };
  const match = new Match({
    name: req.body.name,
    type: req.body.type,
    comment: req.body.comment,
    apikey: apiKey.key,
  });
  const saveToMongo = SaveToMongo({
    uri: config.database,
    collection: req.body.name,
    bulk: {
      mode: 'unordered',
    },
  });
  match.save((err, result) => {
    if (err) {
      log.error(`Error: ${err}`);
      return res.status(500).json({ error: 1, msg: 'Internal Error' });
    }
    return res.status(200).json({ error: 0, msg: { match: result } });
  });
  xlsxj({
    input: xlsxFile,
    output: jsonfile,
  }, (err) => {
    if (err) {
      log.error(err);
    } else {
      log.debug('Created json file!');
      fs.createReadStream(path.join(jsonfile))
        .pipe(JSONStream.parse('*'))
        .pipe(saveToMongo)
        .on('execute-error', (errorSave) => {
          log.error(errorSave);
        })
        .on('done', () => {
          log.info('Data uploaded to DB!!!');
        });
    }
  });
  return 0;
}

function getUpload(req, res) {
  const key = req.headers['x-api-key'];
  Match.find({ apikey: key }, (err, users) => {
    if (err) res.status(404).json({ err: 1, msg: 'Not Found' });

    res.status(200).json({ err: 0, msg: users });
  });
}

function find(name, query, cb) {
  mongoose.connection.db.collection(name, (err, collection) => {
    collection.find(query).toArray(cb);
  });
}

function getPhone(req, res) {
  if (!req.body.base) return res.status(400).send('No base was specified.');

  find(req.body.base, { _id: req.body.id }, (err, docs) => {
    if (err) {
      return res.status(404).json({ err: 1, msg: 'Not Found' });
    }

    return res.status(200).json({ err: 0, msg: docs });
  });
  return 0;
}

function activity(req, res) {
  const name = { name: req.body.name };
  const type = { type: req.body.type };
  const key = req.headers['x-api-key'];

  try {
    Match.findOneAndUpdate({ name, apikey: key }, { $set: { type } }, () => res.status(200).json({ err: 0, msg: 'Updated' }));
  } catch (error) {
    return res.status(500).json({ err: 1, msg: 'Internal Error' });
  }
  return 0;
}

function getTemplate(res) {
  const file = 'tmp/templates/База.xlsx';
  try {
    return res.download(file);
  } catch (error) {
    return res.status(500).json({ err: 1, msg: 'Internal Error' });
  }
}

module.exports.postUpload = postUpload;
module.exports.getUpload = getUpload;
module.exports.getPhone = getPhone;
module.exports.activity = activity;
module.exports.getTemplate = getTemplate;
