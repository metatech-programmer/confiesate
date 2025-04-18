-- CreateTriggers
DROP TRIGGER IF EXISTS publication_report_trigger ON "reports";
DROP FUNCTION IF EXISTS check_report_count();
DROP TRIGGER IF EXISTS new_anonymous_user_trigger ON "users";
DROP FUNCTION IF EXISTS generate_anonymous_name();

CREATE OR REPLACE FUNCTION check_report_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM "reports"
        WHERE "publication_uuid" = NEW."publication_uuid"
    ) >= 20 THEN
        UPDATE "publications"
        SET "status" = 'flagged'
        WHERE "uuid" = NEW."publication_uuid"
        AND "status" = 'active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER publication_report_trigger
AFTER INSERT ON "reports"
FOR EACH ROW
EXECUTE FUNCTION check_report_count();

CREATE OR REPLACE FUNCTION generate_anonymous_name()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(REGEXP_REPLACE("name", 'Anónimo ', '') AS INTEGER)), 0) + 1
    INTO next_number
    FROM "users"
    WHERE "name" LIKE 'Anónimo %';
    
    NEW."name" := 'Anónimo ' || next_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_anonymous_user_trigger
BEFORE INSERT ON "users"
FOR EACH ROW
WHEN (NEW."name" IS NULL)
EXECUTE FUNCTION generate_anonymous_name();
