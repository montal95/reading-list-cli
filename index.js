const Datastore = require("nedb");
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const ReadingList = new Datastore({ filename: "./db/readingList.db" });
ReadingList.loadDatabase();

const createEnv = keyInfo => {
  const envData = `GOOGLE_API_KEY="${keyInfo}"`;
  fs.writeFile(".env", envData, err => {
    if (err) throw err;
    console.info("API key saved!");
  });
};

//Search for book to add to Reading List
const searchBook = async function(book) {
  console.info(`Searching for: ${book}`);
  let googleResponse;
  //Using axios to make the query to the Google API
  try {
    googleResponse = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        //set paramaters for the query
        params: {
          q: book,
          key: process.env.GOOGLE_API_KEY,
          maxResults: 5
        }
      }
    );
  } catch (err) {
    console.info(`API Error: ${err.message}`);
    console.info("Canceling all actions");
    //terminate();
    return;
  }
  return responseHandler(googleResponse);
};

//cleans response data from google API query
const responseHandler = res => {
  //console.info(res.data.items);
  let responseArray = res.data.items;
  //Empty array variable
  let searchResults = [];
  //loop through results and clean it up for user display and prep for DB
  for (let i = 0; i < responseArray.length; i++) {
    const bookInfo = responseArray[i].volumeInfo;
    const title = bookInfo.title;
    const authors = concatArrToStr(bookInfo.authors);
    const publisher =
      bookInfo.publisher === "" || bookInfo.publisher === undefined
        ? "N/A"
        : bookInfo.publisher;

    //loop through API query results to return only important information
    searchResults[i] = {
      title: title,
      author: authors,
      publishingcompany: publisher,
      name: `${title} by ${authors}, published by ${publisher}`
    };
  }

  //returned cleaned up result array
  return searchResults;
};

const concatArrToStr = arr => {
  let str = "";
  if (arr === undefined || arr[0] === "" || arr[0] === undefined) {
    return (str = "N/A");
  }
  for (let i = 0; i < arr.length; i++) {
    i === 0 ? (str = arr[0]) : (str = `${str}, ${arr[i]}`);
  }
  return str;
};

//Add book to the reading list
const addBook = book => {
  if (book === "Cancel") {
    return;
  }

  ReadingList.insert(book, (err, doc) => {
    if (err) throw err;
    console.info("New Book Added to Reading List:");
    console.info(doc);
  });
};

//Delete book from reading list
const removeBook = _id => {
  const idToRemove = { _id: `${_id}` };
  ReadingList.remove(idToRemove, (err, numRemoved) => {
    if (err) throw err;
    console.info(`${numRemoved} book removed from reading list`);
  });
};

//Full reading list
const fullList = () => {
  ReadingList.find({}, (err, docs) => {
    if (err) throw err;
    console.info(docs);
  });
};

module.exports = {
  searchBook,
  addBook,
  fullList,
  removeBook,
  concatArrToStr,
  responseHandler,
  createEnv
};
