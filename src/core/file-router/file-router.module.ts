import { Module } from '@nestjs/common';
import { MinioService } from './minio-file.service';
import { FileRouterController } from './file-router.controller';

@Module({
  controllers: [FileRouterController],
  providers: [MinioService],
})
export class FileRouterModule {}
