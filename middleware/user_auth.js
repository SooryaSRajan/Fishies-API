const User = require("../models/user")
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const receiveToken = req.header("user-auth-token");
    if (!receiveToken) {
        return res.status(412).json({
            message: "Please attach request token"
        });
    }

    try {
        const decodedToken = jwt.verify(receiveToken, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;

        //check if user id is in database using findById
        User.findById(decodedToken._id, (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                });
            }

            if (!user) {
                return res.status(412).json({
                    message: "User does not exist"
                });
            }
            else {
                next();
            }

        })
    } catch (error) {
        return res.status(412).json({
            message: "Invalid token"
        });
    }

}
