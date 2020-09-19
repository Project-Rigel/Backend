---
title: Get Available Intervals Function
nav_order: 1
---

#Nombre del Callable
**getAvaliableTimeIntervals**

[Try the function here](https://europe-west1-rigel-admin.cloudfunctions.net/getAvaliableTimeIntervals)


# Dto de entrada
```ts
export class GetAvailableTimesDto {

  @IsString()
  businessId!: string;

  @IsString()
  agendaId!: string;

  @IsString()
  productId: string;

  @IsDateString()
  timestamp!: string;
}

```

El timestamp va en ISOFormat que es por ejemplo: 2020-08-07T21:00:00.000Z
La clave data la pone automaticamente el firebasesdk al hacer functions.callable();
<b> El TIMESTAMP TIENE QUE SER UTC </b>

Ejemplo:
```json
{
	"data": {
		"businessId": "123456789arturo",
		"agendaId": "AZNVcZzTz5F9yLkxx96h",
		"productId": "UGVWoJyUb7B7alwVVy0M",
		"timestamp": "2020-08-07T21:00:00.000Z"
	}
}
```

# Respuesta
La respuesta de la fecha es en UTC ISO format.
```ts
export class ResponseDto {
  result: {from: string, to:string}[]
}

```

Ejemplo:

````json
{
  "result": [
    {
      "from": "2020-08-07T11:00:00.000Z",
      "to": "2020-08-07T11:30:00.000Z"
    },
    {
      "from": "2020-08-07T14:00:00.000Z",
      "to": "2020-08-07T14:30:00.000Z"
    },
    {
      "from": "2020-08-07T14:30:00.000Z",
      "to": "2020-08-07T15:00:00.000Z"
    },
    {
      "from": "2020-08-07T16:30:00.000Z",
      "to": "2020-08-07T17:00:00.000Z"
    },
    {
      "from": "2020-08-07T17:00:00.000Z",
      "to": "2020-08-07T17:30:00.000Z"
    }
  ]
}
````

