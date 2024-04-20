import { IMAGE_PREFIX, ICON_PREFIX, ASSET_URL } from '@/constants';
import { CharacterIDs, Characters } from './enum';

export const CharacterToIDs: Record<string, string> = {
  [Characters.March7th]: CharacterIDs.March7th,
  [Characters.Kafka]: Characters.Kafka,
  [Characters.SilverWolf]: Characters.SilverWolf,
  [Characters.Arlan]: Characters.Arlan,
  [Characters.Asta]: Characters.Asta,
  [Characters.Herta]: Characters.Herta,
  [Characters.Bronya]: Characters.Bronya,
  [Characters.Seele]: Characters.Seele,
  [Characters.Serval]: Characters.Serval,
  [Characters.Gepard]: Characters.Gepard,
  [Characters.Natasha]: Characters.Natasha,
  [Characters.Pela]: Characters.Pela,
  [Characters.Clara]: Characters.Clara,
  [Characters.Sampo]: Characters.Sampo,
  [Characters.Hook]: Characters.Hook,
  [Characters.Lynx]: Characters.Lynx,
  [Characters.Luka]: Characters.Luka,
  [Characters.TopazAndNumby]: Characters.TopazAndNumby,
  [Characters.Qingque]: Characters.Qingque,
  [Characters.Tingyun]: Characters.Tingyun,
  [Characters.Luocha]: Characters.Luocha,
  [Characters.JingYuan]: Characters.JingYuan,
  [Characters.Blade]: Characters.Blade,
  [Characters.Sushang]: Characters.Sushang,
  [Characters.Yukong]: Characters.Yukong,
  [Characters.FuXuan]: Characters.FuXuan,
  [Characters.Yanqing]: Characters.Yanqing,
  [Characters.Guinaifen]: Characters.Guinaifen,
  [Characters.Bailu]: Characters.Bailu,
  [Characters.Jingliu]: Characters.Jingliu,
  [Characters.DanHengImbibitorLunae]: Characters.DanHengImbibitorLunae,
  [Characters.Xueyi]: Characters.Xueyi,
  [Characters.Hanya]: Characters.Hanya,
  [Characters.HuoHuo]: Characters.HuoHuo,
  [Characters.Gallagher]: Characters.Gallagher,
  [Characters.Argenti]: Characters.Argenti,
  [Characters.RuanMei]: Characters.RuanMei,
  [Characters.Aventurine]: Characters.Aventurine,
  [Characters.DrRatio]: Characters.DrRatio,
  [Characters.Sparkle]: Characters.Sparkle,
  [Characters.BlackSwan]: Characters.BlackSwan,
  [Characters.Acheron]: Characters.Acheron,
  [Characters.Misha]: Characters.Misha,
  [Characters.PlayerBoyDestruction]: Characters.PlayerBoyDestruction,
  [Characters.PlayerGirlDestruction]: Characters.PlayerGirlDestruction,
  [Characters.PlayerBoyPreservation]: Characters.PlayerBoyPreservation,
  [Characters.PlayerGirlPreservation]: Characters.PlayerGirlPreservation,
};

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
