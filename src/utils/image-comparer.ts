import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as resemble from 'resemblejs';
import * as sharp from 'sharp';

@Injectable()
export class ImageComparer {
  async isImageValid(url: string): Promise<boolean> {
    const image = await this.createBufferFromOnlineImage(url);
    return this.imageHasColors(image) && this.isErrorImage(image);
  }

  private async isErrorImage(onlineImage: Buffer): Promise<boolean> {
    const localImagesNames: string[] = fs.readdirSync(
      './resources/error_images',
    );
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

  private async imageHasColors(onlineImage: Buffer): Promise<boolean> {
    const imageGrayScale = await sharp(onlineImage).grayscale().toBuffer();

    return new Promise((resolve) => {
      resemble(onlineImage)
        .compareTo(imageGrayScale)
        .ignoreColors()
        .onComplete((data) => {
          console.log(data);
          if (data.isSameDimensions && data.rawMisMatchPercentage <= 5) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
    });
  }

  private async createBufferFromOnlineImage(imageUrl: string): Promise<Buffer> {
    const onlineImage = await fetch(imageUrl);
    const imageBuffer = await onlineImage.arrayBuffer();

    return Buffer.from(imageBuffer);
  }
}
