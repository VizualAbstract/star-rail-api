import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterRank } from '@/types';

export class CharacterRanksQuery extends QueryBuilder<CharacterRank> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterRanks });
  }

  async getByID(id: string | number): Promise<CharacterRank> {
    return super.getByID(id);
  }

  async list(): Promise<CharacterRank[]> {
    return super.list();
  }
}
