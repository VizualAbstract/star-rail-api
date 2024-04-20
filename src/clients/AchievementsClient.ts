import QueryBuilder, { ClientOptions } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Achievement } from '@/types';

export class AchievementsClient extends QueryBuilder<Achievement> {
  constructor(options?: ClientOptions) {
    super({ ...options, resource: Resources.achievements });

    this.options = { ...options, resource: Resources.achievements };
  }

  async getByTitle(title: string): Promise<Achievement | undefined> {
    const achievements = await this.list();
    const achievement = achievements.find((achievement) => achievement.title === title);

    if (!achievement) {
      return achievement;
    }

    return achievement;
  }
}
