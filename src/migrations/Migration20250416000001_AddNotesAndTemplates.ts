import { Migration } from '@mikro-orm/migrations';

export class Migration20250416000001 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "crm_customer_note" ("id" text not null, "customer_id" text not null, "content" text not null, "created_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_customer_note_pkey" primary key ("id"), constraint "crm_customer_note_customer_id_fk" foreign key ("customer_id") references "crm_customer" ("id") on delete cascade);`);
    
    this.addSql(`create table if not exists "crm_email_template" ("id" text not null, "name" text not null, "subject" text not null, "body" text not null, "category" text null, "variables" jsonb null, "is_default" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_email_template_pkey" primary key ("id"));`);
    
    this.addSql(`create index "idx_crm_customer_note_customer_id" on "crm_customer_note" ("customer_id");`);
    this.addSql(`create index "idx_crm_email_template_category" on "crm_email_template" ("category");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "idx_crm_email_template_category";`);
    this.addSql(`drop index if exists "idx_crm_customer_note_customer_id";`);
    this.addSql(`drop table if exists "crm_email_template" cascade;`);
    this.addSql(`drop table if exists "crm_customer_note" cascade;`);
  }

}
