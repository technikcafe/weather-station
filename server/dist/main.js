"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use(express.static("./web/dist/"));
app.get("/", (request, response) => {
    response.sendFile("./web/dist/index.html");
});
app.listen(4340, () => {
    console.log("Server started!");
});
