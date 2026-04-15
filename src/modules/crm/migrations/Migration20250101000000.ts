import { Migration } from '@mikro-orm/migrations';

export class Migration20250101000000 extends Migration {

  override async up(): Promise<void> {
    // Customer notes table
    this.addSql(`create table if not exists "customer_note" ("id" text not null, "customer_id" text null, "order_id" text null, "note" text null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_note_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_note_deleted_at" ON "customer_note" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_note_customer_id" ON "customer_note" (customer_id) WHERE deleted_at IS NULL;`);

    // Customer tasks table
    this.addSql(`create table if not exists "customer_task" ("id" text not null, "customer_id" text null, "order_id" text null, "title" text null, "description" text null, "status" text not null default 'pending', "priority" text not null default 'medium', "due_date" timestamptz null, "assigned_to" text null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_task_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_task_deleted_at" ON "customer_task" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_task_customer_id" ON "customer_task" (customer_id) WHERE deleted_at IS NULL;`);

    // Customer activities table
    this.addSql(`create table if not exists "customer_activity" ("id" text not null, "customer_id" text null, "order_id" text null, "activity_type" text not null, "activity_data" jsonb null, "severity" text not null default 'info', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_activity_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_activity_deleted_at" ON "customer_activity" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_activity_customer_id" ON "customer_activity" (customer_id) WHERE deleted_at IS NULL;`);

    // Customer segments table
    this.addSql(`create table if not exists "customer_segment" ("id" text not null, "name" text null, "description" text null, "criteria" jsonb null, "customer_count" integer not null default 0, "is_dynamic" boolean not null default false, "refresh_interval" text not null default 'never', "last_refreshed_at" timestamptz null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_segment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_segment_deleted_at" ON "customer_segment" (deleted_at) WHERE deleted_at IS NULL;`);

    // Customer tags table
    this.addSql(`create table if not exists "customer_tag" ("id" text not null, "name" text not null, "color" text null, "customer_count" integer not null default 0, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_tag_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_tag_deleted_at" ON "customer_tag" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_tag_name" ON "customer_tag" (name) WHERE deleted_at IS NULL;`);

    // Customer tag assignments table
    this.addSql(`create table if not exists "customer_tag_assignment" ("id" text not null, "customer_id" text null, "tag_id" text null, "assigned_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_tag_assignment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_tag_assignment_deleted_at" ON "customer_tag_assignment" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_tag_assignment_customer_id" ON "customer_tag_assignment" (customer_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_tag_assignment_tag_id" ON "customer_tag_assignment" (tag_id) WHERE deleted_at IS NULL;`);

    // Customer segment assignments table
    this.addSql(`create table if not exists "customer_segment_assignment" ("id" text not null, "customer_id" text null, "segment_id" text null, "assigned_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_segment_assignment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_segment_assignment_deleted_at" ON "customer_segment_assignment" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_segment_assignment_customer_id" ON "customer_segment_assignment" (customer_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_segment_assignment_segment_id" ON "customer_segment_assignment" (segment_id) WHERE deleted_at IS NULL;`);

    // Leads table
    this.addSql(`create table if not exists "lead" ("id" text not null, "customer_id" text null, "contact_name" text null, "contact_email" text null, "contact_phone" text null, "company" text null, "source" text not null default 'other', "stage" text not null default 'new', "estimated_value" numeric null, "probability" numeric not null default 0, "expected_close_date" timestamptz null, "assigned_to" text null, "notes" text null, "lost_reason" text null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lead_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lead_deleted_at" ON "lead" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lead_customer_id" ON "lead" (customer_id) WHERE deleted_at IS NULL;`);

    // Communication logs table
    this.addSql(`create table if not exists "communication_log" ("id" text not null, "customer_id" text null, "lead_id" text null, "type" text not null default 'email', "direction" text not null default 'outbound', "subject" text null, "message" text null, "recipient" text null, "sender" text null, "status" text not null default 'pending', "sent_at" timestamptz null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "communication_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_communication_log_deleted_at" ON "communication_log" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_communication_log_customer_id" ON "communication_log" (customer_id) WHERE deleted_at IS NULL;`);

    // Campaigns table
    this.addSql(`create table if not exists "crm_campaign" ("id" text not null, "name" text null, "description" text null, "type" text not null default 'email', "status" text not null default 'draft', "segment_id" text null, "target_audience" jsonb null, "scheduled_at" timestamptz null, "started_at" timestamptz null, "completed_at" timestamptz null, "total_recipients" integer not null default 0, "sent_count" integer not null default 0, "delivered_count" integer not null default 0, "opened_count" integer not null default 0, "clicked_count" integer not null default 0, "converted_count" integer not null default 0, "failed_count" integer not null default 0, "bounced_count" integer not null default 0, "template" jsonb null, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crm_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_campaign_deleted_at" ON "crm_campaign" (deleted_at) WHERE deleted_at IS NULL;`);

    // Automations table
    this.addSql(`create table if not exists "automation" ("id" text not null, "name" text null, "description" text null, "type" text not null default 'custom', "trigger_event" text null, "trigger_conditions" jsonb null, "actions" jsonb null, "status" text not null default 'active', "is_active" boolean not null default true, "segment_id" text null, "schedule" jsonb null, "max_retries" integer not null default 3, "retry_count" integer not null default 0, "last_run_at" timestamptz null, "next_run_at" timestamptz null, "last_error" text null, "run_count" integer not null default 0, "success_count" integer not null default 0, "failure_count" integer not null default 0, "created_by" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "automation_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_automation_deleted_at" ON "automation" (deleted_at) WHERE deleted_at IS NULL;`);

    // Notifications table
    this.addSql(`create table if not exists "crm_notification" ("id" text not null, "recipient_id" text null, "recipient_type" text not null default 'admin', "type" text not null default 'custom', "title" text null, "message" text null, "severity" text not null default 'info', "is_read" boolean not null default false, "read_at" timestamptz null, "reference_type" text null, "reference_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crm_notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_notification_deleted_at" ON "crm_notification" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_notification_recipient_id" ON "crm_notification" (recipient_id) WHERE deleted_at IS NULL;`);

    // CRM settings table
    this.addSql(`create table if not exists "crm_setting" ("id" text not null, "key" text not null, "value" jsonb null, "category" text not null default 'general', "description" text null, "is_secret" boolean not null default false, "updated_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crm_setting_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_setting_deleted_at" ON "crm_setting" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_crm_setting_key" ON "crm_setting" (key) WHERE deleted_at IS NULL;`);

    // Error logs table
    this.addSql(`create table if not exists "crm_error_log" ("id" text not null, "source" text not null default 'other', "error_code" text null, "error_message" text null, "stack_trace" text null, "reference_type" text null, "reference_id" text null, "request_data" jsonb null, "retry_count" integer not null default 0, "max_retries" integer not null default 3, "status" text not null default 'pending', "resolved_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crm_error_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_error_log_deleted_at" ON "crm_error_log" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_error_log_status" ON "crm_error_log" (status) WHERE deleted_at IS NULL;`);

    // CRM roles table
    this.addSql(`create table if not exists "crm_role" ("id" text not null, "name" text not null, "label" text null, "permissions" jsonb null, "is_default" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "crm_role_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_crm_role_deleted_at" ON "crm_role" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_crm_role_name" ON "crm_role" (name) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_note" cascade;`);
    this.addSql(`drop table if exists "customer_task" cascade;`);
    this.addSql(`drop table if exists "customer_activity" cascade;`);
    this.addSql(`drop table if exists "customer_segment" cascade;`);
    this.addSql(`drop table if exists "customer_tag" cascade;`);
    this.addSql(`drop table if exists "customer_tag_assignment" cascade;`);
    this.addSql(`drop table if exists "customer_segment_assignment" cascade;`);
    this.addSql(`drop table if exists "lead" cascade;`);
    this.addSql(`drop table if exists "communication_log" cascade;`);
    this.addSql(`drop table if exists "crm_campaign" cascade;`);
    this.addSql(`drop table if exists "automation" cascade;`);
    this.addSql(`drop table if exists "crm_notification" cascade;`);
    this.addSql(`drop table if exists "crm_setting" cascade;`);
    this.addSql(`drop table if exists "crm_error_log" cascade;`);
    this.addSql(`drop table if exists "crm_role" cascade;`);
  }

}
