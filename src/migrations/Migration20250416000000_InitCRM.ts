import { Migration } from '@mikro-orm/migrations';

export class Migration20250416000000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "crm_customer" ("id" text not null, "medusa_customer_id" text not null, "email" text not null, "phone" text null, "name" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_customer_pkey" primary key ("id"));`);
    
    this.addSql(`create table if not exists "crm_lead" ("id" text not null, "email" text not null, "phone" text null, "name" text not null, "title" text not null, "company" text null, "status" text not null default 'new', "description" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_lead_pkey" primary key ("id"));`);
    
    this.addSql(`create table if not exists "crm_task" ("id" text not null, "customer_id" text null, "lead_id" text null, "title" text not null, "description" text null, "status" text not null default 'todo', "priority" text not null default 'normal', "due_date" timestamptz null, "assigned_to" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_task_pkey" primary key ("id"));`);
    
    this.addSql(`create table if not exists "crm_campaign" ("id" text not null, "name" text not null, "description" text null, "channels" jsonb not null, "type" text not null, "status" text not null default 'draft', "template" jsonb not null, "recipients" jsonb null, "schedule" jsonb null, "trigger" jsonb null, "sent_count" int not null default 0, "failed_count" int not null default 0, "sent_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_campaign_pkey" primary key ("id"));`);
    
    this.addSql(`create table if not exists "crm_communication_log" ("id" text not null, "customer_id" text null, "lead_id" text null, "campaign_id" text not null, "channel" text not null, "recipient" text not null, "status" text not null, "subject" text null, "message" text null, "error_message" text null, "sent_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_communication_log_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "crm_communication_log" cascade;`);
    this.addSql(`drop table if exists "crm_campaign" cascade;`);
    this.addSql(`drop table if exists "crm_task" cascade;`);
    this.addSql(`drop table if exists "crm_lead" cascade;`);
    this.addSql(`drop table if exists "crm_customer" cascade;`);
  }

}


