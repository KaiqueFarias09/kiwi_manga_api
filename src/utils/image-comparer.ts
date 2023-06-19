import { Injectable } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as fs from 'fs';
import * as resemble from 'resemblejs';
import * as sharp from 'sharp';

axiosRetry(axios, { retries: 3 });

@Injectable()
export class ImageComparer {
  async isImageValid(url: string): Promise<boolean> {
    const image = await this.createBufferFromOnlineImage(url);
    const [doesImageHasColors, isErrorImage] = await Promise.all([
      this.imageHasColors(image),
      this.isErrorImage(image),
    ]);
    return doesImageHasColors && !isErrorImage;
  }

  async isErrorImage(onlineImage: Buffer): Promise<boolean> {
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
        .onComplete((data) => {
          if (
            data.isSameDimensions &&
            Math.round(data.rawMisMatchPercentage) <= 10
          ) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
    });
  }

  async createBufferFromOnlineImage(imageUrl: string): Promise<Buffer> {
    const onlineImage = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = onlineImage.data;
    return Buffer.from(imageBuffer);
  }
}
