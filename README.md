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

Automatic grade perventage evaluator and transmuter for admins

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

### Prerequisites

Make sure the following are installed on your computer:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Step 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/MaciasArnaldoJr/SCHOLA.git .
```

### Step 2. Navigate to the Project Folder

```bash
cd SCHOLA
```

### Step 3. Install Dependencies

Run the following command in the project root directory:

```bash
npm install
```

### Step 4. Set Up the Database

1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Create the SCHOLA database:

```sql
CREATE DATABASE schola;
```

4. Select the `schola` database.
5. Import and execute the SQL files in this order:

   - `database/tables.sql`
   - `database/sample-data.sql`

### Step 5. Configure Environment Variables

Create a `.env` file in the root project directory and add:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=schola
```

Replace `your_mysql_password` with your actual MySQL password. If your MySQL account has no password, leave `DB_PASSWORD` empty.

### Step 6. Start MySQL

Make sure your local MySQL server is running.

### Step 7. Start the Application

In the project root directory, run:

```bash
npm start
```

Wait for the backend server to start successfully.

### Step 8. Open SCHOLA

Open your browser and visit:

http://localhost:3000/pages/admin-dashboard.html

### Stop the Application

To stop the server, return to the terminal and press:

```text
Ctrl + C
```