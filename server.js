const Express = require("express");
const app = Express();
const PORT = process.env.PORT || 8000;

const registerUser = require("./routes/register")
const loginUser = require("./routes/login")
const uploadCatchData = require("./routes/upload_catch_data")
const getCatchData = require("./routes/get_catch_data")

require("dotenv").config();
require("./config/database_config")();

//TODO:Uncomment the following block of code when google-drive is used for storage
//
// let admin = require("firebase-admin");
// const serviceAccount = require("./config/firebase.json");
//
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

app.use(Express.json());
app.use("/register", registerUser);
app.use("/login", loginUser);
app.use("/uploadCatchData", uploadCatchData);
app.use("/getCatchData", getCatchData);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
