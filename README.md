# Take Home Assignment by Mohamed Noriman
# Deployed on https://iman-take-home.azurewebsites.net/

Github actions was used to deploy to Azure App Services for continuous deployment.

<ins>Sample endpoints:</ins>
- Retrieve all contacts: /contact/
- Retrieving single contact: /contact/1
- Adding a single contact: /contact/
- Deleting an contact: /contact/email/alice@example.com

For add and delete endpoints, Postman can be used to send requests.

<ins>Sample Add request:</ins>
```
POST https://iman-take-home.azurewebsites.net/contact
{
    "name": "Sample",
    "email": "testingsample@example.com",
    "phone": "000-000-000"
}
```

<ins>Sample Delete requests:</ins>
```
DELETE https://iman-take-home.azurewebsites.net/contact/id/5
DELETE https://iman-take-home.azurewebsites.net/contact/email/alice@example.com
DELETE https://iman-take-home.azurewebsites.net/contact/phone/111-222-3333
```

<ins>Things to note:</ins>
- Contacts have a unique email and unique phone number. There can only be a single contact with a specific email or a specific phone number. Else, the request fails
- When new contacts are added, a unique id is generated for that contact
- When adding a contact, there must be 3 fields:
  - name
  - email
  - phone

   Without them, the request will be thrown an error stating which fields are missing
- When adding a contact with invalid fields other than the 3 above, an error would be thrown stating which fields are invalid
- Contacts can be deleted by id, email, phone number
  - /contact/id/5
  - /contact/email/alice@example.com
  - /contact/phone/99999-9999-999

To start app: `npm start`. The app will load and use `contacts.json` where the json file will be updated after each request.

To run unit tests: `npm test`. The environment would automatically be set to test environment. Unit tests are run using `testContacts.json` where the file will not be modified.



