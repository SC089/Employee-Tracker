INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('HR');

INSERT INTO role (title, salary, department_id) VALUES
("Software Engineer", 80000, 1),
('Sales manager', 60000, 2),
('HR Specialist', 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('LeBron', 'James', 1, NULL),
('Max', 'Verstappen', 2, 1),
('John', 'Halo', 3, 1);