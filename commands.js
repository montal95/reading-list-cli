#!/usr/bin/env node
const program = require("commander");
const { prompt } = require("inquirer");
const { searchBook, addBook, fullList, removeBook } = require("./index");

program.version("1.0.0").description("Local Reading List");

program
  .command("search ['<title>']")
  .alias("s")
  .description("Search for a book")
  .action(title => {
    searchBook(title).then(res => {
      //console.info(res);
      const question = {
        type: "list",
        choices: res,
        message: "Which book do you want to save?",
        name: "name"
      };
      prompt(question).then(choice => {
        // prompt returns only object name. Switch case used match choice name with object
        switch (choice.name) {
          case res[0].name:
            console.info(`Saving: ${res[0].name}`);
            addBook(res[0]);
            break;
          case res[1].name:
            console.info(`Saving: ${res[1].name}`);
            addBook(res[1]);
            break;
          case res[2].name:
            console.info(`Saving: ${res[2].name}`);
            addBook(res[2]);
            break;
          case res[3].name:
            console.info(`Saving: ${res[3].name}`);
            addBook(res[3]);
            break;
          case res[4].name:
            console.info(`Saving: ${res[4].name}`);
            addBook(res[4]);
            break;
          default:
            console.info("Oops! No match found");
        }
      });
    });
  });

program
  .command("list")
  .alias("l")
  .description("Displays the entire reading List")
  .action(() => fullList());

program
  .command("remove <_id>")
  .alias("r")
  .description("Removes book from the reading list")
  .action(_id => removeBook(_id));

program.parse(process.argv);
