import BaseClient, { ClientOptions } from 'BaseClient';
import { Resources } from 'enum';
import { Item } from 'types';

export class ItemsClient extends BaseClient<Item> {
  private includeImagePaths: boolean = false;

  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.items });

    this.options = { ...options, resource: Resources.items };
  }

  withImages(): ItemsClient {
    this.includeImagePaths = true;
    return this;
  }

  async getByID(id: string | number): Promise<Item> {
    let item = await super.getByID(id);

    if (this.includeImagePaths) {
      item = await this.injectImagePaths(item);
    }

    return item;
  }

  async getByName(name: string): Promise<Item | undefined> {
    const items = await this.list();
    let item = items.find((item) => item.name === name);

    if (!item) {
      return item;
    }

    if (item && this.includeImagePaths) {
      item = await this.injectImagePaths(item);
    }

    return item;
  }

  async list(): Promise<Item[]> {
    let items = await super.list();

    if (this.includeImagePaths) {
      items = await Promise.all(items.map((item) => this.injectImagePaths(item)));
    }

    return items;
  }
}
