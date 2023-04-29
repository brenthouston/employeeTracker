

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineer"),
       ("Finance"),
       ("Legal"),
       ("Maintenance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 40000, 1),
       ("Software Engineer", 100000, 2),
       ("Lead Engineer", 130000, 2),
       ("Litigator", 95000, 4),
       ("Accountant", 40000, 3),
       ("Groundskeeper", 28000, 5),
       ("Account Manager", 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ted","McWiggins",6,NULL),
       ("Humster","Pottyworth",4,001),
       ("Elmer","Fudd",7,NULL),
       ("Ester","Peabody",1,002),
       ("Natty","Nickenbocker",5,NULL),
       ("Mark","Zuckerburg",3,NULL);
      
       
