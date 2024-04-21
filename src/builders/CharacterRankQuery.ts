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

    return Object.fromEntries(characterRanks.map((p) => [p.id, p]));
  }

  async list(): Promise<CharacterRank[]> {
    let items = await super.list();

    if (this.options.withMaterials) {
      items = await this.populateMaterials(items);
    }

    if (this.options.withLevelUpSkills) {
      items = await this.populateLevelUpSkills(items);
    }

    if (this.options.withImages) {
      items = await super.injectImagePaths(items);
    }

    return items;
  }

  async getByID(id: string | number): Promise<CharacterRank> {
    const characterRank = await super.getByID(id);
    let characterRanks = [characterRank];

    if (this.options.withMaterials) {
      characterRanks = await this.populateMaterials(characterRanks);
    }

    if (this.options.withLevelUpSkills) {
      characterRanks = await this.populateLevelUpSkills(characterRanks);
    }

    if (this.options.withImages) {
      characterRanks = await super.injectImagePaths(characterRanks);
    }

    return characterRanks[0];
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

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
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

  private async populateMaterials(characterRanks: CharacterRank[]): Promise<CharacterRank[]> {
    if (this.itemQuery) {
      const items = await this.itemQuery.get();

      characterRanks.forEach((c) => {
        c._materials = c.materials.map((i) => items[i.id]);
      });
    }

    return characterRanks;
  }

  private async populateLevelUpSkills(characterRanks: CharacterRank[]): Promise<CharacterRank[]> {
    if (this.skillQuery) {
      const skills = await this.skillQuery.get();

      characterRanks.forEach((characterRank) => {
        characterRank._level_up_skills = Object.values(characterRank.level_up_skills).map(
          (s) => skills[s.id],
        );
      });
    }

    return characterRanks;
  }
}
