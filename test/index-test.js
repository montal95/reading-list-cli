const { concatArrToStr, responseHandler } = require("../index");
const expect = require("chai").expect;
const chai = require("chai");
const assertArrays = require("chai-arrays");
chai.use(assertArrays);

describe("concatArrToStr - concatenates Author arrays", () => {
  it("Returns No listing if no author is present", () => {
    const array = [undefined];
    expect(concatArrToStr(array)).to.equal("N/A");
  });
  it("Returns array with single key as a normal string", () => {
    const array = ["testing"];
    expect(concatArrToStr(array)).to.equal("testing");
  });
  it("Concatenates array entries into a string seperated by a comma and a space", () => {
    const array = ["testing", "one", "two", "three"];
    expect(concatArrToStr(array)).to.equal("testing, one, two, three");
  });
});

describe("responseHandler - transforms google response JSON", () => {
  it("Returns no listing for undefined author array", () => {
    const googleResponse = {
      data: {
        items: [
          {
            volumeInfo: {
              title: "Fake Book",
              authors: [undefined],
              publisher: "Penguin"
            }
          }
        ]
      }
    };

    const targetResponse = [
      {
        title: "Fake Book",
        author: "N/A",
        publishingcompany: "Penguin",
        name: "Fake Book by N/A, published by Penguin"
      }
    ];
    expect(responseHandler(googleResponse)).to.be.array(targetResponse);
  });

  it("Returns no listing for blank author array", () => {
    const googleResponse = {
      data: {
        items: [
          {
            volumeInfo: {
              title: "Fake Book",
              authors: [""],
              publisher: "Penguin"
            }
          }
        ]
      }
    };

    const targetResponse = [
      {
        title: "Fake Book",
        author: "N/A",
        publishingcompany: "Penguin",
        name: "Fake Book by N/A, published by Penguin"
      }
    ];
    expect(responseHandler(googleResponse)).to.be.array(targetResponse);
  });

  it("Returns finished listing for multiple authors in the array", () => {
    const googleResponse = {
      data: {
        items: [
          {
            volumeInfo: {
              title: "Fake Book",
              authors: ["Author One", "Author Two"],
              publisher: "Penguin"
            }
          }
        ]
      }
    };

    const targetResponse = [
      {
        title: "Fake Book",
        author: "Author One, Author Two",
        publishingcompany: "Penguin",
        name: "Fake Book by Author One, Author Two, published by Penguin"
      }
    ];
    expect(responseHandler(googleResponse)).to.be.array(targetResponse);
  });
});
