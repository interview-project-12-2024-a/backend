import { FirebaseAuthGuard } from './firebase_auth.guard';

describe('FirebaseAuthGuard', () => {
  it('should be defined', () => {
    expect(new FirebaseAuthGuard()).toBeDefined();
  });
});
