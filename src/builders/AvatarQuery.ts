import QueryBuilder, { Config, QueryOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Avatar } from '@/types';

export class AvatarQuery extends QueryBuilder<Avatar> {
  protected options: QueryOptions = {
    withImages: false,
  };

  constructor(config?: Config) {
    super({ ...config, resource: Resources.avatars });
  }

  async get(): Promise<Record<string, Avatar>> {
    const avatars = await this.list();

    return Object.fromEntries(avatars.map((a) => [a.id, a]));
  }

  async list(): Promise<Avatar[]> {
    let avatars = await super.list();

    if (this.options.withImages) {
      avatars = await super.populateImages(avatars);
    }

    return avatars;
  }

  async getByID(id: string | number): Promise<Avatar> {
    const avatar = await super.getByID(id);
    let avatars = [avatar];

    if (this.options.withImages) {
      avatars = await super.populateImages(avatars);
    }

    return avatars[0];
  }

  async getByName(name: string): Promise<Avatar | undefined> {
    const allAvatars = await super.list();
    const avatar = allAvatars.find((a) => a.name === name);

    if (!avatar) {
      return;
    }

    let avatars = [avatar];

    if (this.options.withImages) {
      avatars = await super.populateImages(avatars);
    }

    return avatars[0];
  }

  withImages(): AvatarQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): AvatarQuery {
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
