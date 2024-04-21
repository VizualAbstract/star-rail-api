import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterSkillTree } from '@/types';

export class CharacterSkillTreeQuery extends QueryBuilder<CharacterSkillTree> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterSkillTrees });
  }
}
