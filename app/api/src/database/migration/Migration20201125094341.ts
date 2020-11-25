import { Migration } from '@mikro-orm/migrations';

export class Migration20201125094341 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "email" varchar(255) not null, "is_active" bool not null default true, "password_hash" varchar(255) not null, "current_refresh_token_hash" varchar(255) null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");',
    );
    this.addSql(
      'alter table "user" add constraint "user_name_unique" unique ("name");',
    );
  }
}
