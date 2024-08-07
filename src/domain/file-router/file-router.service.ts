import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import ObjectID from 'bson-objectid';
import * as sharp from 'sharp';
import { s3 } from 'src/providers/file-upload';

@Injectable()
export class FileRouterService {
  async upload(file) {
    try {
      const {
        // originalname,
        mimetype,
        // size,
        buffer,
      } = file;
      const BUCKET_NAME = 'images'; // Replace with your bucket name

      const fileContent = Buffer.from(buffer);

      const avifBuffer = await this.compressAndConvertToAvif(fileContent);

      const filename = ObjectID().toHexString();

      const command = new PutObjectCommand({
        Body: avifBuffer, // The actual file content
        Bucket: BUCKET_NAME,
        Key: filename, // The name of the file
        ContentType: mimetype,
      });

      await s3.send(command);

      return {
        sucess: true,
        file_id: filename,
        file_url: `https://eu2.contabostorage.com/a4fb51113a804943ad9b818ac4809297:${'images'}/${filename}`,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error);
    }
  }

  async compressAndConvertToAvif(imageBuffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .avif({ quality: 50 }) // Adjust quality as needed
        .toBuffer();
      console.log('Image successfully compressed and converted to AVIF format');
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  // async download(file_id: string) {
  //   const params = {
  //     Bucket: 'files',
  //     Key: file_id,
  //   };

  //   const data = s3
  //     .getObject(params, (err, data) => {
  //       if (err) {
  //         console.error('Error downloading file:', err);
  //       } else {
  //         // Save the downloaded file to the local file system
  //         return data.Body;
  //       }
  //     })
  //     .promise();

  //   return await data;
  // }
}
