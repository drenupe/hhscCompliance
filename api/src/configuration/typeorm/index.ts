import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import development from './development';
import production from './production';
import staging from './staging';

const env = process.env.NODE_ENV || 'development';

const configs: Record<string, TypeOrmModuleOptions> = {
  development,
  staging,
  production,
};

export default configs[env];
