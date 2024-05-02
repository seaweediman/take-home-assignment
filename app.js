const express = require('express');
const bodyParser = require('body-parser');
const ContactService = require('./contactService');
const { logRequest, logError, validateNewContact } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3001;
const nodeEnv = process.env.NODE_ENV
  ? process.env.NODE_ENV.trim()
  : 'development';
// If in testing environment, use testContacts
const CONTACTS_FILE_PATH =
  nodeEnv === 'test'
    ? 'json_files/testContacts.json'
    : 'json_files/contacts.json';

// Middleware
app.use(bodyParser.json());
app.use(logRequest);
app.use(logError);

// Initialize ContactService
const contactService = new ContactService(CONTACTS_FILE_PATH);

// Routes
// Get object
app.get('/', (req, res) => {
  res.send('Please enter a valid endpoint as per the README.');
});

app.get('/contact/', (req, res) => {
  // Search and return object. Else, return error 404
  const contacts = contactService.getAllContacts();
  if (contacts) {
    res.json(contacts);
  } else {
    res.status(404).json({ error: 'No contacts found.' });
  }
});

app.get('/contact/:id', (req, res) => {
  // Parse id
  const id = parseInt(req.params.id);

  // Search and return object. Else, return error 404
  const contact = contactService.getContactById(id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
});

// Add new object
app.post(
  '/contact',
  validateNewContact(contactService.getAllContacts()),
  (req, res) => {
    const newContact = req.body;
    contactService.addContact(newContact);
    res.status(200).json({ message: 'Contact succesfully added' });
  }
);

app.delete('/contact/id/:id', (req, res) => {
  const id = req.params.id;
  let deletedContact = contactService.deleteById(parseInt(id));

  if (!deletedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.status(200).json({ message: `Contact with id ${id} has been deleted` });
});

app.delete('/contact/email/:email', (req, res) => {
  const email = req.params.email;
  let deletedContact = contactService.deleteByEmail(email);

  if (!deletedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res
    .status(200)
    .json({ message: `Contact with email ${email} has been deleted` });
});

app.delete('/contact/phone/:phone', (req, res) => {
  const phone = req.params.phone;
  let deletedContact = contactService.deleteByPhone(phone);

  if (!deletedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res
    .status(200)
    .json({ message: `Contact with phone number ${phone} has been deleted` });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
