import QueryBuilder, { Config } from '@/QueryBuilder';
import { Characters, Resources } from '@/enum';
import { CharacterToIDs } from '@/utils';
import { CharacterPromotion } from '@/types';
import { ItemQuery } from '@/builders/ItemQuery';

export class CharacterPromotionQuery extends QueryBuilder<CharacterPromotion> {
  private itemQuery?: ItemQuery;

  private fetchMaterials = false;

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterPromotions });

    this.config = { ...config, resource: Resources.characterPromotions };
  }

  withMaterials(): CharacterPromotionQuery {
    this.fetchMaterials = true;
    this.getItemQuery();

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

  private getItemQuery(): ItemQuery {
    if (!this.itemQuery) {
      this.itemQuery = new ItemQuery(this.config);
    }

    return this.itemQuery;
  }

  private async populateMaterials(
    characterPromotion: CharacterPromotion,
  ): Promise<CharacterPromotion> {
    if (this.itemQuery && characterPromotion.materials && characterPromotion.materials.length > 0) {
      const items = await this.itemQuery.get();

      characterPromotion._materials = characterPromotion.materials.map((promotion) =>
        promotion.map((material) => items[material.id]),
      );
    }

    return characterPromotion;
  }
}
