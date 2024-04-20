import QueryBuilder, { Config } from '@/QueryBuilder';
import { Characters, Resources } from '@/enum';
import { CharacterToIDs } from '@/utils';
import { CharacterPromotion } from '@/types';
import { ItemsQuery } from '@builders/ItemsQuery';

export class CharacterPromotionsQuery extends QueryBuilder<CharacterPromotion> {
  private itemsQuery?: ItemsQuery;

  private fetchMaterials = false;

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterPromotions });

    this.config = { ...config, resource: Resources.characterPromotions };
  }

  withMaterials(): CharacterPromotionsQuery {
    this.fetchMaterials = true;
    this.getItemsQuery();

    return this;
  }

  async getByCharacterID(id: string | number): Promise<CharacterPromotion> {
    let characterPromotion = await super.getByID(id);

    if (this.fetchMaterials) {
      characterPromotion = await this.populateMaterials(characterPromotion);
    }

    return characterPromotion;
  }

  async getByCharacterName(character: Characters): Promise<CharacterPromotion> {
    const id = CharacterToIDs[character];

    return this.getByCharacterID(id);
  }

  async list(): Promise<CharacterPromotion[]> {
    const items = await super.list();

    return items;
  }

  private getItemsQuery(): ItemsQuery {
    if (!this.itemsQuery) {
      this.itemsQuery = new ItemsQuery(this.config);
    }

    return this.itemsQuery;
  }

  private async populateMaterials(
    characterPromotion: CharacterPromotion,
  ): Promise<CharacterPromotion> {
    if (
      this.itemsQuery &&
      characterPromotion.materials &&
      characterPromotion.materials.length > 0
    ) {
      const items = await this.itemsQuery.get();

      characterPromotion._materials = characterPromotion.materials.map((promotion) =>
        promotion.map((material) => items[material.id]),
      );
    }

    return characterPromotion;
  }
}
