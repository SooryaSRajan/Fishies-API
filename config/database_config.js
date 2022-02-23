const mongoose = require("mongoose");
require("dotenv").config();

function ConnectDatabase() {
    console.log("Connecting to database...")
    const DatabaseConnection = mongoose.connect(
        process.env.DBCONN
    );

    DatabaseConnection.then(() => {
        console.log("Database connection was successful!");
    });
    DatabaseConnection.catch((error) => {
        console.log(`Database connection refused`, error);
    });
}

module.exports = ConnectDatabase;
