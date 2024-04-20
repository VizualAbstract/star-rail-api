import BaseClient, { ClientOptions } from '@/BaseClient';
import { CharacterToIDs, Characters, Resources } from '@/enum';
import { CharacterPromotion } from '@/types';
import { ItemsClient } from '@clients/ItemsClient';

export class CharacterPromotionsClient extends BaseClient<CharacterPromotion> {
  private itemsClient?: ItemsClient;

  private fetchMaterials = false;

  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.characterPromotions });

    this.options = { ...options, resource: Resources.characterPromotions };
  }

  withMaterials(): CharacterPromotionsClient {
    this.fetchMaterials = true;
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

  private getItemsClient(): ItemsClient {
    if (!this.itemsClient) {
      this.itemsClient = new ItemsClient(this.options);
    }

    return this.itemsClient;
  }

  private async populateMaterials(
    characterPromotion: CharacterPromotion,
  ): Promise<CharacterPromotion> {
    if (
      this.fetchMaterials &&
      characterPromotion.materials &&
      characterPromotion.materials.length > 0
    ) {
      const items = await this.getItemsClient().get();

      characterPromotion._materials = characterPromotion.materials.map((promotion) =>
        promotion.map((material) => items[material.id]),
      );
    }

    return characterPromotion;
  }
}
