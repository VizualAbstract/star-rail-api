import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Nickname } from '@/types';

export class NicknameQuery extends QueryBuilder<Nickname> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.nicknames });
  }
}
