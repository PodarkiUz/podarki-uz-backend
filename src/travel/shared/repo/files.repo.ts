import { BaseRepo } from '@shared/providers/base-dao';
import { Injectable } from '@nestjs/common';
import { FilesEntity } from './entity';

@Injectable()
export class FilesRepo extends BaseRepo<FilesEntity> {
  constructor() {
    super('files');
  }
}
