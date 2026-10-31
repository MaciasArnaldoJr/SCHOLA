CREATE TABLE Department ( 
department_id INT AUTO_INCREMENT PRIMARY KEY, 
department_code VARCHAR(50) NOT NULL UNIQUE, 
department_name VARCHAR(150) NOT NULL, 
description TEXT 
); 

CREATE TABLE YearLevel ( 
year_level_id INT AUTO_INCREMENT PRIMARY KEY, 
year_level_name VARCHAR(100) NOT NULL, 
description TEXT 
);

CREATE TABLE Semester ( 
semester_id INT AUTO_INCREMENT PRIMARY KEY, 
semester_name VARCHAR(100) NOT NULL, 
academic_year VARCHAR(50) NOT NULL, 
start_date DATE, 
end_date DATE, 
status VARCHAR(50) 
);

CREATE TABLE Users ( 
user_id INT AUTO_INCREMENT PRIMARY KEY, 
username VARCHAR(100) NOT NULL UNIQUE, 
password VARCHAR(255) NOT NULL, 
email VARCHAR(255) NOT NULL UNIQUE, 
role ENUM('Admin','Teacher','Student'), 
account_status VARCHAR(50), 
creation_date DATETIME DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE Course ( 
course_id INT AUTO_INCREMENT PRIMARY KEY, 
department_id INT NOT NULL, 
course_code VARCHAR(50) UNIQUE, 
course_name VARCHAR(150), 
description TEXT, 

FOREIGN KEY (department_id) 
REFERENCES Department(department_id) 
);

CREATE TABLE Students ( 
student_id INT AUTO_INCREMENT PRIMARY KEY, 
user_id INT NOT NULL, 
course_id INT NOT NULL, 
department_id INT NOT NULL, 
year_level_id INT NOT NULL, 
fname VARCHAR(100), 
lname VARCHAR(100), 
mname VARCHAR(100), 
section VARCHAR(50), 
birth_date DATE, 

FOREIGN KEY (user_id) 
REFERENCES Users(user_id), 

FOREIGN KEY (course_id) 
REFERENCES Course(course_id), 

FOREIGN KEY (department_id) 
REFERENCES Department(department_id), 

FOREIGN KEY (year_level_id) 
REFERENCES YearLevel(year_level_id) 
);

CREATE TABLE Teachers ( 
teacher_id INT AUTO_INCREMENT PRIMARY KEY, 
user_id INT NOT NULL, 
department_id INT NOT NULL, 
fname VARCHAR(100), 
lname VARCHAR(100), 
mname VARCHAR(100), 
email VARCHAR(100), 
specialization VARCHAR(100), 

FOREIGN KEY (user_id) 
REFERENCES Users(user_id), 

FOREIGN KEY (department_id) 
REFERENCES Department(department_id) 
);

CREATE TABLE Subjects ( 
subject_id INT AUTO_INCREMENT PRIMARY KEY, 
department_id INT NOT NULL, 
subject_code VARCHAR(50) UNIQUE, 
subject_name VARCHAR(150), 
description TEXT, 
units INT, 

FOREIGN KEY (department_id) 
REFERENCES Department(department_id) 
);

CREATE TABLE Room ( 
room_id INT AUTO_INCREMENT PRIMARY KEY, 
room_name VARCHAR(100), 
building VARCHAR(100), 
room_type VARCHAR(100), 
capacity INT, 
room_status VARCHAR(50) 
);

CREATE TABLE Loadslip ( 
loadslip_id INT AUTO_INCREMENT PRIMARY KEY, 
student_id INT NOT NULL, 
subject_id INT NOT NULL, 
teacher_id INT NOT NULL, 
semester_id INT NOT NULL, 
year_level_id INT NOT NULL, 
course_id INT NOT NULL, 
school_year VARCHAR(50), 
section VARCHAR(50), 
enrollment_status VARCHAR(50), 
date_enrolled DATE, 

FOREIGN KEY (student_id) 
REFERENCES Students(student_id), 

FOREIGN KEY (subject_id) 
REFERENCES Subjects(subject_id), 

FOREIGN KEY (teacher_id) 
REFERENCES Teachers(teacher_id), 

FOREIGN KEY (semester_id) 
REFERENCES Semester(semester_id), 

FOREIGN KEY (year_level_id) 
REFERENCES YearLevel(year_level_id), 

FOREIGN KEY (course_id) 
REFERENCES Course(course_id) 
); 

CREATE TABLE Schedule ( 
schedule_id INT AUTO_INCREMENT PRIMARY KEY, 
loadslip_id INT NOT NULL, 
room_id INT NOT NULL, 
day_of_week VARCHAR(50), 
start_time TIME, 
end_time TIME, 

FOREIGN KEY (loadslip_id) 
REFERENCES Loadslip(loadslip_id), 

FOREIGN KEY (room_id) 
REFERENCES Room(room_id) 
);

CREATE TABLE Activities (
activity_id INT AUTO_INCREMENT PRIMARY KEY,
loadslip_id INT NOT NULL,
activity_title VARCHAR(150),
activity_type VARCHAR(50),
instructions TEXT,
total_points DECIMAL(10,2),
date_posted DATETIME,
due_date DATETIME,
status VARCHAR(50),

FOREIGN KEY (loadslip_id)
REFERENCES Loadslip(loadslip_id)
);


CREATE TABLE Scores (
score_id INT AUTO_INCREMENT PRIMARY KEY,
activity_id INT NOT NULL,
student_id INT NOT NULL,
points_earned DECIMAL(10,2),
graded_by INT,
remarks TEXT,
date_graded DATETIME,

FOREIGN KEY (activity_id)
REFERENCES Activities(activity_id),

FOREIGN KEY (student_id)
REFERENCES Students(student_id),

FOREIGN KEY (graded_by)
REFERENCES Teachers(teacher_id)
);

CREATE TABLE Grade (
grade_id INT AUTO_INCREMENT PRIMARY KEY,
loadslip_id INT NOT NULL,
student_id INT NOT NULL,
prelim_grade DECIMAL(5,2),
midterm_grade DECIMAL(5,2),
final_grade DECIMAL(5,2),
overall_grade DECIMAL(5,2),
remarks VARCHAR(200),
date_updated DATETIME,

FOREIGN KEY (loadslip_id)
REFERENCES Loadslip(loadslip_id),

FOREIGN KEY (student_id)
REFERENCES Students(student_id)
);

CREATE TABLE Attendance (
attendance_id INT AUTO_INCREMENT PRIMARY KEY,
loadslip_id INT NOT NULL,
student_id INT NOT NULL,
attendance_date DATE,
attendance_status ENUM(
'Present',
'Absent',
'Late',
'Excused'
),
recorded_by INT,
remarks TEXT,
 
FOREIGN KEY (loadslip_id)
REFERENCES Loadslip(loadslip_id),

FOREIGN KEY (student_id)
REFERENCES Students(student_id),

FOREIGN KEY (recorded_by)
REFERENCES Teachers(teacher_id)
);

CREATE TABLE LearningMaterial ( 
material_id INT AUTO_INCREMENT PRIMARY KEY, 
subject_id INT NOT NULL, 
teacher_id INT NOT NULL, 
material_title VARCHAR(200), 
description TEXT, 
file_url VARCHAR(255), 
material_type VARCHAR(50), 
upload_date DATETIME, 

FOREIGN KEY (subject_id) 
REFERENCES Subjects(subject_id), 

FOREIGN KEY (teacher_id) 
REFERENCES Teachers(teacher_id) 
);