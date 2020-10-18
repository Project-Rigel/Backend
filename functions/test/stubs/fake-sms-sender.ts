import { SmsSender } from '../../src/appointments/domain/services/sms-sender';
import PhoneNumber from '../../src/shared/phone-number';

export class FakeSMSSender implements SmsSender {
  send(to: PhoneNumber, message: string): void {}
}
