const fs = require("fs");
const path = require("path");

const traverse = require("@babel/traverse").default;
const parser = require("@babel/parser");
const prettier = require("prettier");

const { getVisiter } = require("./index");

const filename = path.resolve(__dirname, "./test/user.ts");
const modelFilename = path.resolve(__dirname, "./test/user-model.ts");
const str = fs.readFileSync(filename, { encoding: "utf-8" });

const result = parser.parse(str, {
  plugins: ["typescript"],
});
const modelstr = [];
traverse(result, getVisiter(modelstr));

const saveModel = (path, str) => {
  const write = () =>
    fs.writeFile(path, str, (err) => {
      if (err) console.log(err);
    });
  fs.stat(path, (err, stats) => {
    if (err) return write();
    if (stats.isDirectory()) return console.log("isDirectory");
    write();
  });
};

saveModel(modelFilename, prettier.format(modelstr.join("\n"), {parser: 'babel'}));
