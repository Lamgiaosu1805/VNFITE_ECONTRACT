const PartnerModel = require("../models/PartnerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const AuthController = {
    getTokenPartner: async (req, res) => {
        try {
            const {clientId, clientSecret} = req.body
            const partner = await PartnerModel.findOne({clientId: clientId, isDelete: false})
            if(!partner) {
                return res.json(FailureResponse("05"))
            }
            const validPassWord = await bcrypt.compare(
                clientSecret,
                partner.clientSecret
            )
            if(!validPassWord) {
                return res.json(FailureResponse("06"))
            }
            const accessToken = jwt.sign({
                clientId: clientId,
                partnerId: partner._id,
            },
                process.env.PARTNER_AUTH_KEY,
                {
                    expiresIn: "1d"
                }
            )
            res.json(SuccessResponse({
                message: "Success",
                accessToken: accessToken,
                expiresIn: 3600 * 24
            }))
        } catch (error) {
            console.log(error)
            return res.json(FailureResponse("07", error))
        }
    }
}

module.exports = AuthController