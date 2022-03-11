const Express = require("express");
const router = Express.Router();
const middleWare = require("../middleware/user_auth")
const CatchData = require("../models/catch_data");


module.exports = router.post("/", middleWare, (req, res) => {

    const {species} = req.body

    let filter = {}
    if (species) {
        filter = {
            species: species
        }
    }

    CatchData.find(filter, function (err, catchData) {
        if (!err) {
            if(catchData.length === 0){
                return res.status(200).send({
                    message: "No data for the given species was found",
                })
            }
            return res.status(200).send({
                message: "Data for the given species was found",
                data: catchData
            })
        } else {
            return res.status(400).send({
                message: "No data for the given species was found",
            })
        }
    })
});

