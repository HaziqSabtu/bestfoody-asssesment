import status from 'http-status';
import { HttpException } from '@nestjs/common';

export class UserAlreadyReviewedException extends HttpException {
  constructor() {
    super('User has already reviewed this restaurant', status.CONFLICT);
  }
}
