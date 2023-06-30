import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export class ResourceDoesNotExistException extends HttpException {
  constructor() {
    super('This resource does not exist', HttpStatusCode.NotFound);
  }
}
