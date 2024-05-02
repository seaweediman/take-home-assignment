const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;

// Read sample data from JSON file
const data = JSON.parse(fs.readFileSync('sample.json'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/contact/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const object = data.find(obj => obj.id == id);
    if (object) {
        res.json(object);
    } else {
        res.status(404).json({ error: 'Object not found' });
    }
});