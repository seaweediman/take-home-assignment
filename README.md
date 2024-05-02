# Take Home Assignment by Mohamed Noriman
# Deployed on https://iman-take-home.azurewebsites.net/

Github actions was used to deploy to Azure App Services for continuous deployment.
Sample endpoints:
- Retrieve all contacts: /contact/
- Retrieving single contact: /contact/1
- Adding a single contact: /contact/
- Deleting an contact: /contact/email/alice@example.com

Things to note:
- Contacts have a unique email and unique phone number. There can only be a single contact with a specific email or a specific phone number. Else, the request fails
- Contacts can be deleted by id, email, phone number
  - /contact/id/5
  - /contact/email/alice@example.com
  - /contact/phone/99999-9999-999

To start app: `npm start`. The app will load and use `contacts.json` where the json file will be updated after each request.

To run unit tests: `npm test`. The environment would automatically be set to test environment. Unit tests are run using `testContacts.json` where the file will not be modified.

