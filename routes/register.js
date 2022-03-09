const Express = require("express");
const router = Express.Router();
const User = require("../models/user");
const {getAuth} = require("firebase-admin/auth");

module.exports = router.post("/", (req, res) => {
    const { name, firebaseToken } = req.body;

    if (!firebaseToken) {
        return res.status(400).json({
            message: "Firebase token is empty"
        });
    }

    getAuth()
        .verifyIdToken(firebaseToken)
        .then((decodedToken) => {
            console.log(decodedToken)
            const uid = decodedToken.uid;
            const phoneNumber = decodedToken.phone_number

            //Check if name is valid
            if (!name) {
                return res.status(400).json({
                    message: "Name is required"
                });
            }

            //check if name has numbers
            if (name.match(/[0-9]/)) {
                return res.status(400).json({
                    message: "Name cannot contain numbers"
                });
            }

            //Check if phone number is valid
            if (!phoneNumber) {
                return res.status(400).json({
                    message: "Phone number is required"
                });
            }

            //save to mongoose
            const user = new User({
                name: name,
                phone: phoneNumber,
                uid: uid
            });

            //promise from save
            user.save(
                (err, user) => {
                    //check if err is not null
                    if (err)
                        if (err.code === 11000) {
                            return res.status(400).json({
                                message: "User already exists",
                            });
                        }
                        else {
                            return res.status(500).json({
                                message: "Internal server error",
                                error: err
                            });
                        }
                    else
                        //If no error, send back success message
                        return res.status(200).json({
                            message: "Successfully registered",
                            name: user.name,
                            token: user.generateAuthToken()
                        });
                }
            )
        })
        .catch((error) => {
            console.log(error);
            //return error
            res.status(400).json({
                message: "Invalid firebase token",
            });
        });

})
