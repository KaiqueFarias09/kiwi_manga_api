import { DeleteHttpResponse } from '../common';

export class DeleteCollectionHttpResponse extends DeleteHttpResponse {
  status: string;
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
