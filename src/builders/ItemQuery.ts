import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Item } from '@/types';

export class ItemQuery extends QueryBuilder<Item> {
  protected options: QueryOptions = {
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.items });
  }

  async get(): Promise<Record<string, Item>> {
    const items = await this.list();

    return Object.fromEntries(items.map((i) => [i.id, i]));
  }

  async list(): Promise<Item[]> {
    let items = await super.list();

    if (this.options.withImages) {
      items = await super.injectImagePaths(items);
    }

    return items;
  }

  async getByID(id: string | number): Promise<Item> {
    const item = await super.getByID(id);
    let items = [item];

    if (this.options.withImages) {
      items = await super.injectImagePaths(items);
    }

    return items[0];
  }

  async getByName(name: string): Promise<Item | undefined> {
    const items = await this.list();
    const item = items.find((i) => i.name === name);

    return item;
  }

  withImages(): ItemQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): ItemQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((key) => {
      if (options[key]) {
        switch (key) {
          case 'withImages':
            this.withImages();
            break;
        }
      }
    });

    return this;
  }
}
