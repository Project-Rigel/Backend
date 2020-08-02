import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export async function validateDto<T>(type: Type<T>, obj: any) {
  const dto: T = plainToClass(type, obj);
  const errors = await validate(dto);
  return { dto, errors };
}
