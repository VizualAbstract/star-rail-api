import BaseClient, { ClientOptions } from '../BaseClient';
import { CharacterRanksClient } from './CharacterRanksClient';
import { CharacterSkillTreesClient } from './CharacterSkillTreesClient';
import { CharacterSkillsClient } from './CharacterSkillsClient';
import { Resources } from '../enum';
import { Character } from '../types';
import utils from '../utils';

/**
 * Client for fetching characters from the StarRailResStaticAPI.
 *
 * @class CharactersClient
 * @extends BaseClient
 *
 * @example
 * const client = new CharactersClient();
 * client.get().then(data => console.log(data));
 * client.list().then(data => console.log(data));
 * client.getByID('1001').then(data => console.log(data));
 *
 * @param {ClientOptions} [options] - Options for the client.
 * @param {string} [options.baseUrl] - Base URL for the client.
 * @param {string} [options.assetUrl] - Asset URL for the client.
 * @param {AxiosCacheInstance} [options.cache] - Axios cache instance.
 * @param {Languages} [options.language] - Language for the client.
 * @param {Resources} [options.resource] - Resource for the client.
 * @returns {void}
 *
 * Modifier methods
 * @method withRanks - Include ranks in the response.
 * @method withSkills - Include skills in the response.
 * @method withSkillTrees - Include skill trees in the response.
 * @method withImages - Include full image paths in the response.
 *
 * Retrieval methods
 * @method getByID - Get a character by ID.
 * @method getByName - Get a character by name.
 * @method list - List all characters.
 */
export class CharactersClient extends BaseClient<Character> {
  private options: ClientOptions;

  private ranksClient?: CharacterRanksClient;
  private skillsClient?: CharacterSkillsClient;
  private skillTreesClient?: CharacterSkillTreesClient;

  private fetchRanks: boolean = false;
  private fetchSkills: boolean = false;
  private fetchSkillTrees: boolean = false;
  private includeFullImagePath: boolean = false;

  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.characters });

    this.options = { ...options, resource: Resources.characters };
  }

  withRanks(): CharactersClient {
    this.fetchRanks = true;
    return this;
  }

  withSkills(): CharactersClient {
    this.fetchSkills = true;
    return this;
  }

  withSkillTrees(): CharactersClient {
    this.fetchSkillTrees = true;
    return this;
  }

  withImages(): CharactersClient {
    this.includeFullImagePath = true;

    return this;
  }

  async getByID(id: string | number): Promise<Character> {
    let character = await super.getByID(id);

    console.time('getByID');
    if (this.fetchRanks) {
      character = await this.populateRanks(character);
    }

    if (this.fetchSkills) {
      character = await this.populateSkills(character);
    }

    if (this.fetchSkillTrees) {
      character = await this.populateSkillTrees(character);
    }

    if (this.includeFullImagePath) {
      character = await this.populateFullImagePaths(character);
    }
    console.timeEnd('getByID');

    return character;
  }

  async getByName(name: string): Promise<Character | undefined> {
    const characters = await this.list();
    let character = characters.find((char) => char.name === name);

    console.time('getByName');
    if (character && this.fetchRanks) {
      character = await this.populateRanks(character);
    }

    if (character && this.fetchSkills) {
      character = await this.populateSkills(character);
    }

    if (character && this.fetchSkillTrees) {
      character = await this.populateSkillTrees(character);
    }

    if (character && this.includeFullImagePath) {
      character = await this.populateFullImagePaths(character);
    }

    console.timeEnd('getByName');
    return character;
  }

  async list(): Promise<Character[]> {
    let characters = await super.list();

    console.time('list');
    if (this.fetchRanks) {
      characters = await Promise.all(characters.map((char) => this.populateRanks(char)));
    }

    if (this.fetchSkills) {
      characters = await Promise.all(characters.map((char) => this.populateSkills(char)));
    }

    if (this.fetchSkillTrees) {
      characters = await Promise.all(characters.map((char) => this.populateSkillTrees(char)));
    }

    if (this.includeFullImagePath) {
      characters = await Promise.all(characters.map((char) => this.populateFullImagePaths(char)));
    }
    console.timeEnd('list');

    return characters;
  }

  private getRanksClient(): CharacterRanksClient {
    if (!this.ranksClient) {
      this.ranksClient = new CharacterRanksClient(this.options);
    }

    return this.ranksClient;
  }

  private getSkillsClient(): CharacterSkillsClient {
    if (!this.skillsClient) {
      this.skillsClient = new CharacterSkillsClient(this.options);
    }

    return this.skillsClient;
  }

  private getSkillTreesClient(): CharacterSkillTreesClient {
    if (!this.skillTreesClient) {
      this.skillTreesClient = new CharacterSkillTreesClient(this.options);
    }

    return this.skillTreesClient;
  }

  // Helper method to fetch ranks and add them to the character
  private async populateRanks(character: Character): Promise<Character> {
    if (this.fetchRanks && character.ranks && character.ranks.length > 0) {
      const ranks = await this.getRanksClient().get();

      character._ranks = character.ranks.map((rankId) => ranks[rankId]);
    }

    return character;
  }

  private async populateSkills(character: Character): Promise<Character> {
    if (this.fetchSkills && character.skills && character.skills.length > 0) {
      const skills = await this.getSkillsClient().get();

      character._skills = character.skills.map((skillId) => skills[skillId]);
    }

    return character;
  }

  private async populateSkillTrees(character: Character): Promise<Character> {
    if (this.fetchSkillTrees && character.skill_trees && character.skill_trees.length > 0) {
      const skillTrees = await this.getSkillTreesClient().get();

      character._skill_trees = character.skill_trees.map((skillTreeId) => skillTrees[skillTreeId]);
    }

    return character;
  }

  private async populateFullImagePaths(character: Character): Promise<Character> {
    utils.updateImagePaths(character, this.options?.assetUrl);
    return character;
  }
}
