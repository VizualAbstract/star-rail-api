import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { SimulatedBlessing } from '@/types';

export class SimulatedBlessingQuery extends QueryBuilder<SimulatedBlessing> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.simulatedBlessings });
  }
}
