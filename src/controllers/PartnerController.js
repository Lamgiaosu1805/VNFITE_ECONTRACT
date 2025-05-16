const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const PartnerModel = require('../models/PartnerModel')
const { SuccessResponse, FailureResponse } = require('../utils/ResponseRequest')
const PartnerController = {
    createPartner: async (req, res) => {
        try {
            const { clientId, clientSecret } = req.body
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(clientSecret, salt)
            const newPartner = new PartnerModel({
                clientId: clientId,
                clientSecret: hashedPassword,
            })
            await newPartner.save()
            res.json(SuccessResponse({
                message: "Success"
            }))
        } catch (error) {
            res.json(FailureResponse("03", error))
            console.log(error)
        }
    }
}

module.exports = PartnerController