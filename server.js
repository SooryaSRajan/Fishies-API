const Express = require("express");
const app = Express();
const PORT = process.env.PORT || 8000;

const registerUser = require("./routes/register")
const loginUser = require("./routes/login")

require("dotenv").config();
require("./config/database_config")();

let admin = require("firebase-admin");
const serviceAccount = require("./config/firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
app.use(Express.json());
app.use("/register", registerUser);
app.use("/login", loginUser);

// const {google} = require("googleapis");
// const fs = require('fs')
//
// const SCOPES = ['https://www.googleapis.com/auth/drive']
// console.log(__dirname + '/config/key.json')
// const auth = new google.auth.GoogleAuth(
//     {
//         keyFile: __dirname + '/config/key.json',
//         scopes: SCOPES
//     }
// );
//
// createAndUpload(auth).catch(console.error)
//
// async function createAndUpload(auth) {
//     const drive = google.drive({
//         version: 'v3',
//         auth: auth,
//     });
//
//     let fileMetaData = {
//         'name': 'fish.png',
//         'parents': [process.env.PARENT_FOLDER]
//     }
//
//     let media = {
//         mimeType: 'image/png',
//         body: fs.createReadStream('path to file here')
//     }
//
//     let response = await drive.files.create({
//         resource: fileMetaData,
//         media: media,
//         fields: 'id'
//     })
//
//     drive.files.list().then(r => {
//         console.log(r.data.files)
//     })
//
//
//     if(response.status === 200){
//         console.log('File has been created, id: ', response.data.id);
//     }
//     else{
//         console.log('Error writing file: ', response.errors);
//     }
// }


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
