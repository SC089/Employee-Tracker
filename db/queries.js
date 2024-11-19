import pool from './connection.js';
export const viewDepartments = async () => {
    const { rows } = await pool.query('SELECT * FROM department');
    return rows;
};
export const viewRoles = async () => {
    const { rows } = await pool.query(`
      SELECT role.id, title, salary, department.name AS department
      FROM role
      JOIN department ON role.department_id = department.id
    `);
    return rows;
};
export const viewEmployees = async () => {
    const { rows } = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department,
             role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN employee m ON e.manager_id = m.id
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
    `);
    return rows;
};
