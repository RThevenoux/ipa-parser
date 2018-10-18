var expect = require("chai").expect;

var parser = require("../src/index.js").parser;
var IpaSyntaxError = require("../src/error/ipa-syntax-error.js");

describe('ipa-parser : bracket', () => {

  it("should be 'none' if there is no bracket", () => {
    expect(parser.parse("")).to.have.property('type', 'none');
    expect(parser.parse("a")).to.have.property('type', 'none');
  });
  it("should be 'phonemic' if there is // brackets", () => {
    expect(parser.parse("/a/")).to.have.property('type', 'phonemic');
  });
  it("should be 'phonetic' if there is [] brackets", () => {
    expect(parser.parse("[a]")).to.have.property('type', 'phonetic');
  });

  it("should fail if data outside of the brackets", () => {
    expect(() => parser.parse("a[a]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[a]a")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("a[a]a")).to.throw(IpaSyntaxError);
  });
  it("should fail if a bracket is not paired", () => {
    expect(() => parser.parse("[a")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("]a")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("a[")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("a]")).to.throw(IpaSyntaxError);
  });
  it("should fail if opening and closing bracket are not matching", () => {
    expect(() => parser.parse("[a/")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("/a]")).to.throw(IpaSyntaxError);
  });
  it("should fail if there is more than 2 brackets", () => {
    expect(() => parser.parse("[a]]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[[a]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[[a]]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[a]a]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[a[a]")).to.throw(IpaSyntaxError);
    expect(() => parser.parse("[a[a]a]")).to.throw(IpaSyntaxError);
  });
});