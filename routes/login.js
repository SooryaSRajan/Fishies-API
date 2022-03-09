const Express = require("express");
const router = Express.Router();
const User = require("../models/user");
const {getAuth} = require("firebase-admin/auth");

module.exports = router.post("/", (req, res) => {
    const {firebaseToken} = req.body;

    if (!firebaseToken) {
        return res.status(400).json({
            message: "Firebase token is empty"
        });
    }

    getAuth()
        .verifyIdToken(firebaseToken)
        .then((decodedToken) => {
            console.log(decodedToken)
            const phoneNumber = decodedToken.phone_number

            //Check if phone number is valid
            if (!phoneNumber) {
                return res.status(400).json({
                    message: "Phone number is required"
                });
            }

            //get user from mongoose using phone number
            User.findOne({phone: phoneNumber}, (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Internal server error"
                        });
                    }

                    if (!user) {
                        return res.status(400).json({
                            message: "User does not exist"
                        });
                    }

                    //send token
                    res.status(200).json({
                        message: "Successfully authenticated!",
                        name: user.name,
                        token: user.generateAuthToken()
                    });
                }
            );


        })
        .catch((error) => {
            console.log(error);
            //return error
            res.status(400).json({
                message: "Invalid firebase token",
            });
        });

})
