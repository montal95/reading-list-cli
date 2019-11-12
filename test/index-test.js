const { concatArrToStr } = require("../index");
const expect = require("chai").expect;

describe("ConcatArrToStr", function() {
  it("Returns No listing if no author is present", function() {
    let array;
    expect(concatArrToStr(array)).to.equal("No authors listed");
  });
  it("Returns array with single key as a normal string", function() {
    const array = ["testing"];
    expect(concatArrToStr(array)).to.equal("testing");
  });
  it("Concatenates array entries into a string seperated by a comma and a space", function() {
    const array = ["testing", "one", "two", "three"];
    expect(concatArrToStr(array)).to.equal("testing, one, two, three");
  });
});
