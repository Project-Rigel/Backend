import { IdGenerator } from '../../src/shared/uid-generator';

export class TestIdGenerator implements IdGenerator {
  generate(): string {
    return '1';
  }
}
