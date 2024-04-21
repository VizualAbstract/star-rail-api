import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { SimulatedCurio } from '@/types';

export class SimulatedCurioQuery extends QueryBuilder<SimulatedCurio> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.simulatedCurios });
  }
}
