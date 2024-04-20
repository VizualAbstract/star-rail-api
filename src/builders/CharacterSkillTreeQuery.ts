import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterSkillTree } from '@/types';

export class CharacterSkillTreeQuery extends QueryBuilder<CharacterSkillTree> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterSkillTrees });
  }

  async getByID(id: string | number): Promise<CharacterSkillTree> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterSkillTree[]> {
    return super.list();
  }
}
