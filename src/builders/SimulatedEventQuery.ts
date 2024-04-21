import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { SimulatedEvent } from '@/types';

export class SimulatedEventQuery extends QueryBuilder<SimulatedEvent> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.simulatedEvents });
  }
}
