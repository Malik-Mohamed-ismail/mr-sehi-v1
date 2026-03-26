ALTER TABLE "fixed_assets" ADD COLUMN "accumulated_depreciation" numeric(12, 4) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "fixed_assets" ADD COLUMN "last_depreciation_date" date;