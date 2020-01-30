import { Client } from '@loopback/testlab';
import { TargetMvdApplication } from '../..';
import { setupApplication } from './test-helper';

describe('UserController', () => {
  let app: TargetMvdApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  context('when getting an invalid user', function () {
    it('returns not found error', async () => {
      await client.get('/users/1').expect(404);
    });
  })
});
