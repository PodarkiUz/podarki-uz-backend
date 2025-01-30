import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ObjectID from 'bson-objectid';
import * as Minio from 'minio';
import * as sharp from 'sharp';
import * as convert from 'heic-convert';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: '37.60.231.13',
      port: 9000,
      useSSL: false,
      accessKey: 'minio-storage',
      secretKey: 'a3KfbndX0yoBWA6t',
    });
    this.bucketName = 'files';
  }

  async createBucketIfNotExists(bucketName: string) {
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName, 'eu-west-1');
    }
  }

  async categoryImageUpload(file: Express.Multer.File) {
    await this.createBucketIfNotExists(this.bucketName);

    if (file.mimetype === 'image/heic') {
      file.buffer = await this.convertToJpeg(file.buffer);
      file.mimetype = 'image/jpeg';
    }

    const fileName = ObjectID().toHexString();
    const originalFileName = `${fileName}.webp`;

    const bufferOriginalWebp = await this.compressToOriginalWebp(file.buffer);

    await this.minioClient.putObject(
      this.bucketName,
      originalFileName,
      bufferOriginalWebp,
      file.size,
    );

    return { url: originalFileName };
  }

  async simpleUpload(file: Express.Multer.File) {
    await this.createBucketIfNotExists('travelapp');

    const fileName = ObjectID().toHexString();

    await this.minioClient.putObject(
      'travelapp',
      fileName,
      file.buffer,
      file.size,
    );

    return { url: fileName };
  }

  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists(this.bucketName);

    let bufferJpeg;
    if (file.mimetype === 'image/heic') {
      bufferJpeg = await this.convertToJpeg(file.buffer);
      file.buffer = bufferJpeg;
      file.mimetype = 'image/jpeg';
    }

    const fileName = ObjectID().toHexString();
    // const bufferOriginalWebp = await this.compressToOriginalWebp(file.buffer);
    const bufferOriginalWebp = file.buffer;
    const buffer360 = await this.compressTo360(file.buffer);
    const buffer768 = await this.compressTo768(file.buffer);
    const buffer1920 = await this.compressTo1920(file.buffer);

    const originalFileName = `${fileName}-original.jpeg`;
    const originalFile = this.minioClient.putObject(
      this.bucketName,
      originalFileName,
      bufferOriginalWebp,
      bufferOriginalWebp.length,
    );

    const file360Name = `${fileName}-360w.webp`;
    const file360 = this.minioClient.putObject(
      this.bucketName,
      file360Name,
      buffer360,
      buffer360.length,
    );

    const file768Name = `${fileName}-768w.webp`;
    const file768 = this.minioClient.putObject(
      this.bucketName,
      file768Name,
      buffer768,
      buffer768.length,
    );

    const file1920Name = `${fileName}-1920w.webp`;
    const file1920 = this.minioClient.putObject(
      this.bucketName,
      file1920Name,
      buffer1920,
      buffer1920.length,
    );

    await Promise.all([originalFile, file360, file768, file1920]);
    // `http://37.60.231.13:9000/${this.bucketName}/${originalFileName}`
    const imageOriginal = originalFileName;
    const image360 = file360Name;
    const image768 = file768Name;
    const image1920 = file1920Name;

    return { imageOriginal, image360, image768, image1920 };
  }

  async deleteFile(fileName: string, bucketName?: string) {
    await this.minioClient.removeObject(
      bucketName || this.bucketName,
      fileName,
    );
  }

  private async compressToOriginalWebp(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toBuffer();
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async convertToJpeg(imageBuffer: Buffer) {
    try {
      const jpegBuffer = await convert({
        buffer: imageBuffer, // the HEIC file buffer
        format: 'JPEG', // output format
        quality: 1, // quality scale from 0 to 1
      });
      return jpegBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async compressTo768(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Calculate new dimensions based on aspect ratio
      const targetWidth = 768;
      const aspectRatio = metadata.width / metadata.height;
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const resizedBuffer = await image
        .resize({
          width: targetWidth,
          height: targetHeight, // Maintain aspect ratio
          fit: 'inside', // Ensures the image fits within the box
        })
        .webp({ quality: 100, effort: 6 })
        .toBuffer();

      return resizedBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async compressTo360(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Calculate new dimensions based on aspect ratio
      const targetWidth = 360;
      const aspectRatio = metadata.width / metadata.height;
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const resizedBuffer = await image
        .resize({
          width: targetWidth,
          height: targetHeight, // Maintain aspect ratio
          fit: 'inside', // Ensures the image fits within the box
        })
        .webp({ quality: 100, effort: 6 })
        .toBuffer();

      return resizedBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async compressTo1920(imageBuffer: Buffer) {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Calculate new dimensions based on aspect ratio
      const targetWidth = 1920;
      const aspectRatio = metadata.width / metadata.height;
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const resizedBuffer = await image
        .resize({
          width: targetWidth,
          height: targetHeight, // Maintain aspect ratio
          fit: 'inside', // Ensures the image fits within the box
        })
        .webp({ quality: 100, effort: 6 })
        .toBuffer();

      return resizedBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async compressToJpeg(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async removeBackground(imageBuffer: Buffer) {
    try {
      const buffer = await sharp(imageBuffer)
        .removeAlpha()
        .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();
      return buffer;
    } catch (error) {
      console.error('Error removing background and converting image:', error);
      throw error;
    }
  }
}
