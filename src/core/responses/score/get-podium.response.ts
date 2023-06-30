import { PodiumEntity } from '../../entities';
import { DefaultHttpResponse } from '../common';

export class GetPodiumHttpResponse extends DefaultHttpResponse<PodiumEntity> {
  status: string;
  data: PodiumEntity;

  constructor(status: string, data: PodiumEntity) {
    super(status, data);
  }
}
