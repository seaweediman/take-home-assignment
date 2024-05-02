const logger = require('./logger');

// For logging requests
function logRequest(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

function validateNewContact(data) {
  return function (req, res, next) {
    const newContact = req.body;
    const requiredFields = ['name', 'email', 'phone'];

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter((field) => !newContact[field]);

    // If any required fields are missing, return an error response
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Check if the request body contains only the specified fields
    const fieldsInRequest = Object.keys(newContact);
    const invalidFields = fieldsInRequest.filter(
      (field) => !requiredFields.includes(field)
    );

    // If any additional fields are present, return a 400 Bad Request
    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    // Check if the provided email address is already in use
    const emailExists = data.some(
      (contact) => contact.email === newContact.email
    );

    if (emailExists) {
      return res
        .status(400)
        .json({ error: `Email address ${newContact.email} already exists` });
    }

    // Check if the provided phone number is already in use
    const phoneExists = data.some(
      (contact) => contact.phone === newContact.phone
    );
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: `Phone number ${newContact.phone} already exists` });
    }

    // If validation passes, call next() to proceed to the route handler
    next();
  };
}

module.exports = { logRequest, validateNewContact };
