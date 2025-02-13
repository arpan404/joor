import { Joor, JoorResponse, Router } from 'joor';
const router = new Router();
const app = new Joor();
router.get('/hello', (_req) => {
  const response = new JoorResponse();

  const data = {
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          geo: {
            lat: '37.7749',
            lng: '-122.4194',
          },
        },
        phone: '555-555-5555',
        website: 'johndoe.com',
        company: {
          name: 'Doe Enterprises',
          catchPhrase: 'Innovative solutions',
          bs: 'synergize scalable e-markets',
          departments: [
            {
              name: 'Engineering',
              head: 'Alice Johnson',
              employees: 50,
            },
            {
              name: 'Marketing',
              head: 'Bob Brown',
              employees: 30,
            },
          ],
        },
        hobbies: ['reading', 'travelling'],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Elm St',
          city: 'Othertown',
          state: 'NY',
          zip: '67890',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        phone: '555-555-1234',
        website: 'janesmith.com',
        company: {
          name: 'Smith Co',
          catchPhrase: 'Quality over quantity',
          bs: 'leverage agile frameworks',
          departments: [
            {
              name: 'Sales',
              head: 'Carol White',
              employees: 40,
            },
            {
              name: 'Support',
              head: 'John Doe',
              employees: 20,
            },
          ],
        },
        hobbies: ['cooking', 'hiking'],
      },
      {
        id: 3,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        address: {
          street: '789 Oak St',
          city: 'Sometown',
          state: 'TX',
          zip: '54321',
          geo: {
            lat: '32.7767',
            lng: '-96.7970',
          },
        },
        phone: '555-555-6789',
        website: 'alicejohnson.com',
        company: {
          name: 'Johnson LLC',
          catchPhrase: 'Exceeding expectations',
          bs: 'empower customized solutions',
          departments: [
            {
              name: 'HR',
              head: 'Jane Smith',
              employees: 25,
            },
            {
              name: 'Finance',
              head: 'Bob Brown',
              employees: 15,
            },
          ],
        },
        hobbies: ['painting', 'cycling'],
      },

      {
        id: 4,
        name: 'Bob Brown',
        email: 'bob.brown@example.com',
        address: {
          street: '101 Pine St',
          city: 'Anycity',
          state: 'FL',
          zip: '98765',
          geo: {
            lat: '27.9944',
            lng: '-81.7603',
          },
        },
        phone: '555-555-9876',
        website: 'bobbrown.com',
        company: {
          name: 'Brown Inc',
          catchPhrase: 'Delivering excellence',
          bs: 'streamline mission-critical platforms',
          departments: [
            {
              name: 'Operations',
              head: 'Alice Johnson',
              employees: 35,
            },
            {
              name: 'IT',
              head: 'Jane Smith',
              employees: 45,
            },
          ],
        },
        hobbies: ['fishing', 'gardening'],
      },
      {
        id: 5,
        name: 'Carol White',
        email: 'carol.white@example.com',
        address: {
          street: '202 Maple St',
          city: 'Everytown',
          state: 'WA',
          zip: '11223',
          geo: {
            lat: '47.6062',
            lng: '-122.3321',
          },
        },
        phone: '555-555-1122',
        website: 'carolwhite.com',
        company: {
          name: 'White Solutions',
          catchPhrase: 'Innovate and deliver',
          bs: 'disrupt the status quo',
          departments: [
            {
              name: 'R&D',
              head: 'Bob Brown',
              employees: 60,
            },
            {
              name: 'Legal',
              head: 'Alice Johnson',
              employees: 10,
            },
          ],
        },
      },
    ],
  };
  response.setData(JSON.stringify(data));
  response.message = 'OK';
  return response;
});
app.prepare().then(() => app.start());
