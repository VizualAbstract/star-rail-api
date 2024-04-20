import QueryBuilder from '@/QueryBuilder';

export { Characters, CharacterIDs, Resources, Stats, Languages, Properties, Paths } from '@/enum';

export { AchievementsQuery } from '@/builders/AchievementsQuery';
export { AvatarsQuery } from '@/builders/AvatarsQuery';
export { CharacterPromotionsQuery } from '@/builders/CharacterPromotionsQuery';
export { CharacterRanksQuery } from '@/builders/CharacterRanksQuery';
export { CharactersQuery } from '@/builders/CharactersQuery';
export { CharacterSkillsQuery } from '@/builders/CharacterSkillsQuery';
export { CharacterSkillTreesQuery } from '@/builders/CharacterSkillTreesQuery';
export { ItemsQuery } from '@builders/ItemsQuery';

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
