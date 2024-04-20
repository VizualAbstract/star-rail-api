import QueryBuilder, { ClientOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterRank } from '@/types';

export class CharacterRanksClient extends QueryBuilder<CharacterRank> {
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
