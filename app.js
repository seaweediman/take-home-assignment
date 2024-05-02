const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { logRequest, validateNewContact } = require('./middleware');
const logger = require('./logger');

// Flag to indicate whether testing mode is enabled. Automatically set in package.json
let isTesting = process.env.NODE_ENV.trim() === 'test';

const app = express();
const PORT = 3001;

// Middleware
// For parsing request bodies
app.use(bodyParser.json());

// For logging requests
app.use(logRequest);

// Read sample data from JSON file
const data = JSON.parse(fs.readFileSync('sample.json'));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Get object
app.get('/contact/:id', (req, res) => {
  // Parse id
  const id = parseInt(req.params.id);

  // Search and return object. Else, return error 404
  const object = data.find((obj) => obj.id == id);
  if (object) {
    res.json(object);
  } else {
    logger.error(`Contact with id ${id} not found`);
    res.status(404).json({ error: 'Contact not found' });
  }
});

// Add new object
app.post('/contact', validateNewContact(data), (req, res) => {
  if (!isTesting) {
    const newContact = req.body;

    // Generate id for new object to be +1 of length, to maintain consistency
    newContact.id = data.length + 1;

    // Add new contact to the parsed array
    data.push(newContact);

    // Write updated data back to the JSON file
    fs.writeFileSync('sample.json', JSON.stringify(data, null, 2));
  }

  // Send success response with new contact
  res.status(200).json({ message: 'Contact succesfully added' });
});

// Delete object by id
app.delete('/contact/id/:id', (req, res) => {
  // Parse id
  const id = parseInt(req.params.id);

  // Find object
  const index = data.findIndex((obj) => obj.id == id);

  // If object not found, just return
  if (index === -1) {
    logger.error(`Contact with id ${id} not found`);
    return res.status(404).json({ error: 'Contact not found' });
  }

  deleteContact(index);

  // Send success response with success message
  res.status(200).json({ message: `Contact with id ${id} has been deleted` });
});

// Delete object by email
app.delete('/contact/email/:email', (req, res) => {
  const email = req.params.email;
  // Find object
  const index = data.findIndex((obj) => obj.email == email);

  // If object not found, just return
  if (index === -1) {
    logger.error(`Contact with email ${email} not found`);
    return res.status(404).json({ error: 'Contact not found' });
  }
  deleteContact(index);

  // Send success response with success message
  res
    .status(200)
    .json({ message: `Contact with email ${email} has been deleted` });
});

// Delete object by phone
app.delete('/contact/phone/:phone', (req, res) => {
  const phone = req.params.phone;

  // Find object
  const index = data.findIndex((obj) => obj.phone == phone);

  // If object not found, just return
  if (index === -1) {
    logger.error(`Contact with phone ${phone} not found`);
    return res.status(404).json({ error: 'Contact not found' });
  }

  deleteContact(index);

  // Send success response with success message
  res
    .status(200)
    .json({ message: `Contact with phone number ${phone} has been deleted` });
});

function deleteContact(index) {
  if (!isTesting) {
    // Delete from array
    data.splice(index, 1);

    // Write updated data back to the JSON file
    fs.writeFileSync('sample.json', JSON.stringify(data, null, 2));
  }
}

module.exports = { app, server };
