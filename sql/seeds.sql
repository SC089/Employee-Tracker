INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('Human Resources'), ('Marketing'), ('Finances');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('Senior Software Engineer', 120000, 1),
('Sales Representative', 60000, 2),
('Sales manager', 60000, 2),
('HR Specialist', 50000, 3),
('HR Manager', 75000, 3),
('Marketing Coordinator', 50000, 4),
('Marketing Manager', 80000, 4),
('Accoutant', 70000, 5),
('Finance Manager', 110000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
-- Engineering
('LeBron', 'James', 1, NULL), -- MANAGER
('Max', 'Verstappen', 2, 1),
('John', 'Halo', 1, 1),

-- Sales
('Dave', 'Brown', 3, 4),
('Miller', 'Lite', 3, 4),
('Riley', 'Smiley', 4, NULL), -- MANAGER

-- Human Resources
('Arthur', 'Morgan', 5, 6),
('John', 'Marston', 5, 6),
('Sadie', 'Jones', 6, NULL), -- MANAGER

-- Marketing
('John', 'Kratos', 7, 8),
('Mario', 'Bro', 7, 8),
('Bowser', 'Koopa', 8, NULL), -- MANAGER

-- Finance
('Jose', 'Menendez', 9, 10),
('John', 'Woods', 9, 10),
('Miles', 'Morales', 10, NULL); -- MANAGER