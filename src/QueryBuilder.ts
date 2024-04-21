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

export type QueryOptions = {
  [key: string]: boolean;
};

/**
 * Base class for all builders.
 * @template T - Type of the data to be fetched.
 * @class QueryBuilder
 * @abstract
 * @example
 * class MyQuery extends QueryBuilder<MyData> {
 *  constructor(config?: Config) {
 *   super(config);
 * }
 * }
 * const query = new MyQuery();
 * query.get().then(data => console.log(data));
 * query.list().then(data => console.log(data));
 * query.getByID('1').then(data => console.log(data));
 * @see
 *
 * @param {Config} [config] - Options for the query.
 * @param {string} [config.baseUrl] - Base URL for the query.
 * @param {string} [config.assetUrl] - Asset URL for the query.
 * @param {AxiosCacheInstance} [config.cache] - Axios cache instance.
 * @param {Languages} [config.language] - Language for the query.
 * @param {Resources} [config.resource] - Resource for the query.
 * @returns {void}
 *
 * Retrieval methods
 * @method get - Get all data.
 * @method list - List all data.
 * @method getByID - Get data by ID.
 *
 */
abstract class QueryBuilder<T> {
  protected config: Config = {
    baseUrl: BASE_URL,
    assetUrl: ASSET_URL,
    language: Languages.english,
    resource: undefined,
  };

  protected queryBuilder: AxiosCacheInstance;
  protected options: QueryOptions = {};

  constructor(config?: Config) {
    this.config = { ...this.config, ...config };

    const axiosClient = Axios.create({
      baseURL: this.config.baseUrl,
    });

    this.queryBuilder = setupCache(axiosClient, {
      ttl: 1000 * 60 * 6,
      cacheTakeover: false,
      storage: buildWebStorage(localStorage, 'HSR-Query_'),
      ...(config?.cache || {}),
    });
  }

  protected async fetchData(): Promise<AxiosResponse<Record<string, T>>> {
    if (!this.config.resource) {
      throw new Error('Resource not defined.');
    }
    const fetchURL = `${this.config.baseUrl}/${this.config.language}/${this.config.resource}.json`;
    return this.queryBuilder.get<Record<string, T>>(fetchURL);
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
      throw new Error(`${this.config.resource} with ID '${id}' not found.`);
    }
    return item;
  }

  async injectImagePaths(obj: T[]): Promise<T[]> {
    utils.updateImagePaths(obj, this.config?.assetUrl);
    return obj;
  }
}

export default QueryBuilder;
