"use strict";

const fs = require("fs");
const path = require("path");

exports.GetDocuments = function(dirPath, isAsync, asyncCallBack) {
    if (typeof dirPath !== "string" || dirPath === "") {
        throw new TypeError("GetDocuments: dirPath isn't a vaild directory");
    }
    if (typeof isAsync !== "boolean") {
        isAsync = true;
    }
    dirPath = path.normalize(dirPath);
    let readdirMethod = isAsync ? fs.readdir : fs.readdirSync,
        documents = readdirMethod.apply(
            fs, [
                dirPath,
                (err, documents) => {
                    if (err instanceof Error &&
                        asyncCallBack instanceof Function) {
                        asyncCallBack(err);
                    } else {
                        if (err instanceof Error) {
                            throw err;
                        }
                        (function EachDocument(docs, index) {
                            if (docs.length <= index) {
                                if (asyncCallBack instanceof Function) {
                                    asyncCallBack(err, docs);
                                }
                            } else {
                                let currentDoc = path.join(dirPath, docs[index]);
                                fs.stat(currentDoc, (err, state) => {
                                    if (state.isDirectory()) {
                                        exports.GetDocuments(currentDoc, isAsync, (err, documents) => {
                                            docs[index] = documents;
                                            EachDocument(docs, ++index);
                                        });
                                    } else {
                                        EachDocument(docs, ++index);
                                    }
                                });
                            }
                        })(documents, 0)
                    }
                }
            ]
        );
    if (documents instanceof Array) {
        documents.forEach((doc, index) => {
            let currentDoc = path.join(dirPath, doc),
                currentState = fs.statSync(currentDoc);
            if (currentState.isDirectory()) {
                documents[index] = exports.GetDocuments(currentDoc, isAsync, asyncCallBack);
            }
        });
    }
    return documents;
};