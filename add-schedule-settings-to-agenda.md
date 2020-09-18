---
title: Get Available Intervals Function Doc
nav_order: 3
---

#Nombre del Callable
**setAgendaScheduleSettings**

[Try the function here](https://europe-west1-rigel-admin.cloudfunctions.net/setAgendaScheduleSettings)

# Dto de entrada
```ts
export class AddScheduleSettingsDto {
  /**
   * The id of the agenda you want to configure.
   */
  @IsString()
  public readonly agendaId!: string;

  /**
   * The business of the agenda
   */
  @IsString()
  public readonly businessId!: string;

  /**
   * The day of week for specifying intervals. If you specify a day of week you cant use a specific date.
   */
  @IsEnum(DayOfWeek)
  @IsOptional()
  public readonly dayOfWeek?: string;

  /**
   * Specific date for intervals. This field lets you specify a certain date for overwriting the default behaviour.
   */
  @IsDateString()
  @IsOptional()
  public readonly specificDate?: string;

  /**
   * An array of intervals describing the available appointment times.
   */
  @ValidateNested({ each: true })
  @Type(() => IntervalDto)
  public readonly intervals: IntervalDto[];
}
```

Ejemplo:
```json
{
	"data": {
        "agendaId": "AZNVcZzTz5F9yLkxx96h",
        "businessId": "123456789arturo",
		"dayOfWeek": 7,
		"specificDate": "",		
		"intervals": [
		  {
		    "startHour": "9:00",
            "endHour": "13:00"
          },
          {
            "startHour": "15:00",
            "endHour": "20:00"
          },
          {
        
          }
        ] 
	}
}
```

# Respuesta

```ts
export class ResponseDto {
  result: string
}
```

Ejemplo:

````json
{
  "result": "Ok"
}
````
