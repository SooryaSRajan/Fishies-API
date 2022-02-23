const Express = require("express");
const app = Express();
const PORT = process.env.PORT || 8000;
require("dotenv").config();
require("./config/database_config")();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
