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

INSERT INTO Semester (semester_name, academic_year, start_date, end_date, status)
VALUES
('1st Semester', '2026-2027', '2026-08-01', '2026-12-20', 'Active'),
('2nd Semester', '2026-2027', '2027-01-05', '2027-05-30', 'Upcoming'),
('Summer', '2026-2027', '2027-06-01', '2027-07-15', 'Upcoming');

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

INSERT INTO Subjects (department_id, subject_code, subject_name, description, units)
VALUES
(1, 'CS102', 'Introduction to Computing', 'Basic concepts of computing', 3),
(1, 'CS101', 'Computer Programming 1', 'Fundamentals of programming', 3),
(1, 'IT103', 'Database Management System', 'Database concepts and SQL', 3),
(1, 'IT104', 'Web Development', 'Fundamentals of web development', 3),
(1, 'IT105', 'Networking 1', 'Introduction to computer networks', 3);

INSERT INTO Loadslip
(student_id, subject_id, teacher_id, semester_id, year_level_id, course_id, school_year, section, enrollment_status, date_enrolled)
VALUES
(1, 3, 1, 1, 1, 1, '2026-2027', 'C', 'Enrolled', '2026-08-01'),
(1, 4, 1, 1, 1, 1, '2026-2027', 'C', 'Enrolled', '2026-08-01'),
(2, 5, 1, 1, 2, 1, '2026-2027', 'B', 'Enrolled', '2026-08-01'),
(2, 4, 1, 1, 2, 1, '2026-2027', 'B', 'Enrolled', '2026-08-01'),
(3, 3, 2, 1, 3, 2, '2026-2027', 'A', 'Enrolled', '2026-08-01'),
(3, 5, 2, 1, 3, 2, '2026-2027', 'A', 'Enrolled', '2026-08-01'),
(4, 1, 2, 1, 1, 1, '2026-2027', 'F', 'Enrolled', '2026-08-01'),
(4, 2, 2, 1, 1, 1, '2026-2027', 'F', 'Enrolled', '2026-08-01');

INSERT INTO Activities
(loadslip_id, activity_title, activity_type, instructions, total_points, date_posted, due_date, status)
VALUES
(1, 'Database Design Quiz', 'Quiz', 'Answer all questions about database design.', 50, '2026-08-05 08:00:00', '2026-08-10 23:59:00', 'Active'),
(2, 'Web Creation Activity 1', 'Assignment', 'Create a simple website using basic programming concepts.', 100, '2026-08-06 09:00:00', '2026-08-15 23:59:00', 'Active'),
(3, 'Networking Activity', 'Performance Task', 'Create a simple network for a student management system.', 100, '2026-08-07 10:00:00', '2026-08-20 23:59:00', 'Active'),
(4, 'Web Development Quiz', 'Quiz', 'Answer the given web development questions.', 50, '2026-08-08 08:00:00', '2026-08-10 23:59:00', 'Active'),
(5, 'Database Creation 1', 'Assignment', 'Create a simple ER diagram using basic database concepts.', 100, '2026-08-06 09:00:00', '2026-08-15 23:59:00', 'Active'),

(6, 'Networking Activity', 'Performance Task', 'Create a functional network for a student management system.', 100, '2026-08-07 10:00:00', '2026-08-20 23:59:00', 'Active'),
(7, 'Computation', 'Quiz', 'Answer the given computing questions.', 50, '2026-08-08 08:00:00', '2026-08-15 23:59:00', 'Active'),
(8, 'Programming Activity 1', 'Assignment', 'Create a simple program using basic programming concepts.', 100, '2026-08-06 09:00:00', '2026-08-15 23:59:00', 'Active');

INSERT INTO Scores
(activity_id, student_id, points_earned, graded_by, remarks, date_graded)
VALUES
(1, 1, 45, 2, 'Very Good', '2026-08-11 09:00:00'),
(2, 1, 90, 2, 'Excellent work', '2026-08-16 10:00:00'),
(3, 2, 85, 2, 'Good performance', '2026-08-21 11:00:00'),
(4, 2, 40, 2, 'Good job', '2026-08-11 09:30:00'),
(6, 3, 48, 2, 'Excellent', '2026-08-16 10:00:00'),
(5, 3, 48, 2, 'Excellent', '2026-08-16 10:00:00'),
(7, 4, 48, 1, 'Excellent', '2026-08-16 10:00:00'),
(8, 4, 48, 1, 'Excellent', '2026-08-16 10:00:00');

INSERT INTO Grade
(loadslip_id, student_id, midterm_grade, final_grade, overall_grade, remarks, date_updated)
VALUES
(1, 1, 90.00, 94.00, 92.00, 'Passed', '2026-10-20 10:00:00'),
(2, 1, 88.00, 92.00, 90.00, 'Passed', '2026-10-20 10:00:00'),
(3, 2, 85.00, 90.00, 87.50, 'Passed', '2026-10-20 10:00:00'),
(4, 2, 87.00, 91.00, 89.00, 'Passed', '2026-10-20 10:00:00'),
(5, 3, 93.00, 96.00, 94.50, 'Passed', '2026-10-20 10:00:00'),
(6, 3, 94.00, 94.00, 94.00, 'Passed', '2026-10-20 10:00:00'),
(7, 4, 89.00, 92.00, 90.50, 'Passed', '2026-10-20 10:00:00'),
(8, 4, 97.00, 98.00, 97.50, 'Passed', '2026-10-20 10:00:00');

INSERT INTO Attendance
(loadslip_id, student_id, attendance_date, attendance_status, recorded_by, remarks)
VALUES
(1, 1, '2026-08-05', 'Present', 2, 'Attended class'),
(1, 1, '2026-08-06', 'Late', 2, 'Arrived 10 minutes late'),
(2, 1, '2026-08-06', 'Present', 2, 'Attended class'),
(2, 1, '2026-08-07', 'Absent', 2, 'No attendance'),
(3, 2, '2026-08-05', 'Present', 2, 'Attended class'),
(3, 2, '2026-08-08', 'Excused', 2, 'Excused absence'),
(4, 2, '2026-08-06', 'Present', 1, 'Attended class'),
(4, 2, '2026-08-07', 'Present', 1, 'Attended class');