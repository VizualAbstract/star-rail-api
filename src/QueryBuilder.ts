import Axios, { AxiosResponse } from 'axios';
import { AxiosCacheInstance, buildWebStorage, setupCache } from 'axios-cache-interceptor';
import { ASSET_URL, BASE_URL } from '@/constants';
import { Languages, Resources } from '@/enum';
import utils from '@/utils';

export type Config = {
  baseUrl?: string;
  assetUrl?: string;
  cache?: AxiosCacheInstance;
  language?: Languages;
  resource?: Resources;
};

/**
 * Base class for all clients.
 * @template T - Type of the data to be fetched.
 * @class QueryBuilder
 * @abstract
 * @example
 * class MyClient extends QueryBuilder<MyData> {
 *  constructor(config?: Config) {
 *   super(config);
 * }
 * }
 * const client = new MyClient();
 * client.get().then(data => console.log(data));
 * client.list().then(data => console.log(data));
 * client.getByID('1').then(data => console.log(data));
 * @see
 *
 * @param {Config} [config] - Options for the client.
 * @param {string} [config.baseUrl] - Base URL for the client.
 * @param {string} [config.assetUrl] - Asset URL for the client.
 * @param {AxiosCacheInstance} [config.cache] - Axios cache instance.
 * @param {Languages} [config.language] - Language for the client.
 * @param {Resources} [config.resource] - Resource for the client.
 * @returns {void}
 *
 * Retrieval methods
 * @method get - Get all data.
 * @method list - List all data.
 * @method getByID - Get data by ID.
 *
 */
abstract class QueryBuilder<T> {
  protected config: Config;
  protected baseUrl: string;
  protected assetUrl: string;
  protected resource?: Resources;
  protected language: Languages;

  protected client: AxiosCacheInstance;

  constructor(config?: Config) {
    const { baseUrl, assetUrl, language, resource } = config || {};
    this.baseUrl = baseUrl || BASE_URL;
    this.assetUrl = assetUrl || ASSET_URL;
    this.language = language || Languages.english;
    this.resource = resource;
    this.config = config || {};

    const axiosClient = Axios.create({
      baseURL: this.baseUrl,
    });

    this.client = setupCache(axiosClient, {
      ttl: 1000 * 60 * 6,
      cacheTakeover: false,
      storage: buildWebStorage(localStorage, 'HSR-Client_'),
      ...(config?.cache || {}),
    });
  }

  protected async fetchData(): Promise<AxiosResponse<Record<string, T>>> {
    if (!this.resource) {
      throw new Error('Resource not defined.');
    }
    const fetchURL = `${this.baseUrl}/${this.language}/${this.resource}.json`;
    return this.client.get<Record<string, T>>(fetchURL);
  }

  async get(): Promise<Record<string, T>> {
    const data = await this.fetchData();
    return data.data;
  }

  async list(): Promise<T[]> {
    const data = await this.fetchData();
    return Object.values(data.data);
  }

  async getByID(id: string | number): Promise<T> {
    const data = await this.fetchData();
    const item = data.data[`${id}`];
    if (!item) {
      throw new Error(`${this.resource} with ID '${id}' not found.`);
    }
    return item;
  }

  async injectImagePaths(obj: T): Promise<T> {
    utils.updateImagePaths(obj, this.config?.assetUrl);
    return obj;
  }
}

export default QueryBuilder;
