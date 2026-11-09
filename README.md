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


## How to Run SCHOLA

Follow these steps to set up and run SCHOLA on your computer.

### Prerequisites

Make sure the following are installed on your computer:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Step 1. Create a Project Folder

Create a folder where you want to store the SCHOLA project.

Open the folder in CMD (Command Prompt).

### Step 2. Clone the Repository

Run the following command:

```bash
git clone https://github.com/MaciasArnaldoJr/SCHOLA.git .
```

### Step 3. Install Dependencies

Inside the project directory, run:

```bash
npm install
```

This installs all the required Node.js packages.

### Step 4. Open the Project in VS Code

Run:

```bash
code .
```

This opens the SCHOLA project in Visual Studio Code.

### Step 5. Configure the Environment Variables

Locate the `.env.example` file in the project root directory.

Create a copy of the file and rename the copied file to `.env`.

Open `.env` and enter your local MySQL credentials.

Example:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=schola
```

Replace `your_mysql_password` with your actual MySQL root password. If your MySQL account has no password, leave `DB_PASSWORD` empty.

**Important:** Do not rename or modify `.env.example`. Only edit your personal `.env` file.

### Step 6. Start MySQL

Make sure your local MySQL server is running before starting SCHOLA.

The application will automatically initialize the required database and tables when the backend starts.

No manual database creation through MySQL Workbench is required.

### Step 7. Start the Backend Server

In VS Code, navigate to:

`backend/server.js`

Open the integrated terminal and run:

```bash
node backend/server.js
```

Wait for the backend server to start successfully.

**Keep the terminal running** while using SCHOLA.

### Step 8. Open SCHOLA

Open your preferred web browser (Google Chrome, Microsoft Edge, or Firefox).

Enter the following address in the browser:

```text
http://localhost:3000/pages/login.html
```

Press Enter to access the SCHOLA Login Page.

Make sure the backend server is still running while accessing the application.

### Stopping the Application

To stop the backend server, return to the terminal and press:

```text
Ctrl + C
```

### Important Notes

- Each computer must have its own Node.js dependencies and local MySQL server.
- Each user must configure their own `.env` file using their local MySQL credentials.
- The `.env` file is not included in the repository because it contains database credentials.
- Make sure MySQL is running before starting the backend server.
- Keep the backend terminal running while accessing SCHOLA.
