# SCHOLA

## Group Members

| No. | Name |
|:---:|---|
| 1 | Macias, Arnaldo Jr. |
| 2 | Marino, Jhon Cristopher |
| 3 | Labadia, Trisha Babie |
| 4 | Malunes, Shanon Cline |
| 5 | Malusay, Mark |
| 6 | Lumanog, Christer John |

## Section

A

## Project Description

**Schola: Your grade, Your growth, Your schola**

Schola is a recording system that helps admins monitor their students and staff. Schola allows admins to access the school's departments, courses available in those departments, enrolled students along with enrollment data, posted activities and related data, grades of students, a functional loadslip with student details, a list of all users, and finally, a collection of all available information in reports.

## Unique Major Feature



## Ownership Matrix

| Member | GitHub Username | Tables | Endpoints / Screens | Join Report(s) and Join Type | Feature Role |
|---|---|---|---|---|---|
| Macias, Arnaldo Jr. | [MaciasArnaldoJr](https://github.com/MaciasArnaldoJr) | Users, Students, Teachers | `/api/users`, `/api/students`, `/api/teachers` / User Management | Users + Students + Teachers (LEFT JOIN) | Core |
| Marino, Jhon Cristopher | [marinojhoncristopher7](https://github.com/marinojhoncristopher7) | Course, Department, YearLevel | `/api/courses`, `/api/departments`, `/api/yearlevels` / Admin Dashboard, Course Management, Department Management | Course + Department + YearLevel (INNER JOIN) | Master Data |
| Labadia, Trisha Babie | [Babie25](https://github.com/Babie25) | Subjects, Semester, Loadslip | `/api/subjects`, `/api/semesters`, `/api/loadslips` / Enrollment Management, Loadslip Management| Loadslip + Subjects + Semester (INNER JOIN) | Transactions |
| Malunes, Shanon Cline | [shanclinemalunes](https://github.com/shanclinemalunes) | Activities, Scores | `/api/activities`, `/api/scores` / Evaluation Management | Activities + Scores (INNER JOIN) | Unique Feature (Rules) |
| Malusay, Mark | [Mark-ux-collab](https://github.com/Mark-ux-collab) | Grade, Attendance | `/api/grades`, `/api/attendance` / Grade Management | Grade + Attendance (INNER JOIN) | Unique Feature (Workflows/Audits) |
| Lumanog, Christer John | [cejlumanog](https://github.com/cejlumanog) | Schedule, Room, LearningMaterial | `/api/schedules`, `/api/rooms`, `/api/learningmaterials` / Reports Management | Schedule + Room + LearningMaterial (INNER JOIN, LEFT JOIN) | Reports |

## How to Run