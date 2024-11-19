# Employee-Tracker

## Description
This application is a command-line interface (CLI) used to manage a company's employee database. It allows users to view and organize employee information, including departments, roles, salaries, and managers. Users can also add or update employees, roles, departments, making it a pracitical tool for HR management.

## Features
- View all departments, roles, and employees.
- Add a new department, role, or employee.
- Update an employee's role.
- Interactive menu for easy navigation using Inquirer.

## technologies Used
- **Node.js**: For server-side scripting and running the application.
- **PostgresSQL**: As the relational database to store employee, role, and department data.
- **Inquirer**: For interactive command-line prompts.

## Installation
- Clone the repository
- Run npm install
- Set up a PostgresSQL database and run the schema.sql and seeds.sql
- Add a .env file with your database credentials
- Run the application using npm start

## Usage
- Start the application using npm start.
- Select an action from the main menu:
    - View departments, roles or employees.
    - Add a department, role, or employee.
    - Update an employee's role.
- Follow the prompts to input data or make selections.
- View updated results immediately in the console.

## Testing
To test the application:
- Verfiy the database connection using the .env file.
- Test each menu option and ensure data is updated correctly in the database.
- Look for edge cases, such as:
    - Empty inputs
    - Selecting non-existent departments, roles, or employees

## Future Enhancements
- Integrate a graphical user interface (GUI) for improved usability.

## Contribution
- Fork the repository
- Create a feature branch
- Commit your changes
- Push to the branch
- Create a pull request

## Demo Video
https://drive.google.com/file/d/1XzytVtBvgQTwOoOOlSE3i1xYaXDhNtMz/view?usp=drive_link