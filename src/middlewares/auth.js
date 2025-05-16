const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const PartnerModel = require('../models/PartnerModel')

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
                const userId = "e543d1fd-5a88-4369-baef-98947a485dbc"
                const accessToken = jwt.sign({
                    userId: userId,
                    contractId: "Lâm đẹp trai vl"
                },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "365d"
                    }
                )
                console.log(accessToken)
                next()
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
    }
}

module.exports = auth