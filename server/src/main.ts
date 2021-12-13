import express = require("express");

const app = express();

app.use(express.static("./web/dist/"));
app.get("/", (request: express.Request, response: express.Response) => {
    response.sendFile("./web/dist/index.html");
});

app.listen(4340, () => {
    console.log("Server started!");
});
