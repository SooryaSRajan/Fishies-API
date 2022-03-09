const Express = require("express");
const router = Express.Router();

const middleWare = require("../middleware/user_auth")

module.exports = router.post("/", middleWare,  (req, res) => {

    res.status(200).send("Yay")
})
