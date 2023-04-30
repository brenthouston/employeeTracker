const inquirer = require('inquirer');
const mysql = require('mysql2');
const cliTable = require('cli-table')


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
            case "View All Employees": viewEmployees();
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

// const addDepartment = ()=>{
//     db.query(`SELECT name AS departments FROM departments`, (err, data) => {
//         if(err){
//             console.error("Error retrieving departements:", err);
//             return;
//         }
//         const table = new cliTable({
//             head: ["Departments"]
//         });
//         data.forEach(row => {
//             table.push([row.departments])
//         })
//         console.log(table.toString());
//     })
// }





menu();