import QueryBuilder from '@/QueryBuilder';

export { Characters, CharacterIDs, Resources, Stats, Languages, Properties, Paths } from '@/enum';

export { AchievementQuery } from '@/builders/AchievementQuery';
export { AvatarQuery } from '@/builders/AvatarQuery';
export { CharacterPromotionQuery } from '@/builders/CharacterPromotionQuery';
export { CharacterRankQuery } from '@/builders/CharacterRankQuery';
export { CharacterQuery } from '@/builders/CharacterQuery';
export { CharacterSkillQuery } from '@/builders/CharacterSkillQuery';
export { CharacterSkillTreeQuery } from '@/builders/CharacterSkillTreeQuery';
export { ItemQuery } from '@/builders/ItemQuery';

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

export default QueryBuilder;
