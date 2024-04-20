import QueryBuilder, { ClientOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterSkill } from '@/types';

export class CharacterSkillsClient extends QueryBuilder<CharacterSkill> {
  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.characterSkills });
  }

  async getByID(id: string | number): Promise<CharacterSkill> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterSkill[]> {
    return super.list();
  }
}
