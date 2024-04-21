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

    return Object.fromEntries(avatars.map((avatar) => [avatar.id, avatar]));
  }

  async list(): Promise<Avatar[]> {
    let avatars = await super.list();

    if (this.options.withImages) {
      avatars = await Promise.all(avatars.map((avatar) => super.injectImagePaths(avatar)));
    }

    return avatars;
  }

  async getByID(id: string | number): Promise<Avatar> {
    let avatar = await super.getByID(id);

    if (this.options.withImages) {
      avatar = await super.injectImagePaths(avatar);
    }

    return avatar;
  }

  async getByName(name: string): Promise<Avatar | undefined> {
    const avatars = await this.list();
    let avatar = avatars.find((avatar) => avatar.name === name);

    if (!avatar) {
      return avatar;
    }

    if (this.options.withImages) {
      avatar = await super.injectImagePaths(avatar);
    }

    return avatar;
  }

  withImages(): AvatarQuery {
    this.options.withImages = true;

    return this;
  }

  withOptions(options: QueryOptions): AvatarQuery {
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
