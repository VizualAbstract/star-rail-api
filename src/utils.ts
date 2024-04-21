import { IMAGE_PREFIX, ICON_PREFIX, ASSET_URL } from '@/constants';
import { CharacterIDs, Characters } from './enum';

export const CharacterToIDs: Record<string, string> = {
  [Characters.March7th]: CharacterIDs.March7th,
  [Characters.Kafka]: CharacterIDs.Kafka,
  [Characters.SilverWolf]: CharacterIDs.SilverWolf,
  [Characters.Arlan]: CharacterIDs.Arlan,
  [Characters.Asta]: CharacterIDs.Asta,
  [Characters.Herta]: CharacterIDs.Herta,
  [Characters.Bronya]: CharacterIDs.Bronya,
  [Characters.Seele]: CharacterIDs.Seele,
  [Characters.Serval]: CharacterIDs.Serval,
  [Characters.Gepard]: CharacterIDs.Gepard,
  [Characters.Natasha]: CharacterIDs.Natasha,
  [Characters.Pela]: CharacterIDs.Pela,
  [Characters.Clara]: CharacterIDs.Clara,
  [Characters.Sampo]: CharacterIDs.Sampo,
  [Characters.Hook]: CharacterIDs.Hook,
  [Characters.Lynx]: CharacterIDs.Lynx,
  [Characters.Luka]: CharacterIDs.Luka,
  [Characters.TopazAndNumby]: CharacterIDs.TopazAndNumby,
  [Characters.Qingque]: CharacterIDs.Qingque,
  [Characters.Tingyun]: CharacterIDs.Tingyun,
  [Characters.Luocha]: CharacterIDs.Luocha,
  [Characters.JingYuan]: CharacterIDs.JingYuan,
  [Characters.Blade]: CharacterIDs.Blade,
  [Characters.Sushang]: CharacterIDs.Sushang,
  [Characters.Yukong]: CharacterIDs.Yukong,
  [Characters.FuXuan]: CharacterIDs.FuXuan,
  [Characters.Yanqing]: CharacterIDs.Yanqing,
  [Characters.Guinaifen]: CharacterIDs.Guinaifen,
  [Characters.Bailu]: CharacterIDs.Bailu,
  [Characters.Jingliu]: CharacterIDs.Jingliu,
  [Characters.DanHengImbibitorLunae]: CharacterIDs.DanHengImbibitorLunae,
  [Characters.Xueyi]: CharacterIDs.Xueyi,
  [Characters.Hanya]: CharacterIDs.Hanya,
  [Characters.HuoHuo]: CharacterIDs.HuoHuo,
  [Characters.Gallagher]: CharacterIDs.Gallagher,
  [Characters.Argenti]: CharacterIDs.Argenti,
  [Characters.RuanMei]: CharacterIDs.RuanMei,
  [Characters.Aventurine]: CharacterIDs.Aventurine,
  [Characters.DrRatio]: CharacterIDs.DrRatio,
  [Characters.Sparkle]: CharacterIDs.Sparkle,
  [Characters.BlackSwan]: CharacterIDs.BlackSwan,
  [Characters.Acheron]: CharacterIDs.Acheron,
  [Characters.Misha]: CharacterIDs.Misha,
  [Characters.PlayerBoyDestruction]: CharacterIDs.PlayerBoyDestruction,
  [Characters.PlayerGirlDestruction]: CharacterIDs.PlayerGirlDestruction,
  [Characters.PlayerBoyPreservation]: CharacterIDs.PlayerBoyPreservation,
  [Characters.PlayerGirlPreservation]: CharacterIDs.PlayerGirlPreservation,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateImagePaths = (arr: any[], baseUrl: string = ASSET_URL): void => {
  arr.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursive call for nested objects or arrays
        Array.isArray(obj[key])
          ? updateImagePaths(obj[key], baseUrl)
          : updateImagePaths([obj[key]], baseUrl);
      } else if (typeof obj[key] === 'string') {
        if (obj[key].startsWith(ICON_PREFIX) || obj[key].startsWith(IMAGE_PREFIX)) {
          obj[key] = `${baseUrl}/${obj[key]}`;
        }
      }
    });
  });
};

export default {
  updateImagePaths,
};
