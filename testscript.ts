import * as fs from 'fs';
import * as resemble from 'resemblejs';
import * as sharp from 'sharp';

async function compareMangaCoverToErrorImages(
  onlineImage: Buffer,
): Promise<boolean> {
  const localImagesNames: string[] = fs.readdirSync('./resources/error_images');
  const localImages: Buffer[] = localImagesNames.map((image) =>
    Buffer.from(fs.readFileSync(`./resources/error_images/${image}`)),
  );

  let isMangaCoverEqualToErrorImage = false;

  const comparisons = localImages.map(
    (image) =>
      new Promise<void>((resolve) => {
        resemble(image)
          .compareTo(onlineImage)
          .ignoreColors()
          .onComplete((data) => {
            if (Math.floor(data.rawMisMatchPercentage) < 10) {
              isMangaCoverEqualToErrorImage = true;
            }
            resolve();
          });
      }),
  );
  await Promise.all(comparisons);

  return isMangaCoverEqualToErrorImage;
}

async function imageHasColors(onlineImage: Buffer): Promise<boolean> {
  const imageGrayScale = await sharp(onlineImage).grayscale().toBuffer();

  return new Promise((resolve) => {
    resemble(onlineImage)
      .compareTo(imageGrayScale)
      .ignoreColors()
      .onComplete((data) => {
        console.log(data);
        if (data.isSameDimensions && data.rawMisMatchPercentage === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
  });
}

async function createBufferFromOnlineImage(imageUrl: string): Promise<Buffer> {
  const onlineImage = await fetch(imageUrl);
  const imageBuffer = await onlineImage.arrayBuffer();

  return Buffer.from(imageBuffer);
}

async function main() {
  const image = await createBufferFromOnlineImage(
    'https://img.novelcool.com/logo/202206/54/Me_Wo_Mite_Hanase1892.jpg',
  );
  console.log(await imageHasColors(image));
}

main();
