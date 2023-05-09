import S3 from 'aws-sdk/clients/s3.js';
import sharp from 'sharp';

const s3 = new S3({
  region: 'ap-northeast-2'
});

export const handler = async (event, context, done) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key).replace(/(\s)/g, '+');
  const foldername = Key.split('/').shift();
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('folder: ', foldername, ' filename: ', filename, ' ext: ', ext);

  try {
    const newKey = `thumbnail-${foldername}/${filename}`;
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    const resizedImage = foldername === 'avatar'
      ? await sharp(s3Object.Body).resize(96, 96, { fit: 'cover' }).toFormat(requiredFormat).toBuffer()
      : await sharp(s3Object.Body).resize(360, 180, { fit: 'cover' }).toFormat(requiredFormat).toBuffer();

    await s3.putObject({
      Bucket,
      Key: newKey,
      Body: resizedImage,
      ContentType: `image/${ext}`
    }).promise();

    console.log('Successfully uploaded in ', newKey);

    return done(null, newKey);
  } catch (error) {
    return done(error);
  }
};