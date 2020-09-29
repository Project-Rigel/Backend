import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import moment = require('moment');

export function IsHourInHHmmFormat(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsHourInHHmmFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: 'The given interval doesn\'t have a valid format. The value must comform HH:mm where the hour is between 00 and 23 and minutes between 00 and 59.',
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && moment(value, 'HH:mm').isValid();
        },
      },
    });
  };
}
