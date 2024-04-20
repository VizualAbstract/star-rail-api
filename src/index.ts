import QueryBuilder from '@/QueryBuilder';

export { Characters, CharacterIDs, Resources, Stats, Languages, Properties, Paths } from '@/enum';

export { AchievementsQuery } from '@clients/AchievementsQuery';
export { AvatarsQuery } from '@clients/AvatarsQuery';
export { CharacterPromotionsQuery } from '@clients/CharacterPromotionsQuery';
export { CharacterRanksQuery } from '@clients/CharacterRanksQuery';
export { CharactersQuery } from '@clients/CharactersQuery';
export { CharacterSkillsQuery } from '@clients/CharacterSkillsQuery';
export { CharacterSkillTreesQuery } from '@clients/CharacterSkillTreesQuery';
export { ItemsQuery } from '@clients/ItemsQuery';

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
