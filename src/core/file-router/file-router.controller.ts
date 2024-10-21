import {
  Body,
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class FileDeleteDto {
  @ApiProperty()
  @IsString()
  filename: string;
}

@Injectable()
@Controller('file-router')
@ApiTags('File Router')
export class FileRouterController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // comment: { type: 'string' },
        // outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }

  @Post('delete')
  async deleteBookCover(@Body() body: FileDeleteDto) {
    await this.minioService.deleteFile(body.filename);
    return body.filename;
  }
}
