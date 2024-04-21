import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterToIDs } from '@/utils';
import { CharacterPromotion } from '@/types';
import { ItemQuery } from '@/builders/ItemQuery';

export class CharacterPromotionQuery extends QueryBuilder<CharacterPromotion> {
  private itemQuery?: ItemQuery;

  protected options: QueryOptions = {
    withMaterials: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterPromotions });
  }

  async get(): Promise<Record<string, CharacterPromotion>> {
    const promotions = await this.list();

    return Object.fromEntries(promotions.map((p) => [p.id, p]));
  }

  async list(): Promise<CharacterPromotion[]> {
    let items = await super.list();

    if (this.options.withMaterials) {
      items = await this.populateMaterials(items);
    }

    return items;
  }

  async getByID(id: string | number): Promise<CharacterPromotion> {
    const promotion = await super.getByID(id);
    let promotions = [promotion];

    if (this.options.withMaterials) {
      promotions = await this.populateMaterials(promotions);
    }

    return promotions[0];
  }

  async getByCharacterName(name: string): Promise<CharacterPromotion> {
    const id = CharacterToIDs[name];

    return this.getByID(id);
  }

  withMaterials(): CharacterPromotionQuery {
    this.options.withMaterials = true;
    this.getItemQuery();

    return this;
  }

  withOptions(options: QueryOptions): CharacterPromotionQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
          case 'withMaterials':
            this.withMaterials();
            break;
        }
      }
    });

    return this;
  }

  private getItemQuery(): ItemQuery {
    if (!this.itemQuery) {
      this.itemQuery = new ItemQuery(this.config);
    }

    return this.itemQuery;
  }

  private async populateMaterials(items: CharacterPromotion[]): Promise<CharacterPromotion[]> {
    if (this.itemQuery) {
      const _items = await this.itemQuery.get();

      items.forEach((c) => {
        c._materials = c.materials.map((materials) => materials.map((i) => _items[i.id]));
      });
    }

    return items;
  }
}
