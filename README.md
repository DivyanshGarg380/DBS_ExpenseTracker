# Smart Student Budget and Expense Analytics System

## Overview

The Smart Student Budget and Expense Analytics System is a full-stack web application designed to help students track their daily expenses, manage budgets, and analyze their spending patterns. The system provides real-time insights into financial behavior through structured data storage, automated alerts, and analytical dashboards.

The application is built using Next.js for the frontend and backend (API routes) and MySQL as the relational database. It demonstrates core database management system concepts such as normalization, joins, constraints, triggers, and aggregation.

---

## Objectives

* To design and implement a normalized relational database schema for expense tracking
* To provide a user-friendly interface for recording and managing expenses
* To enable monthly budget setting and monitoring
* To generate analytical insights such as category-wise and monthly spending
* To implement advanced DBMS features such as triggers, views, and indexing
* To integrate frontend and backend using a modern full-stack framework

---

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Recharts (for data visualization)
* shadcn/ui (UI components)
* Sonner (toast notifications)

### Backend

* Next.js API Routes
* Node.js runtime

### Database

* MySQL

---

## System Architecture

The application follows a layered architecture:

Frontend (React Components)
→ API Layer (Next.js API routes)
→ Database Layer (MySQL)

All data operations are handled through API endpoints, ensuring separation of concerns and maintainability.

---

## Database Design

### Tables

1. Users
   Stores user information such as name, email, and password.

2. Categories
   Stores predefined expense categories.

3. Expenses
   Stores all expense records with references to users and categories.

4. Budgets
   Stores monthly budget limits per user.

5. Alerts
   Stores system-generated alerts when budget limits are exceeded.

6. Income
   Stores user income records.

7. Category_Budget
   Stores category-wise budget limits.

8. Expense_Audit
   Stores logs of deleted or modified expenses.

---

### Normalization

The database is normalized up to Third Normal Form (3NF):

* First Normal Form (1NF): Eliminated repeating groups by storing expenses as separate rows
* Second Normal Form (2NF): Removed partial dependencies by separating categories
* Third Normal Form (3NF): Removed transitive dependencies by separating budgets and alerts

---

### Relationships

* Users → Expenses (One-to-Many)
* Categories → Expenses (One-to-Many)
* Users → Budgets (One-to-Many)
* Users → Alerts (One-to-Many)

Foreign keys are used to enforce referential integrity.

---

## DBMS Concepts Implemented

* Primary Keys and Foreign Keys
* Constraints (NOT NULL, UNIQUE, CHECK)
* Joins (INNER JOIN, LEFT JOIN)
* Aggregation Functions (SUM, AVG)
* GROUP BY clauses
* Views for analytics
* Stored Procedures
* Triggers (for automation)
* Indexing for performance optimization

---

## Triggers

### Budget Alert Trigger

Automatically inserts an alert into the Alerts table when total expenses exceed the defined budget.

### Expense Audit Trigger

Logs deleted expenses into the Expense_Audit table.

---

## Features

### Authentication

* User signup and login
* Session handling using React context

### Expense Management

* Add, view, update, and delete expenses
* Category-based filtering
* Real-time updates from database

### Budget Management

* Set monthly budget
* Automatic calculation of total spending
* Remaining budget display

### Analytics

* Monthly spending trends
* Category-wise expense breakdown
* Summary statistics (total, average, highest expense)

### Alerts

* Automatic detection of budget exceedance
* Display of warnings in dashboard

---

## API Endpoints

### Authentication

POST /api/auth
Handles login

PUT /api/auth
Handles signup

---

### Expenses

GET /api/expenses
Fetch all expenses

POST /api/expenses
Add new expense

DELETE /api/expenses
Delete expense

PUT /api/expenses
Update expense

---

### Budget

GET /api/budget
Fetch budget and spending

POST /api/budget
Set or update budget

---

### Analytics

GET /api/analytics
Fetch category-wise and monthly data

---

### Alerts

GET /api/alerts
Fetch user alerts

---

## Environment Variables

Create a `.env.local` file in the root directory:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_budget

Restart the development server after adding environment variables.

---

## Installation and Setup

1. Clone the repository

git clone <repository-url>

2. Install dependencies

npm install

3. Set up MySQL database

* Create database: student_budget
* Execute all SQL table creation scripts

4. Add environment variables

Create `.env.local` file with database credentials

5. Run the development server

npm run dev

6. Open the application

http://localhost:3000

---

## Project Structure

/app
/api
/auth
/expenses
/budget
/analytics
/alerts

/components
/context
/lib (database connection)

---

## Testing

* API endpoints tested using browser and local requests
* Database operations validated using sample data
* UI tested through user interaction scenarios

---

## Expected Outcomes

* Fully functional expense tracking system
* Real-time budget monitoring
* Automated alerts for overspending
* Analytical insights through charts and summaries
* Demonstration of practical DBMS concepts

---

## Future Enhancements

* JWT-based authentication
* Multi-user role support
* Cloud database deployment
* Category-wise budgeting UI
* Export reports (PDF/CSV)

---

## Conclusion

This project successfully demonstrates the integration of frontend, backend, and database systems to build a real-world application. It applies core DBMS principles such as normalization, relational modeling, and query optimization, along with modern web development practices.
