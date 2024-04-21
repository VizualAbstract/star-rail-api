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
  private characterPromotionQuery?: CharacterPromotionQuery;

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

    return Object.fromEntries(characters.map((char) => [char.id, char]));
  }

  async list(): Promise<Character[]> {
    let characters = await super.list();

    if (this.options.withRanks) {
      characters = await this.populateRanks(characters); // await Promise.all(characters.map((char) => this.populateRanks(char)));
    }

    if (this.options.withSkills) {
      characters = await Promise.all(characters.map((char) => this.populateSkills(char)));
    }

    if (this.options.withSkillTrees) {
      characters = await Promise.all(characters.map((char) => this.populateSkillTrees(char)));
    }

    if (this.options.withPromotions) {
      characters = await this.populateCharacterPromotions(characters);
    }

    if (this.options.withImages) {
      characters = await Promise.all(characters.map((char) => super.injectImagePaths(char)));
    }

    return characters;
  }

  async getByID(id: string | number): Promise<Character> {
    let character = await super.getByID(id);

    if (this.options.withRanks) {
      const characters = await this.populateRanks([character]);
      character = characters[0];
    }

    if (this.options.withSkills) {
      character = await this.populateSkills(character);
    }

    if (this.options.withSkillTrees) {
      character = await this.populateSkillTrees(character);
    }

    if (this.options.withPromotions) {
      const characters = await this.populateCharacterPromotions([character]);
      character = characters[0];
    }

    if (this.options.withImages) {
      character = await super.injectImagePaths(character);
    }

    return character;
  }

  async getByName(name: string): Promise<Character | undefined> {
    const characters = await this.list();
    const character = characters.find((char) => char.name === name);

    if (!character) {
      return character;
    }

    return this.getByID(character.id);
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
    this.getCharacterPromotionQuery();

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

    Object.keys(options).forEach((optionKey) => {
      if (options[optionKey]) {
        switch (optionKey) {
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

  private getCharacterPromotionQuery(): CharacterPromotionQuery {
    if (!this.characterPromotionQuery) {
      this.characterPromotionQuery = new CharacterPromotionQuery(this.config);
    }

    return this.characterPromotionQuery;
  }

  private async populateRanks(characters: Character[]): Promise<Character[]> {
    if (this.rankQuery) {
      const ranksQuery = this.rankQuery;
      if (this.options.withRankMaterials) {
        ranksQuery.withMaterials();
      }
      if (this.options.withRankLevelUpSkills) {
        ranksQuery.withLevelUpSkills();
      }
      const ranks = await ranksQuery.get();
      characters.map((c) => (c._ranks = c.ranks.map((rankId) => ranks[rankId])));
    }

    return characters;
  }

  private async populateSkills(character: Character): Promise<Character> {
    if (this.skillQuery && character.skills) {
      const skills = await this.skillQuery.get();
      character._skills = character.skills.map((skillId) => skills[skillId]);
    }

    return character;
  }

  private async populateSkillTrees(character: Character): Promise<Character> {
    if (this.skillTreeQuery && character.skill_trees) {
      const skillTrees = await this.skillTreeQuery.get();
      character._skill_trees = character.skill_trees.map((skillTreeId) => skillTrees[skillTreeId]);
    }

    return character;
  }

  private async populateCharacterPromotions(characters: Character[]): Promise<Character[]> {
    if (this.characterPromotionQuery) {
      const characterPromotionQuery = this.characterPromotionQuery;
      if (this.options.withPromotionMaterials) {
        characterPromotionQuery.withMaterials();
      }
      const characterPromotions = await characterPromotionQuery.get();
      characters.map((c) => ({ ...c, _characterPromotions: characterPromotions[c.id] }));
    }

    return characters;
  }
}
