const colors = require("colors");
const figlet = require("figlet");
const { default: inquirer } = require("inquirer");
const { ConnectDB } = require("./src/db/config")
const { AddBook, ListBooks, ReadBook, DeleteBook, EditBook } = require('./src/books-controller')

require('dotenv').config();
console.log(process.env.MONGO_URI);

try {
  ConnectDB();
} catch (error) {
  console.log("Databaes connection error:",error);
  process.exit(1);
}

let isAppShow = false;

function showAppName() {
  return new Promise((resolve,reject) => {
    figlet("Book Store","Big",(err,data) => {
      if(err){
        console.log("Error:",err);
        return;
      }
      console.log(data.blue.bold);
      resolve();
    });  
  });
}

async function main() {
  try {
    if(!global.isAppShow) {
      await showAppName();
      global.isAppShow = true;
    }
    const { choice } = await inquirer.prompt([
    {
      type:'list',
      choices:[
        "Add Book",
        "Read Book",
        "Edit Book",
        "Delete Book",
        "List All Books",
        "Exit",
      ],
      name:'choice',
      message:"What would you like to do?",
      theme:{
        helpMode:'auto'
      },
      loop: false
    }
  ]);

  switch (choice) {
    case "Add Book":
      await AddBook()
      break;
    case "List All Books":
      await ListBooks()
      break;
    case "Read Book":
      await ReadBook()
      break;
    case "Delete Book":
      await DeleteBook()
      break;
    case "Edit Book":
      await EditBook()
      break;
    case "Exit":
      console.log("Thank you for using Book Store".blue);
      process.exit(0);
      break;
    default:
      break;
    }
    setImmediate(() => main());
  } catch(error) {
  console.error("An error occurred:".red, error);
  const { continueApp } = await inquirer.prompt({
    type:'confirm',
    name:'continueApp',
    message: 'Do you want to continue using the application?',
    default: true
  });
    if(continueApp) {
      setImmediate(() => main());
    } else {
    console.log("Exiting application. Goodbye!".yellow);
    process.exit(0);
    }
  }
}

main().catch(err => {
  console.error("Fatal error:".red.bold, err);
  process.exit(1);
});
