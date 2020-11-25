import { MikroORM } from '@mikro-orm/core';
import { configService } from '../../config/config.service';

(async () => {
  const orm = await MikroORM.init({
    ...configService.getMikroOrmConfig(),
  });

  const migrator = orm.getMigrator();

  await migrator.up();

  await orm.close(true);
})();
