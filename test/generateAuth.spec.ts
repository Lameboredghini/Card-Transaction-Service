import dotenv from 'dotenv';
dotenv.config();
import { generateAdminToken } from '../src/utils/generateAuthToken';

describe.skip('Card API Endpoints', () => {
  it('should generate auth token successfully', async () => {
    const email = 'imdivyamyadav@gmail.com';
    const authToken = generateAdminToken(email); // only supports email with @gmail.com
    console.log(authToken);
  });
});
