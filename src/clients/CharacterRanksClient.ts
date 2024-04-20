import BaseClient, { ClientOptions } from '@/BaseClient';
import { Resources } from '@/enum';
import { CharacterRank } from '@/types';

export class CharacterRanksClient extends BaseClient<CharacterRank> {
  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.characterRanks });
  }

  async getByID(id: string | number): Promise<CharacterRank> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterRank[]> {
    return super.list();
  }
}
