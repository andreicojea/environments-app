CREATE TABLE IF NOT EXISTS "environments-app_environment" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"reserved_by" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "environments-app_environment_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments-app_environment" ADD CONSTRAINT "environments-app_environment_reserved_by_environments-app_user_id_fk" FOREIGN KEY ("reserved_by") REFERENCES "public"."environments-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments-app_environment" ADD CONSTRAINT "environments-app_environment_created_by_environments-app_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."environments-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
