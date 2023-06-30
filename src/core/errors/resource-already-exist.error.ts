import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export class ResourceAlreadyExistException extends HttpException {
  constructor() {
    super('This resource already exists', HttpStatusCode.Conflict);
  }
}
