import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Avatar } from '@/types';

export class AvatarQuery extends QueryBuilder<Avatar> {
  private includeImagePaths: boolean = false;

  constructor(config?: Config) {
    super({ ...config, resource: Resources.avatars });
  }

  withImages(): AvatarQuery {
    this.includeImagePaths = true;
    return this;
  }

  async getByID(id: string | number): Promise<Avatar> {
    let avatar = await super.getByID(id);

    if (this.includeImagePaths) {
      avatar = await this.injectImagePaths(avatar);
    }

    return avatar;
  }

  async getByName(name: string): Promise<Avatar | undefined> {
    const avatars = await this.list();
    let avatar = avatars.find((avatar) => avatar.name === name);

    if (!avatar) {
      return avatar;
    }

    if (avatar && this.includeImagePaths) {
      avatar = await this.injectImagePaths(avatar);
    }

    return avatar;
  }

  async list(): Promise<Avatar[]> {
    let avatars = await super.list();

    if (this.includeImagePaths) {
      avatars = await Promise.all(avatars.map((avatar) => this.injectImagePaths(avatar)));
    }

    return avatars;
  }
}
