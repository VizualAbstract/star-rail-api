import QueryBuilder, { Config } from '@/QueryBuilder';
import { CharacterRankQuery } from '@/builders/CharacterRankQuery';
import { CharacterSkillTreeQuery } from '@/builders/CharacterSkillTreeQuery';
import { CharacterSkillQuery } from '@/builders/CharacterSkillQuery';
import { Resources } from '@/enum';
import { Character } from '@/types';
import { CharacterPromotionQuery } from '@/builders/CharacterPromotionQuery';

/**
 * Query for fetching characters from the StarRailResStaticAPI.
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
 * @method withSkills - Include skills in the response.
 * @method withSkillTrees - Include skill trees in the response.
 * @method withPromotions - Include promotions in the response.
 * @method withMaterials - Include materials in the promotions response.
 * @method withImages - Include full image paths in the response.
 *
 * Retrieval methods
 * @method getByID - Get a character by ID.
 * @method getByName - Get a character by name.
 * @method list - List all characters.
 */
export class Characterquery extends QueryBuilder<Character> {
  private rankQuery?: CharacterRankQuery;
  private skillQuery?: CharacterSkillQuery;
  private skillTreeQuery?: CharacterSkillTreeQuery;
  private characterPromotionQuery?: CharacterPromotionQuery;

  private fetchRanks: boolean = false;
  private fetchSkills: boolean = false;
  private fetchSkillTrees: boolean = false;
  private fetchPromotions: boolean = false;
  private fetchMaterials: boolean = false;
  private includeImagePaths: boolean = false;

  constructor(config?: Config) {
    super({ ...config, resource: Resources.characters });

    this.config = { ...config, resource: Resources.characters };
  }

  withRanks(): Characterquery {
    this.fetchRanks = true;
    this.getRankQuery();

    return this;
  }

  withSkills(): Characterquery {
    this.fetchSkills = true;
    this.getSkillQuery();

    return this;
  }

  withSkillTrees(): Characterquery {
    this.fetchSkillTrees = true;
    this.getSkillTreeQuery();

    return this;
  }

  withPromotions(): Characterquery {
    this.fetchPromotions = true;
    this.getCharacterPromotionQuery();

    return this;
  }

  withMaterials(): Characterquery {
    if (this.fetchPromotions) {
      this.fetchMaterials = true;
      this.addMaterialsToCharacterPromotions();
    }

    return this;
  }

  withImages(): Characterquery {
    this.includeImagePaths = true;

    return this;
  }

  async getByID(id: string | number): Promise<Character> {
    let character = await super.getByID(id);

    if (this.fetchRanks) {
      character = await this.populateRanks(character);
    }

    if (this.fetchSkills) {
      character = await this.populateSkills(character);
    }

    if (this.fetchSkillTrees) {
      character = await this.populateSkillTrees(character);
    }

    if (this.fetchPromotions) {
      character = await this.populateCharacterPromotions(character);
    }

    if (this.includeImagePaths) {
      character = await this.injectImagePaths(character);
    }

    return character;
  }

  async getByName(name: string): Promise<Character | undefined> {
    const characters = await this.list();
    let character = characters.find((char) => char.name === name);

    if (!character) {
      return character;
    }

    if (character && this.fetchRanks) {
      character = await this.populateRanks(character);
    }

    if (character && this.fetchSkills) {
      character = await this.populateSkills(character);
    }

    if (character && this.fetchSkillTrees) {
      character = await this.populateSkillTrees(character);
    }

    if (character && this.fetchPromotions) {
      character = await this.populateCharacterPromotions(character);
    }

    if (character && this.includeImagePaths) {
      character = await this.injectImagePaths(character);
    }

    return character;
  }

  async list(): Promise<Character[]> {
    let characters = await super.list();

    if (this.fetchRanks) {
      characters = await Promise.all(characters.map((char) => this.populateRanks(char)));
    }

    if (this.fetchSkills) {
      characters = await Promise.all(characters.map((char) => this.populateSkills(char)));
    }

    if (this.fetchSkillTrees) {
      characters = await Promise.all(characters.map((char) => this.populateSkillTrees(char)));
    }

    if (this.fetchPromotions) {
      characters = await Promise.all(
        characters.map((char) => this.populateCharacterPromotions(char)),
      );
    }

    if (this.includeImagePaths) {
      characters = await Promise.all(characters.map((char) => this.injectImagePaths(char)));
    }

    return characters;
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

  private addMaterialsToCharacterPromotions() {
    if (this.characterPromotionQuery && this.fetchMaterials) {
      this.characterPromotionQuery.withMaterials();
    }
  }

  private async populateRanks(character: Character): Promise<Character> {
    if (this.rankQuery && character.ranks && character.ranks.length > 0) {
      const ranks = await this.rankQuery.get();

      character._ranks = character.ranks.map((rankId) => ranks[rankId]);
    }

    return character;
  }

  private async populateSkills(character: Character): Promise<Character> {
    if (this.skillQuery && character.skills && character.skills.length > 0) {
      const skills = await this.skillQuery.get();

      character._skills = character.skills.map((skillId) => skills[skillId]);
    }

    return character;
  }

  private async populateSkillTrees(character: Character): Promise<Character> {
    if (this.skillTreeQuery && character.skill_trees && character.skill_trees.length > 0) {
      const skillTrees = await this.skillTreeQuery.get();

      character._skill_trees = character.skill_trees.map((skillTreeId) => skillTrees[skillTreeId]);
    }

    return character;
  }

  private async populateCharacterPromotions(character: Character): Promise<Character> {
    if (this.characterPromotionQuery) {
      const characterPromotions = await this.characterPromotionQuery.getByCharacterID(character.id);

      character._characterPromotions = characterPromotions;
    }

    return character;
  }
}
