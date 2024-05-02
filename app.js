const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { logRequest, validateNewContact } = require('./middleware');

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
app.listen(PORT, () => {
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
    res.status(404).json({ error: 'Object not found' });
  }
});

// Add new object
app.post('/contact', validateNewContact(data), (req, res) => {
  const newContact = req.body;

  console.log(req.body);
  // Generate id for new object to be +1 of length, to maintain consistency
  newContact.id = data.length + 1;

  // Add new contact to the parsed array
  data.push(newContact);

  // Write updated data back to the JSON file
  fs.writeFileSync('sample.json', JSON.stringify(data, null, 2));

  // Send success response with new contact
  res.status(200).json(newContact);
});

// Delete object by id
app.delete('/contact/id/:id', (req, res) => {
  // Parse id
  const id = parseInt(req.params.id);

  // Find object
  const index = data.findIndex((obj) => obj.id == id);

  // If object not found, just return
  if (index === -1) {
    return res.status(404).json({ error: 'Object not found' });
  }

  deleteContact(index);

  // Send success response with success message
  res.status(200).json({ message: `Object with id ${id} has been deleted` });
});

// Delete object by email
app.delete('/contact/email/:email', (req, res) => {
  const email = req.params.email;

  // Find object
  const index = data.findIndex((obj) => obj.email == email);

  // If object not found, just return
  if (index === -1) {
    return res.status(404).json({ error: 'Object not found' });
  }

  deleteContact(index);

  // Send success response with success message
  res
    .status(200)
    .json({ message: `Object with email ${email} has been deleted` });
});

// Delete object by phone
app.delete('/contact/phone/:phone', (req, res) => {
  const phone = req.params.phone;

  // Find object
  const index = data.findIndex((obj) => obj.phone == phone);

  // If object not found, just return
  if (index === -1) {
    return res.status(404).json({ error: 'Object not found' });
  }

  deleteContact(index);

  // Send success response with success message
  res
    .status(200)
    .json({ message: `Object with phone number ${phone} has been deleted` });
});

function deleteContact(index) {
  // Delete from array
  data.splice(index, 1);

  // Write updated data back to the JSON file
  fs.writeFileSync('sample.json', JSON.stringify(data, null, 2));
}
