const inquirer = require('inquirer');
const mysql = require('mysql2');
const tablify = require('tablify');
const options = { showRowNumber: false };
const db = require('./db/connection')
let departmentChoices =["Sales", "Engineer", "Finance", "Legal", "Maintenance"];
let roleChoices =["Sales Lead","Salesperson","Software Engineer", "Lead Engineer","Litigator","Groundskeeper"];

function menu(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: "What would you like to do?",
            choices: ["View All Departments", "Add Department","View All Roles", "Add Role", "View All Employees", "Add New Employee", "Update Employee Role", "View Employees/Roles","Delete Role","Delete Employee","Delete Department","Quit"]
        }
    ]).then((ans) =>{
        switch (ans.menu) {
            case "View All Departments": viewDepartment();
                break;
            case "Add Department": addDepartment();
                break;
            case "View All Roles": viewRoles();
                break;
            case "Add Role": addRole();
                break;
            case "View All Employees": viewEmployees();
                break;
            case "Add New Employee": addEmployee();
                break;
            case "Update Employee Role": update();
                break;
            case "Delete Department": deleteDepartment();
                break;
            case "Quit": 
                    inquirer.prompt([
                        {
                            type: "confirm",
                            name: 'quit',
                            message: "Are you sure you wish to quit?"
                        }
                    ]).then((ans)=>{
                        if(ans.quit) {
                            console.log(`
Good Bye 🚀
                            `);
                            process.exit();
                        } else {
                            menu();
                        }
                    });
                break;
            case "View Employees/Roles": empRole();
                break;
            case "Delete Role": deleteRole();
                break;
            case "Delete Employee": deleteEmployee();
                break;
        }
    });
}

const viewDepartment = ()=>{
   
    db.query(`SELECT name AS departments, id FROM departments`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const options ={
            heders: {
                name: 'departments'
            }
        }
        const table =tablify(data, options)
        console.log(table);
        menu();
    })
}

const viewRoles = ()=>{
   
    db.query(`SELECT * FROM roles`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const options ={
            heders: {
                name: 'roles'
            }
        }
        const table =tablify(data, options)
        console.log(table);
        menu();
    })
}
const viewEmployees = ()=>{
   
    db.query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS fullname FROM employees`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const options ={
            heders: {
                name: 'fullname'
            }
        }
        const table =tablify(data, options)
        console.log(table);
        menu();
    })
}

const addRole = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'name',
        message: 'What role would you like to add?'
        },
        {
        type: 'input',
        name: 'salary',
        message: 'What is this roles salary?'
        },
        {
        type: 'list',
        name: 'department',
        message: 'What department does this role belong to?',
        choices: departmentChoices
        }

    ]).then(ans =>{  
        let dep;
        for (let i = 0; i < departmentChoices.length; i++) {
            const element = departmentChoices[i];
            if(ans.department == element){
            dep = i +1;
            };
    };
            
        db.query(`INSERT INTO roles(title, salary, department_id)
        VALUES (?,?,?)`,[ans.name,ans.salary,dep], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
            roleChoices.push(ans)
           console.log(`
           -------Your role has been added!-------
           `

           );
           viewRoles();
           
           
            })
        })
}

const addDepartment = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'name',
        message: 'What Department would you like to add?'
        }

    ]).then(ans =>{
        db.query(`INSERT INTO departments(name)
        VALUES (?)`,[ans.name], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
            departmentChoices.push(ans.name);
            console.log(`
            -------Your department has been added!-------
            `);
            viewDepartment();
           
            })
        })
}

const addEmployee = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'first_name',
        message: 'What is the employees first name?'
        },
        {
        type: 'input',
        name: 'last_name',
        message: 'What is the employees last name?'
        },
        
        {
        type: 'list',
        name: 'role_id',
        message: 'What is the employees role_id',
        choices: roleChoices
        },
        
        {
        type: 'input',
        name: 'mngr_id',
        message: 'What is the employees manager_id?'
        }
        
    ]).then((ans) =>{  
        let role;
        for (let i = 0; i < roleChoices.length; i++) {
            const element = roleChoices[i];
            if(ans.role_id == element){
            role = i +1;
            };
        };
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)`,[ans.first_name,ans.last_name,role,ans.mngr_id], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
           console.log(`
           -------Your employee has been added!-------
           `
           );
           viewEmployees();
           
           
            })
        })
}

const update = () => {
    db.query(`SELECT CONCAT(first_name, ' ', last_name) AS fullname FROM employees`, (err, data) => {
      if (err) {
        console.error("Error retrieving employees:", err);
        return;
      }
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee would you like to update?',
          choices: () => data.map(row => row.fullname)
        },
        {
          type: 'list',
          name: 'role',
          message: `What is the employee's new role?`,
          choices: roleChoices
        }
      ]).then(ans => {
        let roleId;
        for (let i = 0; i < roleChoices.length; i++) {
          if (ans.role === roleChoices[i]) {
            roleId = i + 1;
            break;
          }
        }
  
        const fullName = ans.employee.split(' ');
        const firstName = fullName[0];
        const lastName = fullName[1];
        db.query(`UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleId, firstName, lastName], (err, data) => {
          if (err) {
            console.error("Error updating employee role:", err);
            return;
          }
          console.log(`
    -------Employee role updated!-------
          `);
          empRole();
        });
      });
    });
  };
  
const empRole = ()=> {
    db.query(`SELECT employees.first_name AS  "first name",employees.last_name AS "last name", employees.id,
    roles.title FROM employees JOIN  roles on roles.id=employees.role_id;`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const options ={
            heders: {
                name: 'roles'
            }
        }
        const table =tablify(data, options)
        console.log(table);
        
    })
    menu();
}

const deleteRole = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'id',
        message: `What is the id of the role you wish to delete?`
        }

    ]).then(ans =>{
        db.query(`DELETE FROM roles WHERE ID=?`,[ans.id], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
            roleChoices = roleChoices.filter(choice => choice !== ans.name);

;
console.log(`
-------Your role has been deleted!-------
`);
        viewRoles();
           
            })
        })
}

const deleteEmployee = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'id',
        message:`What is your Employee's id that would you like to delete?`
        }

    ]).then(ans =>{
        db.query(`DELETE FROM employees WHERE ID=?`,[ans.id], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
            
            console.log(`
            -------Your Employee has been deleted!-------
            `);
            viewEmployees();
            
            })
        })
}

const deleteDepartment = ()=>{
    inquirer.prompt([
        {
        type: 'input',
        name: 'id',
        message: `What is the id of the department you wish to delete?`
        }

    ]).then(ans =>{
        db.query(`DELETE FROM departments WHERE ID=?`,[ans.id], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
            roleChoices = roleChoices.filter(choice => choice !== ans.name);

;
console.log(`
-------Your department has been deleted!-------
`);
        viewDepartment();
           
            })
        })
}

menu();