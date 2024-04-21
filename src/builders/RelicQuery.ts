import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Relic } from '@/types';
import { RelicSetQuery } from './RelicSetQuery';

export class RelicQuery extends QueryBuilder<Relic> {
  private relicSetQuery?: RelicSetQuery;

  protected options: QueryOptions = {
    withRelicSets: false,
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.relics });
  }

  async get(): Promise<Record<string, Relic>> {
    const promotions = await this.list();

    return Object.fromEntries(promotions.map((p) => [p.id, p]));
  }

  async list(): Promise<Relic[]> {
    let items = await super.list();

    if (this.options.withRelicSets) {
      items = await this.populateRelicSets(items);
    }

    if (this.options.withImages) {
      items = await super.populateImages(items);
    }

    return items;
  }

  async getByID(id: string | number): Promise<Relic> {
    const relic = await super.getByID(id);
    let relics = [relic];

    if (this.options.withRelicSets) {
      relics = await this.populateRelicSets(relics);
    }

    if (this.options.withImages) {
      relics = await super.populateImages(relics);
    }

    return relics[0];
  }

  withRelicSets(): RelicQuery {
    this.options.withRelicSets = true;
    this.getRelicSetQuery();

    return this;
  }

  withImages(): RelicQuery {
    this.options.withImages = true;

    return this;
  }

  private getRelicSetQuery(): RelicSetQuery {
    if (!this.relicSetQuery) {
      this.relicSetQuery = new RelicSetQuery(this.config);
    }

    return this.relicSetQuery;
  }

  private async populateRelicSets(relics: Relic[]): Promise<Relic[]> {
    if (this.relicSetQuery) {
      const relicSets = await this.relicSetQuery.get();

      relics.forEach((r) => {
        r._set = relicSets[r.set_id];
      });
    }

    return relics;
  }

  withOptions(options: QueryOptions): RelicQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
          case 'withRelicSets':
            this.withRelicSets();
            break;
          case 'withImages':
            this.withImages();
            break;
        }
      }
    });

    return this;
  }
}
