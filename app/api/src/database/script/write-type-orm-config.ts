import { configService } from '../../config/config.service';
import * as fs from 'fs';

try {
  fs.unlinkSync('ormconfig.json');
} catch {}
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeORMConfig()),
);
