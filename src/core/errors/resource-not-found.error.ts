import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export class ResourceNotFoundException extends HttpException {
  constructor() {
    super('The resource was not found', HttpStatusCode.NotFound);
  }
}
