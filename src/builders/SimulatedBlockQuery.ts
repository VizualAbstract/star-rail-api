import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { SimulatedBlock } from '@/types';

export class SimulatedBlockQuery extends QueryBuilder<SimulatedBlock> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.simulatedBlocks });
  }
}
