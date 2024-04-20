import QueryBuilder, { Config } from '@/QueryBuilder';
import { CharacterRanksQuery } from '@clients/CharacterRanksQuery';
import { CharacterSkillTreesQuery } from '@clients/CharacterSkillTreesQuery';
import { CharacterSkillsQuery } from '@clients/CharacterSkillsQuery';
import { Resources } from '@/enum';
import { Character } from '@/types';
import { CharacterPromotionsQuery } from '@clients/CharacterPromotionsQuery';

/**
 * Query for fetching characters from the StarRailResStaticAPI.
 *
 * @class CharactersQuery
 * @extends QueryBuilder
 *
 * @example
 * const client = new CharactersQuery();
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
export class CharactersQuery extends QueryBuilder<Character> {
  private ranksQuery?: CharacterRanksQuery;
  private skillsQuery?: CharacterSkillsQuery;
  private skillTreesQuery?: CharacterSkillTreesQuery;
  private characterPromotionsQuery?: CharacterPromotionsQuery;

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

  withRanks(): CharactersQuery {
    this.fetchRanks = true;
    this.getRanksQuery();

    return this;
  }

  withSkills(): CharactersQuery {
    this.fetchSkills = true;
    this.getSkillsQuery();

    return this;
  }

  withSkillTrees(): CharactersQuery {
    this.fetchSkillTrees = true;
    this.getSkillTreesQuery();

    return this;
  }

  withPromotions(): CharactersQuery {
    this.fetchPromotions = true;
    this.getCharacterPromotionsQuery();

    return this;
  }

  withMaterials(): CharactersQuery {
    if (this.fetchPromotions) {
      this.fetchMaterials = true;
      this.addMaterialsToCharacterPromotions();
    }

    return this;
  }

  withImages(): CharactersQuery {
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

  private getRanksQuery(): CharacterRanksQuery {
    if (!this.ranksQuery) {
      this.ranksQuery = new CharacterRanksQuery(this.config);
    }

    return this.ranksQuery;
  }

  private getSkillsQuery(): CharacterSkillsQuery {
    if (!this.skillsQuery) {
      this.skillsQuery = new CharacterSkillsQuery(this.config);
    }

    return this.skillsQuery;
  }

  private getSkillTreesQuery(): CharacterSkillTreesQuery {
    if (!this.skillTreesQuery) {
      this.skillTreesQuery = new CharacterSkillTreesQuery(this.config);
    }

    return this.skillTreesQuery;
  }

  private getCharacterPromotionsQuery(): CharacterPromotionsQuery {
    if (!this.characterPromotionsQuery) {
      this.characterPromotionsQuery = new CharacterPromotionsQuery(this.config);
    }

    return this.characterPromotionsQuery;
  }

  private addMaterialsToCharacterPromotions() {
    if (this.characterPromotionsQuery && this.fetchMaterials) {
      this.characterPromotionsQuery.withMaterials();
    }
  }

  private async populateRanks(character: Character): Promise<Character> {
    if (this.ranksQuery && character.ranks && character.ranks.length > 0) {
      const ranks = await this.ranksQuery.get();

      character._ranks = character.ranks.map((rankId) => ranks[rankId]);
    }

    return character;
  }

  private async populateSkills(character: Character): Promise<Character> {
    if (this.skillsQuery && character.skills && character.skills.length > 0) {
      const skills = await this.skillsQuery.get();

      character._skills = character.skills.map((skillId) => skills[skillId]);
    }

    return character;
  }

  private async populateSkillTrees(character: Character): Promise<Character> {
    if (this.skillTreesQuery && character.skill_trees && character.skill_trees.length > 0) {
      const skillTrees = await this.skillTreesQuery.get();

      character._skill_trees = character.skill_trees.map((skillTreeId) => skillTrees[skillTreeId]);
    }

    return character;
  }

  private async populateCharacterPromotions(character: Character): Promise<Character> {
    if (this.characterPromotionsQuery) {
      const characterPromotions = await this.characterPromotionsQuery.getByCharacterID(
        character.id,
      );

      character._characterPromotions = characterPromotions;
    }

    return character;
  }
}
