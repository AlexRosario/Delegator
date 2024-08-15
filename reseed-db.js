import * as _ from 'lodash-es';
import { writeFileSync, readFileSync } from 'fs';
import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';
const capitalize = _.capitalize;

const user = {
  id: uuidV4(),
  username: capitalize(faker.internet.userName()),
  email: faker.internet.email(),
  password: faker.internet.password(),
  address: {
    street: faker.location.streetAddress(),
    city: capitalize(faker.location.city()),
    state: faker.location.state(),
    zipcode: faker.location.zipCode()
  }
};

let db;
try {
  const data = readFileSync('db.json', { encoding: 'utf-8' });
  db = JSON.parse(data);
} catch (error) {
  db = { users: [] };
}

db.users.push(user);

writeFileSync('db.json', JSON.stringify(db, null, 2), { encoding: 'utf-8' });

console.log('User added successfully:', user);
