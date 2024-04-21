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
    const characterPromotions = await this.list();

    return Object.fromEntries(characterPromotions.map((promotion) => [promotion.id, promotion]));
  }

  async list(): Promise<CharacterPromotion[]> {
    let items = await super.list();

    if (this.options.withMaterials) {
      items = await Promise.all(items.map((item) => this.populateMaterials(item)));
    }

    return items;
  }

  async getByID(id: string | number): Promise<CharacterPromotion> {
    let characterPromotion = await super.getByID(id);

    if (this.options.withMaterials) {
      characterPromotion = await this.populateMaterials(characterPromotion);
    }

    return characterPromotion;
  }

  async getByCharacterName(character: string): Promise<CharacterPromotion> {
    const id = CharacterToIDs[character];

    return this.getByID(id);
  }

  withMaterials(): CharacterPromotionQuery {
    this.options.withMaterials = true;
    this.getItemQuery();

    return this;
  }

  private getItemQuery(): ItemQuery {
    if (!this.itemQuery) {
      this.itemQuery = new ItemQuery(this.config);
    }

    return this.itemQuery;
  }

  private async populateMaterials(
    characterPromotion: CharacterPromotion,
  ): Promise<CharacterPromotion> {
    if (this.itemQuery && characterPromotion.materials) {
      const items = await this.itemQuery.get();

      characterPromotion._materials = characterPromotion.materials.map((materials) =>
        materials.map((item) => items[item.id]),
      );
    }

    return characterPromotion;
  }

  withOptions(options: QueryOptions): CharacterPromotionQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((optionKey) => {
      if (options[optionKey]) {
        switch (optionKey) {
          case 'withMaterials':
            this.withMaterials();
            break;
        }
      }
    });

    return this;
  }
}
