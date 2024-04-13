import Axios, { AxiosResponse } from 'axios';
import { AxiosCacheInstance, buildWebStorage, setupCache } from 'axios-cache-interceptor';
import { ASSET_URL, BASE_URL } from './constants';
import { Languages, Resources } from './enum';

export type ClientOptions = {
  baseUrl?: string;
  assetUrl?: string;
  cache?: AxiosCacheInstance;
  language?: Languages;
  resource?: Resources;
};

abstract class BaseClient<T> {
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
}

export default BaseClient;
