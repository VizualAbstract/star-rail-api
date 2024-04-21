import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { CharacterRankQuery } from '@/builders/CharacterRankQuery';
import { CharacterSkillTreeQuery } from '@/builders/CharacterSkillTreeQuery';
import { CharacterSkillQuery } from '@/builders/CharacterSkillQuery';
import { Resources } from '@/enum';
import { Character } from '@/types';
import { CharacterPromotionQuery } from '@/builders/CharacterPromotionQuery';

/**
 * Query for fetching characters from the StarRailStaticAPI.
 *
 * @class CharacterQuery
 * @extends QueryBuilder
 *
 * @example
 * const client = new CharacterQuery();
 * client.get().then(data => console.log(data));
 * client.list().then(data => console.log(data));
 * client.getByID('1001').then(data => console.log(data));
 *
 * @param {Config} [config] - Options for the client.
 * @param {string} [config.baseUrl] - Base URL for the client.
 * @param {string} [config.assetUrl] - Asset URL for the client.
 * @param {AxiosCacheInstance} [config.cache] - Axios cache instance.
 * @param {Languages} [config.language] - Language for the client.
 * @param {Resources} [config.resource] - Resource for the client.
 * @returns {void}
 *
 * Modifier methods
 * @method withRanks - Include ranks in the response.
 * @method withRankMaterials - Include materials in the character rank response
 * @method withRankLevelUpSkills - Include level up skills in the character rank response.
 * @method withSkills - Include skills in the response.
 * @method withSkillTrees - Include skill trees in the response.
 * @method withPromotions - Include promotions in the response.
 * @method withPromotionMaterials - Include materials in the promotions response.
 * @method withImages - Include full image paths in the response.
 *
 * Retrieval methods
 * @method getByID - Get a character by ID.
 * @method getByName - Get a character by name.
 * @method list - List all characters.
 */
export class CharacterQuery extends QueryBuilder<Character> {
  private rankQuery?: CharacterRankQuery;
  private skillQuery?: CharacterSkillQuery;
  private skillTreeQuery?: CharacterSkillTreeQuery;
  private promotionQuery?: CharacterPromotionQuery;

