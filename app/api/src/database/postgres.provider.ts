import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

export const postgresProvider = MikroOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    ...config.getMikroOrmConfig(),
  }),
});
