import PhoneNumber from '../../../shared/phone-number';

export interface SmsSender {
  send(to: PhoneNumber, message: string): void;
}
