# Reading List CLI

### Developed by Samuel Montalvo Jr

Command Line Interface that uses the Google Books API, MongoDB and Node.js to create a localized reading list

## Setup and instructions

1. Update to the latest version of Node and NPM. Do this by running `npm install npm -g` in the terminal
2. Update MongoDB via the terminal with `brew upgrade mongodb`
3. Obtain an api key to access the Google Books API. Go here to request the appropriate key: https://console.developers.google.com
4. Clone the repo to your computer
5. In the terminal run `mongod` to run mongoDB on a local port.
6. In a seperate terminal, change directories to the reading-list-cli folder and run `npm install`
7. Input your API key in the index.js file and replace `keys.googleAPIKey` on line 37 for your own key.
8. After installation is complete run `npm link`
9. Enter `reading-list-cli --help` for a list of commands, with examples on how to input each user action.
10. When finished, enter `npm unlink` in the reading-list-cli terminal and ctrl+C the terminal that ran `mongod`

#### Technologies used:

- Node.js
- Inquirer
- Commander
- MongoDB/Mongoose
- Axios
- Google Books API

### CLI Command Listings
Options:
-   `-V`, `--version`:        output the version number
-   `-h`, `--help`:             output usage information

Commands:
-  `search|s ['<title>']`:  Searches for a book. Can use multiple words to search in 
                        between the (' ')
-  `list|l`:             Displays the entire reading List
-  `remove|r <_id>`:       Removes book from the reading list. Requires _id from reading list entry