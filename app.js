const express = require('express');
const bodyParser = require('body-parser');
const ContactService = require('./contactService');
const { logRequest, validateNewContact } = require('./middleware');
const logger = require('./logger');

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
    logger.error(`No contacts found.`);
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
    logger.error(`Contact with id ${id} not found`);
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

// Delete object by id, email, or phone
// To delete by:
//    id: /contact/id/5
//    email: /contact/email/alice@example.com
//    phone: /contact/phone/987-654-3210
app.delete('/contact/:key/:value', (req, res) => {
  const { key, value } = req.params;
  let deletedContact;

  switch (key) {
    case 'id':
      deletedContact = contactService.deleteById(parseInt(value));
      break;
    case 'email':
      deletedContact = contactService.deleteByEmail(value);
      break;
    case 'phone':
      deletedContact = contactService.deleteByPhone(value);
      break;
    default:
      return res.status(400).json({ error: 'Invalid key' });
  }

  if (!deletedContact) {
    logger.error(`Contact with ${key} ${value} not found`);
    return res.status(404).json({ error: 'Contact not found' });
  }

  res
    .status(200)
    .json({ message: `Contact with ${key} ${value} has been deleted` });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