  protected options: QueryOptions = {
    withRanks: false,
    withRankMaterials: false,
    withRankLevelUpSkills: false,
    withSkills: false,
    withSkillTrees: false,
    withPromotions: false,
    withPromotionMaterials: false,
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characters });
  }

  async get(): Promise<Record<string, Character>> {
    const characters = await this.list();

    return Object.fromEntries(characters.map((c) => [c.id, c]));
  }

  async list(): Promise<Character[]> {
    let characters = await super.list();

    if (this.options.withRanks) {
      characters = await this.populateRanks(characters);
    }

    if (this.options.withSkills) {
      characters = await this.populateSkills(characters);
    }

    if (this.options.withSkillTrees) {
      characters = await this.populateSkillTrees(characters);
    }

    if (this.options.withPromotions) {
      characters = await this.populatePromotions(characters);
    }

    if (this.options.withImages) {
      characters = await super.injectImagePaths(characters);
    }

    return characters;
  }

  async getByID(id: string | number): Promise<Character> {
    const character = await super.getByID(id);
    let characters: Character[] = [character];

    if (this.options.withRanks) {
      characters = await this.populateRanks(characters);
    }

    if (this.options.withSkills) {
      characters = await this.populateSkills(characters);
    }

    if (this.options.withSkillTrees) {
      characters = await this.populateSkillTrees(characters);
    }

    if (this.options.withPromotions) {
      characters = await this.populatePromotions(characters);
    }

    if (this.options.withImages) {
      characters = await super.injectImagePaths(characters);
    }

    return characters[0];
  }

  async getByName(name: string): Promise<Character | undefined> {
    const allCharacters = await super.list();
    const character = allCharacters.find((c) => c.name === name);

    if (!character) {
      return;
    }

    let characters = [character];

    if (this.options.withRanks) {
      characters = await this.populateRanks(characters);
    }

    if (this.options.withSkills) {
      characters = await this.populateSkills(characters);
    }

    if (this.options.withSkillTrees) {
      characters = await this.populateSkillTrees(characters);
    }

    if (this.options.withPromotions) {
      characters = await this.populatePromotions(characters);
    }

    if (this.options.withImages) {
      characters = await super.injectImagePaths(characters);
    }

    return characters[0];
  }

  withRanks(): CharacterQuery {
    this.options.withRanks = true;
    this.getRankQuery();

    return this;
  }

  withRankMaterials(): CharacterQuery {
    this.options.withRankMaterials = true;

    return this;
  }

  withRankLevelUpSkills(): CharacterQuery {
    this.options.withRankLevelUpSkills = true;

    return this;
  }

  withSkills(): CharacterQuery {
    this.options.withSkills = true;
    this.getSkillQuery();

    return this;
  }

  withSkillTrees(): CharacterQuery {
    this.options.withSkillTrees = true;
    this.getSkillTreeQuery();

    return this;
  }

  withPromotions(): CharacterQuery {
    this.options.withPromotions = true;
    this.getPromotionQuery();

    return this;
  }

  withPromotionMaterials(): CharacterQuery {
    this.options.withPromotionMaterials = true;

    return this;
  }

  withImages(): CharacterQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): CharacterQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
          case 'withRanks':
            this.withRanks();
            break;
          case 'withRankMaterials':
            this.withRankMaterials();
            break;
          case 'withRankLevelUpSkills':
            this.withRankLevelUpSkills();
            break;
          case 'withSkills':
            this.withSkills();
            break;
          case 'withSkillTrees':
            this.withSkillTrees();
            break;
          case 'withPromotions':
            this.withPromotions();
            break;
          case 'withPromotionMaterials':
            this.withPromotionMaterials();
            break;
          case 'withImages':
            this.withImages();
            break;
        }
      }
    });

    return this;
  }

  private getRankQuery(): CharacterRankQuery {
    if (!this.rankQuery) {
      this.rankQuery = new CharacterRankQuery(this.config);
    }

    return this.rankQuery;
  }

  private getSkillQuery(): CharacterSkillQuery {
    if (!this.skillQuery) {
      this.skillQuery = new CharacterSkillQuery(this.config);
    }

    return this.skillQuery;
  }

  private getSkillTreeQuery(): CharacterSkillTreeQuery {
    if (!this.skillTreeQuery) {
      this.skillTreeQuery = new CharacterSkillTreeQuery(this.config);
    }

    return this.skillTreeQuery;
  }

  private getPromotionQuery(): CharacterPromotionQuery {
    if (!this.promotionQuery) {
      this.promotionQuery = new CharacterPromotionQuery(this.config);
    }

    return this.promotionQuery;
  }

  private async populateRanks(characters: Character[]): Promise<Character[]> {
    if (this.rankQuery) {
      if (this.options.withRankMaterials) {
        this.rankQuery.withMaterials();
      }
      if (this.options.withRankLevelUpSkills) {
        this.rankQuery.withLevelUpSkills();
      }
      const ranks = await this.rankQuery.get();
      characters.map((c) => (c._ranks = c.ranks.map((id) => ranks[id])));
    }

    return characters;
  }

  private async populateSkills(characters: Character[]): Promise<Character[]> {
    if (this.skillQuery) {
      const skills = await this.skillQuery.get();
      characters.forEach((c) => {
        c._skills = c.skills.map((id) => skills[id]);
      });
    }

    return characters;
  }

  private async populateSkillTrees(characters: Character[]): Promise<Character[]> {
    if (this.skillTreeQuery) {
      const skillTrees = await this.skillTreeQuery.get();
      characters.forEach((c) => {
        c._skill_trees = c.skill_trees.map((id) => skillTrees[id]);
      });
    }

    return characters;
  }

  private async populatePromotions(characters: Character[]): Promise<Character[]> {
    if (this.promotionQuery) {
      if (this.options.withPromotionMaterials) {
        this.promotionQuery.withMaterials();
      }
      const promotions = await this.promotionQuery.get();
      characters.forEach((c) => {
        c._promotions = promotions[c.id];
      });
    }

    return characters;
  }
}
