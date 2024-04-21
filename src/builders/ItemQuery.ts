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

    return Object.fromEntries(items.map((item) => [item.id, item]));
  }

  async list(): Promise<Item[]> {
    let items = await super.list();

    if (this.options.withImages) {
      items = await Promise.all(items.map((item) => super.injectImagePaths(item)));
    }

    return items;
  }

  async getByID(id: string | number): Promise<Item> {
    let item = await super.getByID(id);

    if (this.options.withImages) {
      item = await super.injectImagePaths(item);
    }

    return item;
  }

  async getByName(name: string): Promise<Item | undefined> {
    const items = await super.list();
    let item = items.find((item) => item.name === name);

    if (!item) {
      return item;
    }

    if (this.options.withImages) {
      item = await super.injectImagePaths(item);
    }

    return item;
  }

  withImages(): ItemQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): ItemQuery {
    this.options = { ...this.options, ...options };

    Object.keys(options).forEach((optionKey) => {
      if (options[optionKey]) {
        switch (optionKey) {
          case 'withImages':
            this.withImages();
            break;
        }
      }
    });

    return this;
  }
}
