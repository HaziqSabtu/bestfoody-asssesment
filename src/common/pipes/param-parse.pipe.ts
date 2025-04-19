import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParamParsePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
