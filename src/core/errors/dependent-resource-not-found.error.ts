import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export class DependentResourceNotFoundException extends HttpException {
  constructor() {
    super(
      "This resource's existence relies on a non-existing resource",
      HttpStatusCode.NotFound,
    );
  }
}
