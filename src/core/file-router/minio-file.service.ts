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

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async categoryImageUpload(file: Express.Multer.File) {
    await this.createBucketIfNotExists();

    if (file.mimetype === 'image/heic') {
      file.buffer = await this.convertHeicToJpeg(file.buffer);
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

  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists();

    if (file.mimetype === 'image/heic') {
      file.buffer = await this.convertHeicToJpeg(file.buffer);
      file.mimetype = 'image/jpeg';
    }

    const fileName = ObjectID().toHexString();
    const bufferOriginalWebp = await this.compressToOriginalWebp(file.buffer);
    const buffer64x64 = await this.compressTo64x64(file.buffer);
    const buffer256x256 = await this.compressTo256x256(file.buffer);

    const originalFileName = `${fileName}.webp`;
    const originalFile = this.minioClient.putObject(
      this.bucketName,
      originalFileName,
      bufferOriginalWebp,
      bufferOriginalWebp.length,
    );

    const file64x64Name = `${fileName}-64x64.webp`;
    const file64x64 = this.minioClient.putObject(
      this.bucketName,
      file64x64Name,
      buffer64x64,
      buffer64x64.length,
    );

    const file256x256Name = `${fileName}-256x256.webp`;
    const file256x256 = this.minioClient.putObject(
      this.bucketName,
      file256x256Name,
      buffer256x256,
      buffer256x256.length,
    );

    await Promise.all([originalFile, file64x64, file256x256]);
    // `http://37.60.231.13:9000/${this.bucketName}/${originalFileName}`
    const imageOriginal = originalFileName;
    const image64x64 = file64x64Name;
    const image256x256 = file256x256Name;

    return { imageOriginal, image256x256, image64x64 };
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  private async compressToOriginalWebp(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer).webp().toBuffer();
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async convertHeicToJpeg(imageBuffer: Buffer) {
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

  private async compressTo64x64(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .webp({ quality: 50 })
        .resize({ width: 64, height: 64 })
        .toBuffer();
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }

  private async compressTo256x256(imageBuffer: Buffer) {
    try {
      const avifBuffer = await sharp(imageBuffer)
        .webp()
        .resize({ height: 256, width: 256 }) // Adjust quality as needed
        .toBuffer();
      return avifBuffer;
    } catch (error) {
      console.error('Error compressing and converting image:', error);
      throw error;
    }
  }
}
