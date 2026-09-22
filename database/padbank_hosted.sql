-- PadBank V1 schema for shared/cPanel hosting.
-- Use this instead of padbank.sql when the database already exists and was
-- provisioned through cPanel (e.g. "MySQL Databases") — cPanel accounts
-- normally can't CREATE DATABASE via SQL, and the db name is whatever
-- cPanel prefixed it with (e.g. vecosiss_padbank), not "padbank".
--
-- Import this with phpMyAdmin's SQL tab while that database is selected,
-- or: mysql -h <host> -u <user> -p <dbname> < padbank_hosted.sql

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ladies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aadhaar VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    marital_status ENUM('MARRIED', 'UNMARRIED'),
    father_name VARCHAR(150),
    husband_name VARCHAR(150),
    mobile VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ladies_name (name)
);

CREATE TABLE IF NOT EXISTS pad_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pad_distribution (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lady_id INT NOT NULL,
    quantity INT NOT NULL,
    distribution_date DATE NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lady_id) REFERENCES ladies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_distribution_lady (lady_id),
    INDEX idx_distribution_date (distribution_date)
);

-- No seed user is inserted here — bcrypt hashes can't be hand-written correctly.
-- After importing this schema, run `npm run seed:admin` from backend/ to create
-- the first admin account with a properly generated password hash.
