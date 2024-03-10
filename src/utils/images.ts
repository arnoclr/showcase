export enum ImageSizePreset {
  ThreePhonesOrTablet,
  SinglePhone,
  TabletAndPhone,
}

export function getImageSize(preset: ImageSizePreset): string {
  switch (preset) {
    case ImageSizePreset.ThreePhonesOrTablet:
      return "width: 60%; height: auto;";
    case ImageSizePreset.SinglePhone:
      return "width: auto; height: 80vh;";
    case ImageSizePreset.TabletAndPhone:
      return "width: 100%; height: auto;";
  }
}
