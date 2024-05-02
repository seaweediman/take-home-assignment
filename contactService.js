const fs = require('fs');
// Flag to indicate whether testing mode is enabled. Automatically set in package.json

class ContactService {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this.loadData();
    this.isTesting = this.setIsTesting();
  }

  setIsTesting() {
    const nodeEnv = process.env.NODE_ENV
      ? process.env.NODE_ENV.trim()
      : 'development';

    this.isTesting = nodeEnv === 'test';
  }

  loadData() {
    try {
      const jsonData = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  }

  saveData() {
    if (!this.isTesting) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }

  getAllContacts() {
    return this.data;
  }

  getContactById(id) {
    return this.data.find((contact) => contact.id === id);
  }

  getContactByEmail(email) {
    return this.data.find((contact) => contact.email === email);
  }

  getContactByPhone(phone) {
    return this.data.find((contact) => contact.phone === phone);
  }

  addContact(newContact) {
    // Generate id for new object to be +1 of length, to maintain consistency
    newContact.id = this.generateUniqueId();
    this.data.push(newContact);
    this.saveData();
  }

  deleteById(id) {
    const index = this.data.findIndex((contact) => contact.id === id);
    if (index !== -1) {
      return this.deleteContact(index);
    }
    return null;
  }

  deleteByEmail(email) {
    const index = this.data.findIndex((contact) => contact.email === email);
    if (index !== -1) {
      return this.deleteContact(index);
    }
    return null;
  }

  deleteByPhone(phone) {
    const index = this.data.findIndex((contact) => contact.phone === phone);
    if (index !== -1) {
      return this.deleteContact(index);
    }
    return null;
  }

  deleteContact(index) {
    const deletedContact = this.data.splice(index, 1)[0];
    this.saveData();
    return deletedContact;
  }

  generateUniqueId() {
    let newId;
    do {
      newId = Math.floor(Math.random() * 1000000);
    } while (this.data.includes(newId)); // Check if the generated ID already exists

    return newId;
  }
}

module.exports = ContactService;
