import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Achievement } from '@/types';

export class AchievementQuery extends QueryBuilder<Achievement> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.achievements });
  }

  async getByTitle(title: string): Promise<Achievement | undefined> {
    const achievements = await super.list();
    const achievement = achievements.find((achievement) => achievement.title === title);

    return achievement;
  }
}
