INSERT INTO Department (department_code, department_name, description)
VALUES
('CAS', 'College of Arts and Sciences', 'Computer and IT related programs'),
('CNPAS', 'College of Nursing and Allied Health Sciences', 'Nursing and Medicine programs'),
('CBA', 'College of Business Administration', 'Business and management programs'),
('CCJE', 'College of Criminal Justice Education', 'Criminology related programs'),
('CEA', 'College of Engineering and Architecture', 'Engineering related programs');

INSERT INTO YearLevel (year_level_name, description)
VALUES
('1st Year', 'First year students'),
('2nd Year', 'Second year students'),
('3rd Year', 'Third year students'),
('4th Year', 'Fourth year students');

INSERT INTO Users (username, password, email, role, account_status)
VALUES
('Christer John D. Lumanog', 'admin123', 'admin@gmail.com', 'Admin', 'Active'),
('Babie Trisha C. Labadia', 'teacher123', 'teacher1@gmail.com', 'Teacher', 'Active'),
('Arnaldo Jr. B .Macias ', 'teacher123', 'teacher2@gmail.com', 'Teacher', 'Active'),
('Jhon Cristopher A. Marino', 'student123', 'student1@gmail.com', 'Student', 'Active'),
('Mark L. Malusay', 'student123', 'student2@gmail.com', 'Student', 'Active'),
('Shanon Cline E. Malunes', 'student123', 'student3@gmail.com', 'Student', 'Active'),
('Luca David Z. Moretti', 'student123', 'student4@gmail.com', 'Student', 'Active');

INSERT INTO Course (department_id, course_code, course_name, description)
VALUES
(1, 'BSIT', 'Bachelor of Science in Information Technology', 'Information Technology program'),
(1, 'BSCS', 'Bachelor of Science in Computer Science', 'Computer Science program'),
(2, 'BSN', 'Bachelor of Science in Nursing', 'Nursing program'),
(2, 'BSP', 'Bachelor of Science in Pharmacy', 'Pharmacist program'),
(3, 'BSBA', 'Bachelor of Science in Business Administration', 'Business program'),
(3, 'BSOA', 'Bachelor of Science in Office Administration', 'Office program'),
(4, 'BSC', 'Bachelor of Science in Criminology ', 'Criminology program'),
(4, 'BSFS', 'Bachelor of Science in Forensic Science', 'Forensic program'),
(5, 'BSCE', 'Bachelor of Science Civil Engineering', 'Civil Engineering program'),
(5, 'BSA', 'Bachelor of Science in Architecture', 'Architecture program');

INSERT INTO Students
(user_id, course_id, department_id, year_level_id, fname, lname, mname, section, birth_date)
VALUES
(4, 1, 1, 1, 'Jhon Cristopher', 'Marino', 'Adel', 'C', '2006-05-15'),
(5, 1, 1, 2, 'Mark', 'Malusay', 'Linihan', 'B', '2005-08-20'),
(6, 2, 1, 3, 'Shanon Cline', 'Malunes', 'Eslafor', 'A', '2004-03-10'),
(7, 1, 1, 1, 'Luca David', 'Moretti', 'Zora', 'F', '2006-11-25');

INSERT INTO Teachers
(user_id, department_id, fname, lname, mname, email, specialization)
VALUES
(2, 1, 'Babie Trisha', 'Labadia', 'Calumba', 'teacher1@gmail.com', 'Programming'),
(3, 1, 'Arnaldo Jr.', 'Macias', 'Banua', 'teacher2@gmail.com', 'Database Management');
