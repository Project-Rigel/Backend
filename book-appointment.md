---
title: Get Available Intervals Function Doc
nav_order: 0
---

#Nombre del Callable
**bookAppointment**

[Try the function here](https://europe-west1-rigel-admin.cloudfunctions.net/bookAppointment)

# Dto de entrada
```ts
export class BookAppointmentDto {
  @IsString()
  uid!: string;

  @IsString()
  businessId!: string;
  @IsString()
  productId!: string;

  @IsDate()
  @Type(() => Date)
  timestamp!: Date;

  @IsOptional()
  @IsString()
  agendaId?: string;
}
```

El timestamp va en ISOFormat que es por ejemplo: 2020-08-07T21:00:00.000Z
La clave data la pone automaticamente el firebasesdk al hacer functions.callable();
<b> El TIMESTAMP TIENE QUE SER UTC </b>

Ejemplo:
```json
{
	"data": {
		"uid": "KFaS4Vkbs23PEPSdGnmo",
		"businessId": "123456789arturo",
		"agendaId": "AZNVcZzTz5F9yLkxx96h",
		"productId": "A433SpwXXCWg67ZLiezC",
		"timestamp": "2020-08-07T18:00:00.000Z"
	}
}
```

# Respuesta

```ts
export class AppointmentResponse {
  /**
   * startDate of the appointment in ISOString UTC
   */
  startDate: string;

  /**
   * endDate of the appointment in ISOString UTC
   */
  endDate: string;

  /**
   * customer's full name
   */
  customerName: string;

  productName: string;

  customerId: string;

  /**
   * appointment id
   */
  id: string;

  /**
   * duration of the appointment in MINUTES
   */
  duration: number;
}


```

Ejemplo:

````json
{
  "result": {
    "appointment": {
      "startDate": "2020-08-07T18:00:00.000Z",
      "endDate": "2020-08-07T20:00:00.000Z",
      "customerName": "juan carlos",
      "name": "producto de 2 horas",
      "customerId": "KFaS4Vkbs23PEPSdGnmo",
      "id": "01T5doLx7mZbHsSIcay0",
      "duration": 120
    }
  }
}
````

