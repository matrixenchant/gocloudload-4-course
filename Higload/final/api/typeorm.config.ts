const DataSource = require('typeorm').DataSource;

module.exports = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'highload-final',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
});

/*
Generate Migrations
./node_modules/.bin/typeorm migration:generate ./migrations -d ./typeorm.config.ts

Create Migration
./node_modules/.bin/typeorm migration:create ./migrations -d ./typeorm.config.ts
*/