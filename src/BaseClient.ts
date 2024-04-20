import Axios, { AxiosResponse } from 'axios';
import { AxiosCacheInstance, buildWebStorage, setupCache } from 'axios-cache-interceptor';
import { ASSET_URL, BASE_URL } from '@/constants';
import { Languages, Resources } from '@/enum';
import utils from '@/utils';

export type ClientOptions = {
  baseUrl?: string;
  assetUrl?: string;
  cache?: AxiosCacheInstance;
  language?: Languages;
  resource?: Resources;
};

/**
 * Base class for all clients.
 * @template T - Type of the data to be fetched.
 * @class BaseClient
 * @abstract
 * @example
 * class MyClient extends BaseClient<MyData> {
 *  constructor(options?: ClientOptions) {
 *   super(options);
 * }
 * }
 * const client = new MyClient();
 * client.get().then(data => console.log(data));
 * client.list().then(data => console.log(data));
 * client.getByID('1').then(data => console.log(data));
 * @see
 *
 * @param {ClientOptions} [options] - Options for the client.
 * @param {string} [options.baseUrl] - Base URL for the client.
 * @param {string} [options.assetUrl] - Asset URL for the client.
 * @param {AxiosCacheInstance} [options.cache] - Axios cache instance.
 * @param {Languages} [options.language] - Language for the client.
 * @param {Resources} [options.resource] - Resource for the client.
 * @returns {void}
 *
 * Retrieval methods
 * @method get - Get all data.
 * @method list - List all data.
 * @method getByID - Get data by ID.
 *
 */
abstract class BaseClient<T> {
  protected options: ClientOptions;
  protected baseUrl: string;
  protected assetUrl: string;
  protected resource?: Resources;
  protected language: Languages;

  protected client: AxiosCacheInstance;

  constructor(options?: ClientOptions) {
    const { baseUrl, assetUrl, language, resource } = options || {};
    this.baseUrl = baseUrl || BASE_URL;
    this.assetUrl = assetUrl || ASSET_URL;
    this.language = language || Languages.english;
    this.resource = resource;
    this.options = options || {};

    const axiosClient = Axios.create({
      baseURL: this.baseUrl,
    });

    this.client = setupCache(axiosClient, {
      ttl: 1000 * 60 * 6,
      cacheTakeover: false,
      storage: buildWebStorage(localStorage, 'HSR-Client_'),
      ...(options?.cache || {}),
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
    utils.updateImagePaths(obj, this.options?.assetUrl);
    return obj;
  }
}

export default BaseClient;
