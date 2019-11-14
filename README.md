# Reading List CLI

### Developed by Samuel Montalvo Jr

Command Line Interface that uses the Google Books API, MongoDB and Node.js to create a localized reading list

## Setup and instructions

1. Update to the latest version of Node and NPM. Do this by running `npm install npm -g` in the terminal
2. Obtain an api key to access the Google Books API. Go here to request the appropriate key: https://console.developers.google.com
3. Clone the repo to your computer by entering `git clone https://github.com/montal95/reading-list-cli.git` into the terminal
4. Change directories to the reading-list-cli folder by entering `cd reading-list-cli` in the terminal
5. Run `npm install` in the terminal
6. After installation is complete run `npm link`
7. **Important:** Run `reading-list-cli key <API_KEY>` with the API key from step 2. This should create a .env file on your local directory. *Ignoring this step will prevent you from using the search command.*
8. Enter `reading-list-cli --help` for a list of commands, with examples on how to input each user action.
9. When finished, enter `npm unlink` in the reading-list-cli directory in the terminal

#### Technologies used:

- Node.js
- Inquirer
- Commander
- NeDB
- Axios
- Google Books API
- dotenv

### CLI Command Listings

Options:

- `-V`, `--version`: output the version number
- `-h`, `--help`: output usage information

Commands:

- `key|k <key>`: Saves the API Key to search books for the reading list
- `search|s ['<title>']`: Searches for a book. Can use multiple words to search in
  between the (' ')
- `list|l`: Displays the entire reading List
- `remove|r <_id>`: Removes book from the reading list. Requires \_id from reading list entry
