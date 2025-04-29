const readline = require("readline-sync");
const { BooksModel } = require("./db/books.models");
const Table = require("cli-table3");
const { default: inquirer } = require("inquirer");


exports.AddBook = async () => {
  const title = readline.question("Enter Book Title : ")
  if(!title) {
    console.log("Title can not be empty".red);
    this.AddBook()
    return
  }
  const content = readline.question("Enter Book Content : ")
  if(!content){
    console.log("Content can not be empty");
    this.AddBook()
    return
  }
  const author = readline.question("Enter Book Author Name : ", {
    defaultInput: 'admin'
  })

  await BooksModel.create({
    title,
    content,
    author
  })
  console.log("Book added successfully".green);
}

exports.ListBooks = async () => {
  const table = new Table({
    head: ["ID", 'Title', 'Author','isPublished'],
    colWidths: [30, 50, 20, 25],
    style:{
      head: ['blue'],
      border:{
        top: 'blue',
        bottom:'blue',
        left:'blue',
        right:'blue',
        horizontal:'blue',
        vertical:'blue'
      }
    }
  })

  const books = await BooksModel.find({})

  books.forEach((cur)=> {
    table.push([String(cur._id),cur.title,cur.author,cur.isPublished? "Published".blue:"Not Published".red])
  })
  console.log(table.toString());
}

exports.ReadBook = async () => {
  const table2 = new Table();
  const books = await BooksModel.find({})

  let list_arr = []

  books.forEach((cur)=> {
    list_arr.push(`${cur._id} - ${cur.title} || ${cur.author}`)
  })

  const { bookId } = await inquirer.prompt([
    {
      type:'list',
      message: 'Select Book: ',
      choices: list_arr,
      filter:(data)=>data.split("-")[0].trim(),
      name:'bookId'
    }
  ])

  const book = await BooksModel.findById(bookId)

  table2.push(
    {
      'ID': String(book._id),
    },
    {
      'Title': book.title,
    },
    {
      'Author': book.author,
    },
    {
      'content': book.content,
    },
    {
      'isPublished': book.isPublished? "Published".blue : "Not Published".red
    }
  )
  console.log(table2.toString());
}

exports.EditBook = async () => {
  const books = await BooksModel.find({})

  let list_arr = []
  books.forEach((cur) => {
    list_arr.push(`${cur._id} - ${cur.title} - ${cur.author}`)
  })

  const {bookId, confirm } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select Book: ',
      choices: list_arr,
      filter: (data) => data.split("-")[0].trim(),
      name: 'bookId'
    },
    {
      type:"confirm",
      message: "Do you wanty to publish this book?",
      name:"confirm"
    }
  ])

  if(confirm) {
    await BooksModel.findByIdAndUpdate(bookId, {
      isPublished: true
    })
    console.log("book published successfully".blue)
    return
  }
  console.log("book not published".blue);
}

exports.DeleteBook = async () => {
  const books = await BooksModel.find({})
  let list_arr = []
  books.forEach((cur) => {
  list_arr.push(`${cur._id} - ${cur.title} || ${cur.author}`)
  })

  const {bookId, confirm} = await inquirer.prompt([
    {
      type: 'list',
      message: "Select Book: ",
      choices: list_arr,
      filter:(data)=>data.split("-")[0].trim(),
      name: 'bookId'
    }, {
      type:"confirm",
      message: 'Do you want to delete this book?',
      name: 'confirm'
    }
  ])

  if(confirm) {
    await BooksModel.findByIdAndDelete(bookId)
    console.log("Book deleted successfully".blue)
    return
  }
}