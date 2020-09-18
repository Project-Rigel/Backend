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
      "from": "11:00",
      "to": "11:30"
    },
    {
      "from": "14:00",
      "to": "14:30"
    },
    {
      "from": "14:30",
      "to": "15:00"
    },
    {
      "from": "16:30",
      "to": "17:00"
    },
    {
      "from": "17:00",
      "to": "17:30"
    }
  ]
}
````

