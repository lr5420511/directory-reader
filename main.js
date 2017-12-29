"use strict";

const reader = require("./lib/file-reader");

console.log("print directory before (sync read)");
console.log(reader.GetDocuments("F:\\Mount&Blade Warband\\Data", false));
console.log("print directory after (sync read)");

reader.GetDocuments("F:\\Mount&Blade Warband\\Data", true, (err, documents) => {
    if (err) { throw err; }
    console.log(documents);
    console.log("print directory after async caller (callback)");
});
console.log("print directory before async caller (test async read)");