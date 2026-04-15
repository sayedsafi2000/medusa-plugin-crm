import { Migration } from "@mikro-orm/migrations"

export class Migration20250101000000_InitCRM extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "customer_note" ("id" text not null, "customer_id" text not null, "order_id" text null, "note" text not null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_note_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_note_customer_id" on "customer_note" ("customer_id");')
    this.addSql('create index if not exists "IDX_customer_note_order_id" on "customer_note" ("order_id");')
    this.addSql('create index if not exists "IDX_customer_note_created_at" on "customer_note" ("created_at");')

    this.addSql('create table if not exists "customer_task" ("id" text not null, "customer_id" text not null, "order_id" text null, "title" text not null, "description" text null, "status" text not null, "priority" text not null, "due_date" timestamptz null, "assigned_to" text null, "completed_at" timestamptz null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_task_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_task_customer_id" on "customer_task" ("customer_id");')
    this.addSql('create index if not exists "IDX_customer_task_order_id" on "customer_task" ("order_id");')
    this.addSql('create index if not exists "IDX_customer_task_status" on "customer_task" ("status");')
    this.addSql('create index if not exists "IDX_customer_task_priority" on "customer_task" ("priority");')

    this.addSql('create table if not exists "customer_activity" ("id" text not null, "customer_id" text not null, "order_id" text null, "activity_type" text not null, "severity" text null, "data" jsonb null, "created_at" timestamptz not null default now(), constraint "customer_activity_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_activity_customer_id" on "customer_activity" ("customer_id");')
    this.addSql('create index if not exists "IDX_customer_activity_order_id" on "customer_activity" ("order_id");')
    this.addSql('create index if not exists "IDX_customer_activity_activity_type" on "customer_activity" ("activity_type");')
    this.addSql('create index if not exists "IDX_customer_activity_created_at" on "customer_activity" ("created_at");')

    this.addSql('create table if not exists "customer_segment" ("id" text not null, "name" text not null, "description" text null, "is_dynamic" boolean not null default true, "criteria" jsonb not null, "customer_count" integer not null default 0, "refresh_interval" text null, "last_refreshed_at" timestamptz null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_segment_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_segment_is_dynamic" on "customer_segment" ("is_dynamic");')

    this.addSql('create table if not exists "customer_tag" ("id" text not null, "name" text not null, "color" text null, "customer_count" integer not null default 0, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_tag_pkey" primary key ("id"));')

    this.addSql('create table if not exists "customer_tag_assignment" ("id" text not null, "customer_id" text not null, "tag_id" text not null, "assigned_by" text not null, "assigned_at" timestamptz not null default now(), constraint "customer_tag_assignment_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_tag_assignment_customer_id" on "customer_tag_assignment" ("customer_id");')
    this.addSql('create index if not exists "IDX_customer_tag_assignment_tag_id" on "customer_tag_assignment" ("tag_id");')
    this.addSql('create unique index if not exists "IDX_customer_tag_assignment_unique" on "customer_tag_assignment" ("customer_id", "tag_id");')

    this.addSql('create table if not exists "customer_segment_assignment" ("id" text not null, "customer_id" text not null, "segment_id" text not null, "assigned_at" timestamptz not null default now(), constraint "customer_segment_assignment_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_customer_segment_assignment_customer_id" on "customer_segment_assignment" ("customer_id");')
    this.addSql('create index if not exists "IDX_customer_segment_assignment_segment_id" on "customer_segment_assignment" ("segment_id");')
    this.addSql('create unique index if not exists "IDX_customer_segment_assignment_unique" on "customer_segment_assignment" ("customer_id", "segment_id");')

    this.addSql('create table if not exists "lead" ("id" text not null, "customer_id" text null, "contact_name" text not null, "contact_email" text not null, "contact_phone" text null, "company" text null, "source" text not null, "stage" text not null, "estimated_value" numeric null, "probability" integer not null default 0, "expected_close_date" timestamptz null, "assigned_to" text null, "notes" text null, "lost_reason" text null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lead_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_lead_customer_id" on "lead" ("customer_id");')
    this.addSql('create index if not exists "IDX_lead_stage" on "lead" ("stage");')
    this.addSql('create index if not exists "IDX_lead_assigned_to" on "lead" ("assigned_to");')

    this.addSql('create table if not exists "communication_log" ("id" text not null, "customer_id" text not null, "lead_id" text null, "type" text not null, "direction" text not null, "subject" text null, "message" text not null, "recipient" text not null, "sender" text not null, "status" text not null, "sent_at" timestamptz null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "communication_log_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_communication_log_customer_id" on "communication_log" ("customer_id");')
    this.addSql('create index if not exists "IDX_communication_log_lead_id" on "communication_log" ("lead_id");')
    this.addSql('create index if not exists "IDX_communication_log_type" on "communication_log" ("type");')
    this.addSql('create index if not exists "IDX_communication_log_status" on "communication_log" ("status");')

    this.addSql('create table if not exists "campaign" ("id" text not null, "name" text not null, "description" text null, "type" text not null, "status" text not null, "segment_id" text null, "scheduled_at" timestamptz null, "started_at" timestamptz null, "completed_at" timestamptz null, "total_recipients" integer not null default 0, "sent_count" integer not null default 0, "delivered_count" integer not null default 0, "opened_count" integer not null default 0, "clicked_count" integer not null default 0, "converted_count" integer not null default 0, "failed_count" integer not null default 0, "bounced_count" integer not null default 0, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "campaign_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_campaign_status" on "campaign" ("status");')
    this.addSql('create index if not exists "IDX_campaign_type" on "campaign" ("type");')

    this.addSql('create table if not exists "automation" ("id" text not null, "name" text not null, "description" text null, "type" text not null, "trigger_event" text not null, "trigger_conditions" jsonb null, "actions" jsonb not null, "status" text not null, "segment_id" text null, "schedule" jsonb null, "last_run_at" timestamptz null, "next_run_at" timestamptz null, "run_count" integer not null default 0, "success_count" integer not null default 0, "failure_count" integer not null default 0, "max_retries" integer not null default 3, "retry_count" integer not null default 0, "last_error" text null, "created_by" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "automation_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_automation_status" on "automation" ("status");')
    this.addSql('create index if not exists "IDX_automation_type" on "automation" ("type");')

    this.addSql('create table if not exists "crm_notification" ("id" text not null, "recipient_id" text not null, "type" text not null, "title" text not null, "message" text not null, "severity" text not null, "is_read" boolean not null default false, "reference_type" text null, "reference_id" text null, "created_at" timestamptz not null default now(), "read_at" timestamptz null, constraint "crm_notification_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_crm_notification_recipient_id" on "crm_notification" ("recipient_id");')
    this.addSql('create index if not exists "IDX_crm_notification_is_read" on "crm_notification" ("is_read");')
    this.addSql('create index if not exists "IDX_crm_notification_severity" on "crm_notification" ("severity");')

    this.addSql('create table if not exists "crm_setting" ("id" text not null, "key" text not null, "value" jsonb not null, "category" text not null, "description" text null, "is_secret" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_setting_pkey" primary key ("id"));')
    this.addSql('create unique index if not exists "IDX_crm_setting_key" on "crm_setting" ("key");')

    this.addSql('create table if not exists "crm_error_log" ("id" text not null, "source" text not null, "error_code" text null, "message" text not null, "stack_trace" text null, "reference_type" text null, "reference_id" text null, "status" text not null, "retry_count" integer not null default 0, "max_retries" integer not null default 3, "last_retry_at" timestamptz null, "resolved_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_error_log_pkey" primary key ("id"));')
    this.addSql('create index if not exists "IDX_crm_error_log_source" on "crm_error_log" ("source");')
    this.addSql('create index if not exists "IDX_crm_error_log_status" on "crm_error_log" ("status");')

    this.addSql('create table if not exists "crm_role" ("id" text not null, "name" text not null, "label" text not null, "permissions" jsonb not null, "is_default" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "crm_role_pkey" primary key ("id"));')
    this.addSql('create unique index if not exists "IDX_crm_role_name" on "crm_role" ("name");')
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "crm_role" cascade;')
    this.addSql('drop table if exists "crm_error_log" cascade;')
    this.addSql('drop table if exists "crm_setting" cascade;')
    this.addSql('drop table if exists "crm_notification" cascade;')
    this.addSql('drop table if exists "automation" cascade;')
    this.addSql('drop table if exists "campaign" cascade;')
    this.addSql('drop table if exists "communication_log" cascade;')
    this.addSql('drop table if exists "lead" cascade;')
    this.addSql('drop table if exists "customer_segment_assignment" cascade;')
    this.addSql('drop table if exists "customer_tag_assignment" cascade;')
    this.addSql('drop table if exists "customer_tag" cascade;')
    this.addSql('drop table if exists "customer_segment" cascade;')
    this.addSql('drop table if exists "customer_activity" cascade;')
    this.addSql('drop table if exists "customer_task" cascade;')
    this.addSql('drop table if exists "customer_note" cascade;')
  }

}
