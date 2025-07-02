import {
  Body,
  Controller,
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
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
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5242880 })], // 5 MB
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.minioService.uploadFile(file);
  }

  @Post('upload-category-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCategoryImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5242880 })], // 5MB
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.minioService.categoryImageUpload(file);
  }

  @Post('simple-upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async simpleUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5242880 })], // 5MB
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.minioService.simpleUpload(file);
  }

  @Post('delete')
  async deleteFile(@Body() body: FileDeleteDto) {
    await this.minioService.deleteFile(body.filename);
    return body.filename;
  }

  @Post('delete-travel')
  async deleteTravelFile(@Body() body: FileDeleteDto) {
    return this.minioService.deleteFile(body.filename, 'travelapp');
  }
}
