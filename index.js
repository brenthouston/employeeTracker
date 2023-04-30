const inquirer = require('inquirer');
const mysql = require('mysql2');
const cliTable = require('cli-table')
let departmentChoices =["Sales", "Engineer", "Finance", "Legal", "Maintenance"];


const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password:'',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );
  



function menu(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: "What would you like to do?",
            choices: ["View All Departments", "Add Department","View All Roles", "Add Role", "Update Roll", "View All Employees", "Add New Employee", "Update Employee"]
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
            
        }
    })
}


const viewDepartment = ()=>{
   
    db.query(`SELECT name AS departments FROM departments`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const table = new cliTable({
            head: ["DEPARTMENTS"]
        });
        data.forEach(row => {
            table.push([row.departments])
        })
        console.log(table.toString());
    })
}

const viewRoles = ()=>{
   
    db.query(`SELECT title FROM roles`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const table = new cliTable({
            head: ["ROLES"]
        });
        data.forEach(row => {
            table.push([row.title])
        })
        console.log(table.toString());
    })
}
const viewEmployees = ()=>{
   
    db.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees`, (err, data) => {
        if(err){
            console.error("Error retrieving departements:", err);
            return;
        }
      
        const table = new cliTable({
            head: ["NAME"]
        });
        data.forEach(row => {
            table.push([row.name])
        })
        console.log(table.toString());
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
        let dep="";
        switch (ans.department) {
        
        case "Sales": dep=1;
           break;
        case "Engineer": dep=2;
            break;
        case "Finance": dep=3;
            break;
        case "Legal": dep=4;
            break;
        case "Maintenance": dep=5;
    };
            
        db.query(`INSERT INTO roles(title, salary, department_id)
        VALUES (?,?,?)`,[ans.name,ans.salary,ans.dep], (err, data) => {
            if(err){
                console.error("Error retrieving departements:", err);
                return;
            }
           console.log(`
           -------Your role has been added!-------
           `);
           menu();
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
            departmentChoices.push(ans.name)
           console.log(`
           -------Your department has been added!-------`);
           menu();
            })
        })
}





menu();