CREATE TABLE IF NOT EXISTS "fixed_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_date" date NOT NULL,
	"asset_name" varchar(200) NOT NULL,
	"asset_type" varchar(20) NOT NULL,
	"account_code" varchar(20) NOT NULL,
	"cost" numeric(12, 4) NOT NULL,
	"vat_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"total_cost" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"useful_life_years" integer DEFAULT 5,
	"description" varchar(300) NOT NULL,
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
