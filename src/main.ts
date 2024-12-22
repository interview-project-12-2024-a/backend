import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // firebase config
  const accountPath = process.env.FIREBASE_KEY;
  const serviceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'));
  const adminConfig: admin.ServiceAccount = {
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
