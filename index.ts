import inquirer from 'inquirer';
const { viewDepartments, viewRoles, viewEmployees } = require('./db/queries');
import pool from './db/connection';
import { Role, Employee, Department } from './interfaces';
  
const displayDepartments = async () => {
    const departments: Department[] = await viewDepartments();
    console.table(departments);
};

const displayRoles = async () => {
    const roles: Role[] = await viewRoles();
    console.table(roles);
};

const displayEmployees = async () => {
    const employees: Employee[] = await viewEmployees();
    console.table(employees);
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Enter department name:' },
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log('Department added!');
};

const updateEmployeeRole = async () => {
    const employees = await viewEmployees();
    const roles = await viewRoles();
  
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee:',
        choices: employees.map((emp: Employee) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role:',
        choices: roles.map((role: Role) => ({ name: role.title, value: role.id })),
      },
    ]);
  
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    console.log('Employee role updated!');
};

const addRole = async () => {
    const departments = await viewDepartments();
  
    const { title, salary, departmentId } = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Enter role title:' },
      { type: 'input', name: 'salary', message: 'Enter role salary:' },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for this role:',
        choices: departments.map((dept: Department) => ({ name: dept.name, value: dept.id })),
      },
    ]);
  
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
      title,
      salary,
      departmentId,
    ]);
    console.log('Role added!');
};

const addEmployee = async () => {
    const roles = await viewRoles();
    const employees = await viewEmployees();
  
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      { type: 'input', name: 'firstName', message: 'Enter first name:' },
      { type: 'input', name: 'lastName', message: 'Enter last name:' },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select role:',
        choices: roles.map((role: Role) => ({ name: role.title, value: role.id })),
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select manager (or None):',
        choices: [{ name: 'None', value: null }].concat(
          employees.map((emp: Employee) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
          }))
        ),
      },
    ]);
  
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
      firstName,
      lastName,
      roleId,
      managerId,
    ]);
    console.log('Employee added!');
};

const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View all departments':
      await displayDepartments();
      break;
    case 'View all roles':
      await displayRoles();
      break;
    case 'View all employees':
      await displayEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    default:
      process.exit();
  }

  mainMenu();
};

mainMenu();
