---
title: Get Available Intervals Function Doc
nav_order: 2
---

#Nombre del Callable
**getAvaliableDaysInMonth**

[Try the function here](https://europe-west1-rigel-admin.cloudfunctions.net/getAvaliableDaysInMonth)

# Dto de entrada
```ts
export class GetAvailableDaysDto {
  @IsInt()
  @Min(0)
  @Max(11)
  month!: number;

  @IsString()
  agendaId!: string;

  @IsString()
  businessId!: string;

  @IsString()
  productId!: string;
}
```

Ejemplo:
```json
{
	"data": {
		"month": 7,
		"agendaId": "AZNVcZzTz5F9yLkxx96h",
		"businessId": "123456789arturo",
		"productId": "A433SpwXXCWg67ZLiezC"
	}
}
```

# Respuesta

```ts
export class ResponseDto {
  result: {
            day: number,
            dayDisplayName: string,
            openDays: number[],
            isDayOfWeek: boolean
  }[]
}
```

Ejemplo:

````json
{
  "result": [
    {
      "day": 0,
      "dayDisplayName": "Sunday",
      "openDays": [7, 14, 21, 28],
      "isDayOfWeek": true
    },
    {
      "day": 2,
      "dayDisplayName": "Tuesday",
      "openDays": [14],
      "isDayOfWeek": true
    },
    {
      "day": 4,
      "dayDisplayName": "Thursday",
      "openDays": [7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 28, 29, 30],
      "isDayOfWeek": true
    }      
]
}
````
