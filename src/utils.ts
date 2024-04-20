import { IMAGE_PREFIX, ICON_PREFIX, ASSET_URL } from '@/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateImagePaths = (obj: any, baseUrl: string = ASSET_URL): void => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursive call for nested objects
      updateImagePaths(obj[key], baseUrl);
    } else if (typeof obj[key] === 'string') {
      if (obj[key].startsWith(ICON_PREFIX) || obj[key].startsWith(IMAGE_PREFIX)) {
        obj[key] = `${baseUrl}/${obj[key]}`;
      }
    }
  });
};

export default {
  updateImagePaths,
};
