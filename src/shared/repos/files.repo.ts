import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';

@Injectable()
export class FilesRepo extends BaseRepo<any> {
  constructor() {
    super('files');
  }
}
