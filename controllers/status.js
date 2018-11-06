const Status = require('../models/status');
const Sales = require('../models/conversion');
const Salary = require('../models/salary');

const log = require('../utils/log');

const date = new Date().toLocaleTimeString();

function postStatus(req, res) {
  const key = req.headers['x-api-key'];

  const status = new Status({
    status: req.body.status, // required
    number: req.body.number, // required
    client: req.body.client, // required
    base: req.body.base, // required
    time: req.body.time,
    age: req.body.age,
    appointment: req.body.appointment,
    month: date,
    close: req.body.close,
    operator: req.body.operator,
    comment: req.body.comment,
    apikey: key,
  });
  status.save((err, stats) => {
    if (!err) {
      log.debug('status added to collection');
      return res.status(200).json({ err: 0, status: stats });
    }

    log.error(err);
    return res.json({ message: 'Internal Error' });
  });
}

function removeStatus(req, res) {
  const UserStatus = { status: req.body.status };
  const Comment = { comment: req.body.comment };
  const Client = { client: req.body.client };
  const Key = { key: req.headers['x-api-key'] };

  try {
    Status.findOneAndRemove({
      status: UserStatus.status, comment: Comment.comment, client: Client.client, apikey: Key.key,
    }, () => res.status(200).json({ err: 0, status: 'Removed' }));
  } catch (error) {
    log.error(`Exception caught: ${error}`);
    return res.status(500).json({ err: 1, status: `Internal Error: ${error}` });
  }
  return 0;
}

module.exports.postStatus = postStatus;
module.exports.removeStatus = removeStatus;
