const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const PartnerModel = require('../models/PartnerModel')
const { FailureResponse } = require('../utils/ResponseRequest')

const auth = {
    verifyPartner: async (req, res, next) => {
        const token = req.headers.authorization
        if(token) {
            try {
                const {apiKey, secretKey} = req.body
                console.log(req.body)
                const partner = await PartnerModel.findOne({clientId: apiKey})
                if (!partner || (apiKey != "VNPT_ECONTRACT")) {
                    console.log("1")
                    return res.json({
                        error_code: "3",
                        message: "Partner không tồn tại",
                    })
                }
                const validPassWord = await bcrypt.compare(
                    secretKey,
                    partner.clientSecret
                )
                if(!validPassWord) {
                    console.log("2")
                    return res.json({
                        error_code: "3",
                        message: "Thông tin không đúng",
                    })
                }
                const accessToken = token.split(" ")[1];
                jwt.verify(accessToken, process.env.SECRET_KEY, async (err, data) => {
                    if(err) {
                        console.log(err)
                        res.json({
                            error_code: "3",
                            message: err,
                        })
                    }
                    else {
                        req.data = data;
                        next()
                    }
                })
            } catch (error) {
                console.log(error)
                return res.json({
                    error_code: "3",
                    message: error,
                })
            }

            next()
        } else {
            res.json({
                error_code: "2",
                message: "Not Authenticated",
            })
            console.log("Not Authenticated")
        }
    },
    verifyTokenPartner: async (req, res, next) => {
        const token = req.headers.authorization
        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.PARTNER_AUTH_KEY, async (err, data) => {
                if(err) {
                    console.log(err)
                    res.json(FailureResponse("09", err))
                }
                else {
                    req.data = data;
                    next()
                }
            })
        } else {
            res.json(FailureResponse("08"))
            console.log("Not Authenticated")
        }
    }
}

module.exports = auth