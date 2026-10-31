CREATE TABLE Users ( 
user_id INT AUTO_INCREMENT PRIMARY KEY, 
username VARCHAR(100) NOT NULL UNIQUE, 
password VARCHAR(255) NOT NULL, 
email VARCHAR(255) NOT NULL UNIQUE, 
role ENUM('Admin','Teacher','Student'), 
account_status VARCHAR(50), 
creation_date DATETIME DEFAULT CURRENT_TIMESTAMP 
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

