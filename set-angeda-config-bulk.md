---
title: Set one or various config in a specific agenda
nav_order: 4
---

#Nombre del Callable
**setAgendaConfigBulk**

[Try the function here](https://europe-west1-rigel-admin.cloudfunctions.net/setAgendaConfigBulk)

# Dto de entrada
```ts
export class SetAgendaConfigBulkDto {

  /*
   * The agendas to apply the config to
   */
  @IsString()
  public readonly agendaId!: string;

  /*
   * The businessId of the user
   */
  @IsString()
  public readonly businessId!: string;

  /**
   * An array configs supplied for the agenda
   */
  @ValidateNested({ each: true })
  @Type(() => AgendaConfigDto)
  public readonly configs!: AgendaConfigDto[];

}


export class AgendaConfigDto {

  /**
   * The day of week for specifying intervals. If you specify a day of week you cant use a specific date.
   */
  @IsEnum(DayOfWeek)
  @IsOptional()
  public readonly dayOfWeek?: string;

  /**
   * The date in which the config becomes useless
   */
  @IsDateString()
  @IsOptional()
  public readonly expirationDate?: string;

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
		"businessId": "Gx1BSivr7hyCo53lZluW",
		"agendaId": "1PzX073aYctay0PH7W7W",
		"configs": [
			{
				"dayOfWeek": "Monday",
				"specificDate": null,
				"expirationDate": "2020-10-08T15:47:01.569Z",
				"intervals": [
					{
						"startHour": "08:00",
						"endHour": "08:00"
					},
					{
						"startHour": "14:00",
						"endHour": "14:00"
					}
				]
			},
			{
				"dayOfWeek": "Tuesday",
				"specificDate": null,
				"expirationDate": "2020-10-08T15:47:01.569Z",
				"intervals": [
					{
						"startHour": "08:00",
						"endHour": "08:00"
					},
					{
						"startHour": "14:00",
						"endHour": "14:00"
					}
				]
			},
			   {
        "expirationDate": null,
        "specificDate": "2020-10-06T13:00:00.000Z",
        "dayOfWeek": null,
        "intervals": [
          {
            "endHour": "21:00",
            "startHour": "13:00"
          }
        ]
      },
						   {
        "expirationDate": null,
        "specificDate": "2020-10-07T13:00:00.000Z",
        "dayOfWeek": null,
        "intervals": [
          {
            "endHour": "21:00",
            "startHour": "13:00"
          }
        ]
      }
		]
	}
}
```

# Respuesta

```ts
export class SetAgendaConfigResponse {
  @IsString()
  agendaId!: string;

  @IsString()
  businessId!: string;

  @ValidateNested({ each: true })
  config!: GetAgendaConfigResponse[];
}

```

Ejemplo:

````json
{
  "result": {
    "agendaId": "1PzX073aYctay0PH7W7W",
    "businessId": "Gx1BSivr7hyCo53lZluW",
    "config": [
      {
        "expirationDate": null,
        "specificDate": "2020-10-06T13:00:00.000Z",
        "dayOfWeek": null,
        "intervals": [
          {
            "startHour": "13:00",
            "endHour": "21:00"
          }
        ]
      },
      {
        "expirationDate": "2020-12-06T20:50:28.264Z",
        "specificDate": null,
        "dayOfWeek": 2,
        "intervals": [
          {
            "startHour": "08:00",
            "endHour": "08:00"
          },
          {
            "startHour": "14:00",
            "endHour": "14:00"
          }
        ]
      },
      {
        "expirationDate": "2020-12-06T20:50:28.139Z",
        "specificDate": null,
        "dayOfWeek": 1,
        "intervals": [
          {
            "startHour": "08:00",
            "endHour": "08:00"
          },
          {
            "startHour": "14:00",
            "endHour": "14:00"
          }
        ]
      },
      {
        "expirationDate": null,
        "specificDate": "2020-10-07T13:00:00.000Z",
        "dayOfWeek": null,
        "intervals": [
          {
            "startHour": "13:00",
            "endHour": "21:00"
          }
        ]
      }
    ]
  }
}
````
