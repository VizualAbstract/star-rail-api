import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterRank } from '@/types';

export class CharacterRankQuery extends QueryBuilder<CharacterRank> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterRanks });
  }
}
