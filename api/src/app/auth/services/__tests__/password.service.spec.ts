// api/src/app/auth/services/__tests__/password.service.spec.ts
jest.mock('bcrypt', () => ({
  hash: async (data: any) => `HASH(${data})`,
  compare: async (presented: any, stored: any) => stored === `HASH(${presented})`,
}));

import { PasswordService } from '../password.service';

describe('PasswordService', () => {
  const svc = new PasswordService();

  it('hashes and verifies a password', async () => {
    const hash = await svc.hash('CorrectHorseBatteryStaple!');
    expect(hash).not.toEqual('CorrectHorseBatteryStaple!');
    await expect(svc.verify('CorrectHorseBatteryStaple!', hash)).resolves.toBe(true);
    await expect(svc.verify('wrong', hash)).resolves.toBe(false);
  });
});
