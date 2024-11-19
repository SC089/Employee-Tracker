import inquirer from 'inquirer';
import { viewDepartments, viewRoles, viewEmployees } from './db/queries.js';
import pool from './db/connection.js';
import { Role, Employee, Department } from './interfaces.js';
  
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
        choices: [{ name: 'None', value: null }, 
            ...employees.map((emp: Employee) => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            })),
        ],
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

const deleteEntity = async () => {
    const { entityType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'entityType',
        message: 'What would you like to delete?',
        choices: ['Employee', 'Role', 'Department'],
      },
    ]);
  
    switch (entityType) {
      case 'Employee':
        const employees: Employee[] = await viewEmployees();
        const { employeeId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to delete:',
            choices: employees.map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp.id,
            })),
          },
        ]);
        await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
        console.log('Employee deleted!');
        break;
  
      case 'Role':
        const roles: Role[] = await viewRoles();
        const { roleId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the role to delete:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ]);
        await pool.query('DELETE FROM role WHERE id = $1', [roleId]);
        console.log('Role deleted!');
        break;
  
      case 'Department':
        const departments: Department[] = await viewDepartments();
        const { departmentId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department to delete:',
            choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
          },
        ]);
        await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);
        console.log('Department deleted!');
        break;
    }
};
  
const filterEmployees = async () => {
    const { filterType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'filterType',
        message: 'How would you like to filter employees?',
        choices: ['By Manager', 'By Department'],
      },
    ]);
  
    if (filterType === 'By Manager') {
      const employees: Employee[] = await viewEmployees();
      const { managerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the manager:',
          choices: employees
            .filter((emp) => emp.manager_id !== null) // Only employees with managers
            .map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp.id,
            })),
        },
      ]);
  
      const result = await pool.query(
        `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE e.manager_id = $1
        `,
        [managerId]
      );
      console.table(result.rows);
    } else if (filterType === 'By Department') {
      const departments: Department[] = await viewDepartments();
      const { departmentId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department:',
          choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ]);
  
      const result = await pool.query(
        `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE r.department_id = $1
        `,
        [departmentId]
      );
      console.table(result.rows);
    }
};
  
const viewSalaryByDepartment = async () => {
    const result = await pool.query(
      `
      SELECT d.name AS department, SUM(r.salary) AS total_salary
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      GROUP BY d.name
      ORDER BY total_salary DESC
      `
    );
    console.table(result.rows);
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
        'Delete an employee, role, or department',
        'Filter employees by manager or department',
        'View total salary by department',
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
    case 'Delete an employee, role, or department':
        await deleteEntity();
        break;
    case 'Filter employees by manager or department':
        await filterEmployees();
        break;
    case 'View total salary by department':
        await viewSalaryByDepartment();
        break;
    default:
      process.exit();
  }

  mainMenu();
};

mainMenu();
