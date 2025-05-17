-- Job UA Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS job_ua_db;
USE job_ua_db;

-- Create tables

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    photo VARCHAR(255), -- Path to photo file
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    bio TEXT,
    position VARCHAR(255),
    qualification VARCHAR(100),
    english_lvl ENUM('Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Proficient'),
    resume VARCHAR(255), -- Path to resume file
    portfolio VARCHAR(255), -- Path to portfolio file
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table (for employee skills with qualification level)
CREATE TABLE IF NOT EXISTS employee_skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    qualification_level INT NOT NULL CHECK (qualification_level BETWEEN 1 AND 5),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_skill (employee_id, skill_name)
);

-- Goals table for employees
CREATE TABLE IF NOT EXISTS employee_goal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    goal_description TEXT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Past projects for employees
CREATE TABLE IF NOT EXISTS past_project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Past roles for employees (linked to projects)
CREATE TABLE IF NOT EXISTS past_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    role_description TEXT,
    FOREIGN KEY (project_id) REFERENCES past_project(id) ON DELETE CASCADE
);

-- Employment types for employees (many-to-many)
CREATE TABLE IF NOT EXISTS employment_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Employee employment type preferences (many-to-many)
CREATE TABLE IF NOT EXISTS employee_employment_type (
    employee_id INT NOT NULL,
    employment_type_id INT NOT NULL,
    PRIMARY KEY (employee_id, employment_type_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (employment_type_id) REFERENCES employment_type(id) ON DELETE CASCADE
);

-- Work formats
CREATE TABLE IF NOT EXISTS work_format (
    id INT AUTO_INCREMENT PRIMARY KEY,
    format_name VARCHAR(100) NOT NULL UNIQUE
);

-- Employee work format preferences (many-to-many)
CREATE TABLE IF NOT EXISTS employee_work_format (
    employee_id INT NOT NULL,
    work_format_id INT NOT NULL,
    PRIMARY KEY (employee_id, work_format_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (work_format_id) REFERENCES work_format(id) ON DELETE CASCADE
);

-- Company table
CREATE TABLE IF NOT EXISTS company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255), -- Path to logo file
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employer table
CREATE TABLE IF NOT EXISTS employer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    photo VARCHAR(255), -- Path to photo file
    position VARCHAR(255),
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vacancy table
CREATE TABLE IF NOT EXISTS vacancy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    employer_id INT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    city VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

-- Vacancy employment types (many-to-many)
CREATE TABLE IF NOT EXISTS vacancy_employment_type (
    vacancy_id INT NOT NULL,
    employment_type_id INT NOT NULL,
    PRIMARY KEY (vacancy_id, employment_type_id),
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE,
    FOREIGN KEY (employment_type_id) REFERENCES employment_type(id) ON DELETE CASCADE
);

-- Vacancy work formats (many-to-many)
CREATE TABLE IF NOT EXISTS vacancy_work_format (
    vacancy_id INT NOT NULL,
    work_format_id INT NOT NULL,
    PRIMARY KEY (vacancy_id, work_format_id),
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE,
    FOREIGN KEY (work_format_id) REFERENCES work_format(id) ON DELETE CASCADE
);

-- Required skills for vacancies
CREATE TABLE IF NOT EXISTS vacancy_required_skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vacancy_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    min_qualification_level INT CHECK (min_qualification_level BETWEEN 1 AND 5),
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vacancy_skill (vacancy_id, skill_name)
);

-- Application table
CREATE TABLE IF NOT EXISTS application (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    vacancy_id INT NOT NULL,
    cover_letter TEXT,
    status ENUM('Pending', 'Reviewed', 'Interview', 'Rejected', 'Accepted') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (employee_id, vacancy_id)
);

-- Materials table
CREATE TABLE IF NOT EXISTS material (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT, -- Can be NULL if the author is deleted
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES employer(id) ON DELETE SET NULL
);

-- Employee liked materials (many-to-many)
CREATE TABLE IF NOT EXISTS employee_liked_material (
    employee_id INT NOT NULL,
    material_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, material_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES material(id) ON DELETE CASCADE
);

-- Employee disliked vacancies (many-to-many)
CREATE TABLE IF NOT EXISTS employee_disliked_vacancy (
    employee_id INT NOT NULL,
    vacancy_id INT NOT NULL,
    disliked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, vacancy_id),
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    vacancy_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL, -- Match score between employee and vacancy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    FOREIGN KEY (vacancy_id) REFERENCES vacancy(id) ON DELETE CASCADE,
    UNIQUE KEY unique_recommendation (employee_id, vacancy_id)
);

-- Insert some initial data for employment types
INSERT INTO employment_type (type_name) VALUES 
('Full-time'),
('Part-time'),
('Contract'),
('Freelance'),
('Internship');

-- Insert some initial data for work formats
INSERT INTO work_format (format_name) VALUES 
('Remote'),
('On-site'),
('Hybrid');
