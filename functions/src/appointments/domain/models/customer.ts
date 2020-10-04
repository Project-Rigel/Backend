export class Customer {
  id: string;
  email: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  phone: string;

  constructor(
    id: string,
    email: string,
    name: string,
    firstSurname: string,
    secondSurname: string,
    phone: string,
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
