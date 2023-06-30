import { DeleteHttpResponse } from '../common';

export class DeleteMangaFromCollectionHttpResponse extends DeleteHttpResponse {
  status: string;
  message: string;

  constructor(status: string, message: string) {
    super(status, message);
  }
}
