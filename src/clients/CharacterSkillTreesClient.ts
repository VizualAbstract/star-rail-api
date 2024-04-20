import BaseClient, { ClientOptions } from '@/BaseClient';
import { Resources } from '@/enum';
import { CharacterSkillTree } from '@/types';

export class CharacterSkillTreesClient extends BaseClient<CharacterSkillTree> {
  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.characterSkillTrees });
  }

  async getByID(id: string | number): Promise<CharacterSkillTree> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterSkillTree[]> {
    return super.list();
  }
}
