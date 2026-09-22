-- Adds marital status + father's/husband's name to an existing ladies table.
-- Safe to run once against a database created from an earlier version of
-- database/padbank.sql or padbank_hosted.sql.

ALTER TABLE ladies
    ADD COLUMN marital_status ENUM('MARRIED', 'UNMARRIED') NULL AFTER name,
    ADD COLUMN father_name VARCHAR(150) NULL AFTER marital_status,
    ADD COLUMN husband_name VARCHAR(150) NULL AFTER father_name;
