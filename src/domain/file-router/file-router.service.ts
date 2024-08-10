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

      const filename = ObjectID().toHexString();

      const originalBuffer = Buffer.from(buffer);
      const avifBuffer = await this.compressAndConvertToAvif(originalBuffer);
      const smallSizeBuffer = await this.compressToSmallSize(originalBuffer);

      // const originalCommand = new PutObjectCommand({
      //   Body: originalBuffer, // The actual file content
      //   Bucket: BUCKET_NAME,
      //   Key: `${filename}/original-image`, // The name of the file
      //   ContentType: mimetype,
      // });

      const avifCommand = new PutObjectCommand({
        Body: avifBuffer, // The actual file content
        Bucket: BUCKET_NAME,
        Key: `${filename}/avif-image`, // The name of the file
        ContentType: mimetype,
      });

      const smallSizeCommand = new PutObjectCommand({
        Body: smallSizeBuffer, // The actual file content
        Bucket: BUCKET_NAME,
        Key: `${filename}/small-image`, // The name of the file
        ContentType: mimetype,
      });

      await Promise.all([
        // s3.send(originalCommand),
        s3.send(avifCommand),
        s3.send(smallSizeCommand),
      ]);

      return {
        sucess: true,
        file_id: filename,
        // original_image: `https://eu2.contabostorage.com/a4fb51113a804943ad9b818ac4809297:${'images'}/${filename}/original-image`,
        avif_image: `https://eu2.contabostorage.com/a4fb51113a804943ad9b818ac4809297:${'images'}/${filename}/avif-image`,
        small_image: `https://eu2.contabostorage.com/a4fb51113a804943ad9b818ac4809297:${'images'}/${filename}/small-image`,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error);
    }
  }

  async compressAndConvertToAvif(imageBuffer: Buffer) {
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

  async compressToSmallSize(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .png({ compressionLevel: 9 })
        .resize({ height: 50, width: 30 }) // Adjust quality as needed
        .toBuffer();
      console.log(
        'Image successfully compressed and converted to SMALL format',
      );
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
