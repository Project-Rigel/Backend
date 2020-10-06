export class BookAppointmentForBusinessDto {
  public readonly businessId: string;
  public readonly startDate: string;
  public readonly customerId: string;
  public readonly productId: string;
  public readonly agendaId: string;

  constructor(
    businessId: string,
    startDate: string,
    customerId: string,
    productId: string,
    agendaId: string,
  ) {
    this.businessId = businessId;
    this.startDate = startDate;
    this.customerId = customerId;
    this.productId = productId;
    this.agendaId = agendaId;
  }
}
