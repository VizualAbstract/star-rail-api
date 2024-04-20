import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Item } from '@/types';

export class ItemsQuery extends QueryBuilder<Item> {
  private includeImagePaths: boolean = false;

  constructor(config?: Config) {
    super({ ...config, resource: Resources.items });

    this.config = { ...config, resource: Resources.items };
  }

  withImages(): ItemsQuery {
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
