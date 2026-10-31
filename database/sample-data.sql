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
