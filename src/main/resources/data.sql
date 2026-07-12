-- Clear existing (if needed, though it's an in-memory DB)
DELETE FROM asset_categories;
DELETE FROM departments;

-- Insert Departments (Matching frontend IDs 101-104)
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES (101, 'Engineering & IT', 'Software and Hardware Engineering', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES (102, 'Facilities & Ops', 'Facilities and Operations', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES (103, 'Field Operations', 'Field Operations', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES (104, 'Human Resources & Administration', 'HR & Admin', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Categories (Matching frontend IDs 201-204)
INSERT INTO asset_categories (id, name, description, created_at, updated_at) VALUES (201, 'Electronics & IT Hardware', 'Computers, laptops, and IT equipment', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO asset_categories (id, name, description, created_at, updated_at) VALUES (202, 'Office Furniture & Ergonomics', 'Chairs, desks, etc', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO asset_categories (id, name, description, created_at, updated_at) VALUES (203, 'Company Vehicles & Transport', 'Cars, vans, etc', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO asset_categories (id, name, description, created_at, updated_at) VALUES (204, 'Shared AV Equipment & Projectors', 'Projectors, AV', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
