CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name_ar" varchar(150) NOT NULL,
	"name_en" varchar(150),
	"type" varchar(20) NOT NULL,
	"parent_code" varchar(20),
	"level" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"is_system" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "accounts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(20) NOT NULL,
	"table_name" varchar(50) NOT NULL,
	"record_id" integer,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_date" date NOT NULL,
	"account_code" varchar(20) NOT NULL,
	"expense_type" varchar(20) NOT NULL,
	"description" varchar(300) NOT NULL,
	"amount" numeric(12, 4) NOT NULL,
	"vat_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"total_amount" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"category" varchar(100),
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password_hash" varchar(200) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"role" varchar(20) DEFAULT 'cashier' NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"token_hash" varchar(200) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vat_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"total_vat_input" numeric(12, 4),
	"total_vat_output" numeric(12, 4),
	"net_vat_payable" numeric(12, 4),
	"status" varchar(20) DEFAULT 'draft',
	"filed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_ar" varchar(150) NOT NULL,
	"name_en" varchar(150),
	"vat_number" varchar(30),
	"phone" varchar(20),
	"email" varchar(150),
	"category" varchar(50),
	"is_active" boolean DEFAULT true,
	"notes" varchar(500),
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_number" varchar(20) NOT NULL,
	"entry_date" date NOT NULL,
	"description" text NOT NULL,
	"reference" varchar(100),
	"source_type" varchar(30) NOT NULL,
	"source_id" integer,
	"is_balanced" boolean DEFAULT false,
	"is_reversed" boolean DEFAULT false,
	"reversed_by" integer,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "journal_entries_entry_number_unique" UNIQUE("entry_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_entry_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer NOT NULL,
	"account_code" varchar(20) NOT NULL,
	"debit_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"credit_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchase_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"invoice_date" date NOT NULL,
	"supplier_id" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"item_name" varchar(200) NOT NULL,
	"quantity" numeric(10, 3) DEFAULT '1' NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"discount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"subtotal" numeric(12, 4) NOT NULL,
	"vat_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"total_amount" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"is_asset" boolean DEFAULT false,
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "delivery_revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_date" date NOT NULL,
	"platform" varchar(30) NOT NULL,
	"gross_amount" numeric(12, 4) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0' NOT NULL,
	"commission_amount" numeric(12, 4) DEFAULT '0' NOT NULL,
	"net_amount" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_date" date NOT NULL,
	"amount" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"covers" integer,
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription_revenue" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_date" date NOT NULL,
	"subscriber_id" integer,
	"amount" numeric(12, 4) NOT NULL,
	"payment_method" varchar(10) NOT NULL,
	"notes" text,
	"journal_entry_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"phone" varchar(20),
	"plan_name" varchar(100),
	"plan_amount" numeric(12, 4) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"payment_method" varchar(10),
	"notes" text,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "petty_cash" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_date" date NOT NULL,
	"opening_balance" numeric(12, 4) DEFAULT '0' NOT NULL,
	"cashier_replenishment" numeric(12, 4) DEFAULT '0' NOT NULL,
	"cash_purchases" numeric(12, 4) DEFAULT '0' NOT NULL,
	"card_purchases" numeric(12, 4) DEFAULT '0' NOT NULL,
	"closing_balance" numeric(12, 4) NOT NULL,
	"variance" numeric(12, 4) DEFAULT '0' NOT NULL,
	"is_balanced" boolean DEFAULT false,
	"notes" text,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "production" (
	"id" serial PRIMARY KEY NOT NULL,
	"production_date" date NOT NULL,
	"product_name" varchar(150) NOT NULL,
	"produced_kg" numeric(10, 3) NOT NULL,
	"waste_grams" numeric(10, 3) DEFAULT '0' NOT NULL,
	"waste_value" numeric(12, 4) DEFAULT '0' NOT NULL,
	"unit_cost" numeric(12, 4),
	"notes" text,
	"is_deleted" boolean DEFAULT false,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "journal_entry_lines_entry_id_journal_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "delivery_revenue" ADD CONSTRAINT "delivery_revenue_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "delivery_revenue" ADD CONSTRAINT "delivery_revenue_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_revenue" ADD CONSTRAINT "restaurant_revenue_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_revenue" ADD CONSTRAINT "restaurant_revenue_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription_revenue" ADD CONSTRAINT "subscription_revenue_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription_revenue" ADD CONSTRAINT "subscription_revenue_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "petty_cash" ADD CONSTRAINT "petty_cash_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "production" ADD CONSTRAINT "production_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
