import BaseClient from './BaseClient';

export { Characters, CharacterIDs, Resources, Stats, Languages, Properties, Paths } from './enum';

export { CharacterRanksClient } from './clients/CharacterRanksClient';
export { CharactersClient } from './clients/CharactersClient';

export type {
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
