import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUuid, types, uuid } from '@quocanhbk17/express-cassandra';

@Injectable()
export class ParseUuidPipe implements PipeTransform<any, types.Uuid> {
  transform(value: any, { metatype }: ArgumentMetadata): types.Uuid {
    if (value && isUuid(value)) {
      return value;
    }
    try {
      value = uuid(value);
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
    return value;
  }
}
