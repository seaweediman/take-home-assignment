const { app, server } = require('./app');
const request = require('supertest');

describe('GET /contact/:id', () => {
  test('should return status 200 and the contact object if it exists', async () => {
    const response = await request(app).get('/contact/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      })
    );
  });

  test('should return status 404 if the contact object does not exist', async () => {
    const response = await request(app).get('/contact/555');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Contact not found' });
  });

  afterAll(async () => {
    // Close the server instance
    await new Promise((resolve) => server.close(resolve));
  });
});

describe('POST /contact', () => {
  test('should return status 200 and a message saying that the object has been added successfully', async () => {
    const newContact = {
      name: 'unitTesting',
      email: 'unitTest@example.com',
      phone: '5555-5555',
    };

    const response = await request(app).post('/contact').send(newContact);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Contact succesfully added',
      })
    );
  });

  test('should return status 400 if there are missing required fields', async () => {
    const newContact = {
      name: 'Testing',
      email: 'testing@example.com',
    };

    const response = await request(app).post('/contact').send(newContact);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required fields: phone',
    });
  });

  test('should return status 400 if there are invalid fields', async () => {
    const newContact = {
      name: 'Testing',
      email: 'testing@example.com',
      phone: '99999-9999-2999',
      invalid1: '99999-9999-2999',
      invalid2: '99999-9999-2999',
    };

    const response = await request(app).post('/contact').send(newContact);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid fields: invalid1, invalid2',
    });
  });

  test('should return status 400 if there already is an existing phone number', async () => {
    const newContact = {
      name: 'Testing',
      email: 'unit@example.com',
      phone: '99999-9999-999',
    };

    const response = await request(app).post('/contact').send(newContact);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Phone number 99999-9999-999 already exists',
    });
  });

  test('should return status 400 if there already is an existing email address', async () => {
    const newContact = {
      name: 'Testing',
      email: 'bob@example.com',
      phone: '99999-9999-2999',
    };

    const response = await request(app).post('/contact').send(newContact);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Email address bob@example.com already exists',
    });
  });

  afterAll(async () => {
    // Close the server instance
    await new Promise((resolve) => server.close(resolve));
  });
});

describe('DELETE /contact/id/:id', () => {
  test('should return status 200 and a message saying that the object has been deleted successfully', async () => {
    const response = await request(app).delete('/contact/id/5');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Contact with id 5 has been deleted',
      })
    );
  });

  test('should return status 404 if the contact object does not exist', async () => {
    const response = await request(app).delete('/contact/id/555555');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Contact not found' });
  });

  afterAll(async () => {
    // Close the server instance
    await new Promise((resolve) => server.close(resolve));
  });
});

describe('DELETE /contact/email/:email', () => {
  test('should return status 200 and a message saying that the object has been deleted successfully', async () => {
    const response = await request(app).delete(
      '/contact/email/alice@example.com'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Contact with email alice@example.com has been deleted',
      })
    );
  });

  test('should return status 404 if the contact object does not exist', async () => {
    const response = await request(app).delete(
      '/contact/email/notexist@example.com'
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Contact not found' });
  });

  afterAll(async () => {
    // Close the server instance
    await new Promise((resolve) => server.close(resolve));
  });
});

describe('DELETE /contact/phone/:phone', () => {
  test('should return status 200 and a message saying that the object has been deleted successfully', async () => {
    const response = await request(app).delete('/contact/phone/987-654-3210');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Contact with phone number 987-654-3210 has been deleted',
      })
    );
  });

  test('should return status 404 if the contact object does not exist', async () => {
    const response = await request(app).delete('/contact/phone/0000000');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Contact not found' });
  });

  afterAll(async () => {
    // Close the server instance
    await new Promise((resolve) => server.close(resolve));
  });
});
