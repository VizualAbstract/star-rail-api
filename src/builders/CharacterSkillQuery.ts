import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterSkill } from '@/types';

export class CharacterSkillQuery extends QueryBuilder<CharacterSkill> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterSkills });
  }
}
