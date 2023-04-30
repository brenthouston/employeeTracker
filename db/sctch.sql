USE company_db;

SELECT employees.first_name AS  "first name",employees.last_name AS "last name",
roles.title
FROM employees
JOIN  roles on roles.id=employees.role_id;