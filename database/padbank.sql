-- PadBank V1 database schema
-- Import into MySQL (e.g. via XAMPP/phpMyAdmin or `mysql -u root -p < padbank.sql`)

CREATE DATABASE IF NOT EXISTS padbank
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE padbank;

-- ─────────────────────────────────────────────
-- users — login accounts for staff/admins
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- ladies — beneficiary records
-- ─────────────────────────────────────────────
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

-- ─────────────────────────────────────────────
-- pad_stock — every stock intake (donations, purchases, initial stock)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pad_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ─────────────────────────────────────────────
-- pad_distribution — every hand-out of pads to a lady
-- ─────────────────────────────────────────────
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
