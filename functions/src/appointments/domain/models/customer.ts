import PhoneNumber from '../../../shared/phone-number';

export class Customer {
  id: string;
  email: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phone: PhoneNumber;

  constructor(
    id: string,
    email: string,
    name: string,
    firstSurname: string,
    secondSurname: string,
    phone: PhoneNumber,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.firstSurname = firstSurname;
    this.secondSurname = secondSurname;
    this.phone = phone;
  }

  get fullName(): string {
    return `${this.name} ${this.firstSurname} ${this.secondSurname}`;
  }
}
