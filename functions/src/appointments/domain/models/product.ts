export class Product {
  description: string;
  duration: number;
  name: string;
  id: string;
  businessId: string;

  constructor(
    description: string,
    duration: number,
    name: string,
    id: string,
    businessId: string,
  ) {
    this.description = description;
    this.duration = duration;
    this.name = name;
    this.id = id;
    this.businessId = businessId;
  }
}
