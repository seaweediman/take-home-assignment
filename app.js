const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

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
    const object = data.find(obj => obj.id == id);
    if (object) {
        res.json(object);
    } else {
        res.status(404).json({ error: 'Object not found' });
    }
});

// Add new object
app.post('/contact/:id', (req, res) => {
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
