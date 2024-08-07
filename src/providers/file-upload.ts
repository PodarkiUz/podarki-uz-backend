import { S3 } from '@aws-sdk/client-s3';
// import * as AWS from 'aws-sdk';

// export const s3 = new S3Client({
//   endpoint: `https://usc1.contabostorage.com/files`, // e.g. https://eu2.contabostorage.com/bucketname
//   credentials: {
//     accessKeyId: 'd5506460ccc5b86f32fe11c61409c99f',
//     secretAccessKey: '2d38a658ab6d3a607449d3474ee0d1c0',
//     // s3BucketEndpoint: true,
//   },
// });

const REGION = 'eu2'; // Replace with your region
const ACCESS_KEY_ID = 'cb6f6b5bab42d2feac23720d9bad6d5a'; // Replace with your access key
const SECRET_ACCESS_KEY = '34360a96e0812e9b8ccf9b0674069385'; // Replace with your secret key
const ENDPOINT = 'https://eu2.contabostorage.com'; // Contabo endpoint

export const s3 = new S3({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  endpoint: ENDPOINT,
  forcePathStyle: true,

  
});
