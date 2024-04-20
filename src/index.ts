import BaseClient from '@/BaseClient';

export { Characters, CharacterIDs, Resources, Stats, Languages, Properties, Paths } from '@/enum';

export { AchievementsClient } from '@clients/AchievementsClient';
export { AvatarsClient } from '@clients/AvatarsClient';
export { CharacterPromotionsClient } from '@clients/CharacterPromotionsClient';
export { CharacterRanksClient } from '@clients/CharacterRanksClient';
export { CharactersClient } from '@clients/CharactersClient';
export { CharacterSkillsClient } from '@clients/CharacterSkillsClient';
export { CharacterSkillTreesClient } from '@clients/CharacterSkillTreesClient';
export { ItemsClient } from '@clients/ItemsClient';

export type {
  Achievement,
  Avatar,
  CharacterPromotion,
  CharacterPromotionStat,
  CharacterPromotionMaterial,
  CharacterRank,
  CharacterRankMaterial,
  CharacterRankLevelUpSkill,
  CharacterSkill,
  CharacterSkillTree,
  CharacterSkillTreeLevelUpSkill,
  CharacterSkillTreeLevel,
  CharacterSkillTreeLevelProperty,
  CharacterSkillTreeLevelMaterial,
  Character,
  Description,
  Element,
  Item,
  LightConePromotions,
  LightConePromotionStat,
  LightConePromotionMaterial,
  LightConeRank,
  LightConeRankProperty,
  LightCone,
  Nickname,
  Path,
  Property,
  RelicMainAffix,
  RelicMainAffixesAffix,
  RelicSet,
  RelicSetProperty,
  RelicSubAffix,
  RelicSubAffixesAffix,
  Relic,
  SimulatedBlessing,
  SimulatedBlock,
  SimulatedCurio,
  SimulatedEvent,
} from './types';

export default BaseClient;
