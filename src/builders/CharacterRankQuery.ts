import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { CharacterRank } from '@/types';
import { ItemQuery } from './ItemQuery';
import { CharacterToIDs } from '@/utils';
import { CharacterSkillQuery } from './CharacterSkillQuery';

export class CharacterRankQuery extends QueryBuilder<CharacterRank> {
  private itemQuery?: ItemQuery;
  private skillQuery?: CharacterSkillQuery;

  protected options: QueryOptions = {
    withMaterials: false,
    withLevelUpSkills: false,
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characterRanks });
  }

  async get(): Promise<Record<string, CharacterRank>> {
    const characterRanks = await this.list();

    return Object.fromEntries(characterRanks.map((promotion) => [promotion.id, promotion]));
  }

  async list(): Promise<CharacterRank[]> {
    let items = await super.list();

    if (this.options.withMaterials) {
      items = await Promise.all(items.map((item) => this.populateMaterials(item)));
    }

    if (this.options.withLevelUpSkills) {
      items = await Promise.all(items.map((item) => this.populateLevelUpSkills(item)));
    }

    if (this.options.withImages) {
      items = await Promise.all(items.map((char) => super.injectImagePaths(char)));
    }

    return items;
  }

  async getByID(id: string | number): Promise<CharacterRank> {
    let characterRank = await super.getByID(id);

    if (this.options.withMaterials) {
      characterRank = await this.populateMaterials(characterRank);
    }

    if (this.options.withLevelUpSkills) {
      characterRank = await this.populateLevelUpSkills(characterRank);
    }

    if (this.options.withImages) {
      characterRank = await super.injectImagePaths(characterRank);
    }

    return characterRank;
  }

  async getByCharacterName(character: string): Promise<CharacterRank> {
    const id = CharacterToIDs[character];

    return this.getByID(id);
  }

  withMaterials(): CharacterRankQuery {
    this.options.withMaterials = true;
    this.getItemQuery();

    return this;
  }

  withLevelUpSkills(): CharacterRankQuery {
    this.options.withLevelUpSkills = true;
    this.getSkillQuery();

    return this;
  }

  withImages(): CharacterRankQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): CharacterRankQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((optionKey) => {
      if (options[optionKey]) {
        switch (optionKey) {
          case 'withMaterials':
            this.withMaterials();
            break;
          case 'withLevelUpSkills':
            this.withLevelUpSkills();
            break;
          case 'withImages':
            this.withImages();
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

  private getSkillQuery(): CharacterSkillQuery {
    if (!this.skillQuery) {
      this.skillQuery = new CharacterSkillQuery(this.config);
    }

    return this.skillQuery;
  }

  private async populateMaterials(characterRank: CharacterRank): Promise<CharacterRank> {
    if (this.itemQuery && characterRank.materials) {
      const items = await this.itemQuery.get();

      characterRank._materials = characterRank.materials.map((material) => items[material.id]);
    }

    return characterRank;
  }

  private async populateLevelUpSkills(characterRank: CharacterRank): Promise<CharacterRank> {
    if (this.skillQuery && characterRank.level_up_skills) {
      const skills = await this.skillQuery.get();
      characterRank._level_up_skills = Object.values(characterRank.level_up_skills).map(
        (skill) => skills[skill.id],
      );
    }

    return characterRank;
  }
}
