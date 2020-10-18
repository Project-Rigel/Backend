import * as functions from 'firebase-functions';
import PhoneNumber from '../../shared/phone-number';
import { SmsSender } from '../domain/services/sms-sender';

export class TwilioSmsSender implements SmsSender {
  async send(to: PhoneNumber, message: string): Promise<void> {
    const accountSid = functions.config().twilio.accountsid;
    const authToken = functions.config().twilio.authtoken;

    const client = require('twilio')(accountSid, authToken);

    try {
      await client.messages.create({
        body: message,
        from: '+12672096706',
        to: to.phoneNumber,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
