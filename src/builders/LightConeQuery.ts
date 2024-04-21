import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { LightCone } from '@/types';
import { LightConePromotionQuery } from './LightConePromotionQuery';
import { LightConeRankQuery } from './LightConeRankQuery';

export class LightConeQuery extends QueryBuilder<LightCone> {
  private promotionQuery?: LightConePromotionQuery;
  private rankQuery?: LightConeRankQuery;

  protected options: QueryOptions = {
    withPromotions: false,
    withRanks: false,
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.lightCones });
  }

  async get(): Promise<Record<string, LightCone>> {
    const promotions = await this.list();

    return Object.fromEntries(promotions.map((p) => [p.id, p]));
  }

  async list(): Promise<LightCone[]> {
    let items = await super.list();

    if (this.options.withPromotions) {
      items = await this.populatePromotions(items);
    }

    if (this.options.withRanks) {
      items = await this.populateRanks(items);
    }

    if (this.options.withImages) {
      items = await super.populateImages(items);
    }

    return items;
  }

  async getByID(id: string | number): Promise<LightCone> {
    const item = await super.getByID(id);
    let items = [item];

    if (this.options.withPromotions) {
      items = await this.populatePromotions(items);
    }

    if (this.options.withRanks) {
      items = await this.populateRanks(items);
    }

    if (this.options.withImages) {
      items = await super.populateImages(items);
    }

    return items[0];
  }

  withPromotions(): LightConeQuery {
    this.options.withPromotions = true;
    this.getPromotionQuery();

    return this;
  }

  withRanks(): LightConeQuery {
    this.options.withRanks = true;
    this.getRankQuery();

    return this;
  }

  withImages(): LightConeQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): LightConeQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
          case 'withPromotions':
            this.withPromotions();
            break;
        }
        switch (key) {
          case 'withRanks':
            this.withRanks();
            break;
        }
        switch (key) {
          case 'withImages':
            this.withImages();
            break;
        }
      }
    });

    return this;
  }

  private getPromotionQuery(): LightConePromotionQuery {
    if (!this.promotionQuery) {
      this.promotionQuery = new LightConePromotionQuery(this.config);
    }

    return this.promotionQuery;
  }

  private getRankQuery(): LightConeRankQuery {
    if (!this.rankQuery) {
      this.rankQuery = new LightConeRankQuery(this.config);
    }

    return this.rankQuery;
  }

  private async populatePromotions(items: LightCone[]): Promise<LightCone[]> {
    if (this.promotionQuery) {
      const promotions = await this.promotionQuery.get();

      items.forEach((i) => {
        i._promotions = promotions[i.id];
      });
    }

    return items;
  }

  private async populateRanks(items: LightCone[]): Promise<LightCone[]> {
    if (this.rankQuery) {
      const ranks = await this.rankQuery.get();

      items.forEach((i) => {
        i._ranks = ranks[i.id];
      });
    }

    return items;
  }
}
