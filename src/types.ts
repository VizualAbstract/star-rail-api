import { Stats } from '@/enum';

// Achievements
export interface Achievement {
  id: string;
  series_id: string;
  title: string;
  desc: string;
  hide_desc: string;
  hide: boolean;
}

// Avatar
export interface Avatar {
  id: string;
  name: string;
  icon: string;
}

// Character Promotion
export interface CharacterPromotion {
  id: string;
  values: Record<
    Stats.hp | Stats.atk | Stats.def | Stats.spd | Stats.crit | Stats.dodge | Stats.block,
    CharacterPromotionStat
  >;
  materials: CharacterPromotionMaterial[][];

  _materials?: Item[][];
}

export interface CharacterPromotionStat {
  base: number;
  step: number;
}

export interface CharacterPromotionMaterial {
  id: string;
  num: number;
}

// Character Rank
export interface CharacterRank {
  id: string;
  name: string;
  rank: number;
  desc: string;
  materials: CharacterRankMaterial[];
  level_up_skills: CharacterRankLevelUpSkill[];
  icon: string;

  _materials?: Item[];
  _level_up_skills: CharacterSkill[];
}

export interface CharacterRankMaterial {
  id: string;
  num: number;
}

export interface CharacterRankLevelUpSkill {
  id: string;
  level: number;
}

// Avatar
export interface Avatar {
  id: string;
  name: string;
  icon: string;
}

// Character Skill
export interface CharacterSkill {
  id: string;
  name: string;
  max_level: number;
  element: string;
  type: string;
  type_text: string;
  effect: string;
  effect_text: string;
  simple_desc: string;
  desc: string;
  params: number[][];
  icon: string;
}

// Character Skill Tree
export interface CharacterSkillTree {
  id: string;
  name: string;
  max_level: number;
  desc: string;
  params: number[][];
  anchor: string;
  pre_points: string[];
  level_up_skills: CharacterSkillTreeLevelUpSkill[];
  levels: CharacterSkillTreeLevel[];
  icon: string;
}

export interface CharacterSkillTreeLevelUpSkill {
  id: string;
  num: number;
}

export interface CharacterSkillTreeLevel {
  promotion: number;
  level: number;
  properties: CharacterSkillTreeLevelProperty[];
  materials: CharacterSkillTreeLevelMaterial[];
}

export interface CharacterSkillTreeLevelProperty {
  type: string;
  value: number;
}

export interface CharacterSkillTreeLevelMaterial {
  id: string;
  num: number;
}

// Character
export interface Character {
  id: string;
  name: string;
  tag: string;
  rarity: number;
  path: string;
  element: string;
  max_sp: number;
  ranks: string[];
  skills: string[];
  skill_trees: string[];
  icon: string;
  preview: string;
  portrait: string;

  _ranks?: CharacterRank[];
  _skills?: CharacterSkill[];
  _skill_trees?: CharacterSkillTree[];
  _characterPromotions?: CharacterPromotion;
}

// Description
export interface Description {
  id: string;
  title: string;
  desc: string;
}

// Element
export interface Element {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

// Item
export interface Item {
  id: string;
  name: string;
  type: string;
  sub_type: string;
  rarity: number;
  icon: string;
  come_from: string[];
}

// Light Cone Promotions
export interface LightConePromotions {
  id: string;
  values: Record<Stats.hp | Stats.atk | Stats.def, LightConePromotionStat>;
  materials: LightConePromotionMaterial[][];
}

export interface LightConePromotionStat {
  base: number;
  step: number;
}

export interface LightConePromotionMaterial {
  id: string;
  num: number;
}

// Light Cone Rank
export interface LightConeRank {
  id: string;
  rank: number;
  desc: string;
  params: number[][];
  properties: LightConeRankProperty[][];
}

export interface LightConeRankProperty {
  type: string;
  value: number;
}

// Light Cone
export interface LightCone {
  id: string;
  name: string;
  rarity: number;
  path: string;
  desc: string;
  icon: string;
  preview: string;
  portrait: string;
}

// Nickname
export interface Nickname {
  characters: Record<string, string[]>;
  light_cones: Record<string, string[]>;
  relic_sets: Record<string, string[]>;
}

// Path
export interface Path {
  id: string;
  text: string;
  name: string;
  desc: string;
  icon: string;
}

// Property
export interface Property {
  type: string;
  name: string;
  field: string;
  affix: boolean;
  ratio: boolean;
  percent: false;
  order: number;
  icon: string;
}

// Relic Main Affix
export interface RelicMainAffix {
  id: string;
  affixes: Record<string, RelicMainAffixesAffix>;
}

export interface RelicMainAffixesAffix {
  affix_id: string;
  property: string;
  base: number;
  step: number;
}

// Relic Set
export interface RelicSet {
  id: string;
  name: string;
  desc: string;
  properties: RelicSetProperty[][];
  icon: string;
  guide_overview: unknown[];
}

export interface RelicSetProperty {
  type: string;
  value: number;
}

// Relic Sub Affix
export interface RelicSubAffix {
  id: string;
  affixes: Record<string, RelicSubAffixesAffix>;
}

export interface RelicSubAffixesAffix extends RelicMainAffixesAffix {
  step_num: number;
}

// Relic
export interface Relic {
  id: string;
  set_id: string;
  name: string;
  rarity: number;
  type: string;
  max_level: number;
  main_affix_id: string;
  sub_affix_id: string;
  icon: string;
}

// Simulated Blessing
export interface SimulatedBlessing {
  id: string;
  name: string;
  desc: string;
  enhanced_desc: string;
}

// Simulated Block
export interface SimulatedBlock {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

// Simulated Curio
export interface SimulatedCurio {
  id: string;
  name: string;
  desc: string;
  bg_desc: string;
  icon: string;
}

// Simulated Event
export interface SimulatedEvent {
  id: string;
  name: string;
  type: string;
  image: string;
}
