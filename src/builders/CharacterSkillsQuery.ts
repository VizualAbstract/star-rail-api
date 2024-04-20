import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterSkill } from '@/types';

export class CharacterSkillsQuery extends QueryBuilder<CharacterSkill> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterSkills });
  }

  async getByID(id: string | number): Promise<CharacterSkill> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterSkill[]> {
    return super.list();
  }
}
