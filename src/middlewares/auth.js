const jwt = require('jsonwebtoken')
const PartnerModel = require('../models/PartnerModel')
// const { FailureResponse } = require('../utils/ResponseRequest')
// const AdminAccountModel = require('../models/AdminAccountModel')
// const CustomerModel = require('../models/CustomerModel')

const auth = {
    // verifyTokenAdmin: (req, res, next) => {
    //     // verifyToken(true, req, res, next, false)
    // },
    // verifyTokenCustomerNonEkyc: (req, res, next) => {
    //     // verifyToken(false, req, res, next, false)
    // },
    // verifyTokenCustomer: (req, res, next) => {
    //     // verifyToken(false, req, res, next, true)
    // },
    verifyPartner: async (req, res, next) => {
        const token = req.headers.authorization
        if(token) {
            try {
                const {apiKey, secretKey} = req.body
                const partner = await PartnerModel.findOne({clientId: apiKey})
                if (!partner || apiKey != "VNPT_ECONTRACT") {
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

// const verifyToken = (isAdmin, req, res, next, requireEkyc) => {
//     const token = req.headers.authorization;
//     if(token) {
//         const accessToken = token.split(" ")[1];
//         jwt.verify(accessToken, isAdmin == true ? process.env.SECRET_KEY_QT : process.env.SECRET_KEY, async (err, user) => {
//             if(err) {
//                 console.log(err)
//                 res.json(FailureResponse('20', err))
//             }
//             else {
//                 req.user = user;
//                 req.isAdmin = isAdmin;
//                 try {
//                     var validatedUser
//                     isAdmin == true ? validatedUser = await AdminAccountModel.findById(user.id) : validatedUser = await CustomerModel.findById(user.id)
//                     if(!isAdmin && validatedUser.isEkyc == false && requireEkyc) {
//                         return res.json(FailureResponse("28"))
//                     }
//                     if(!validatedUser?.isDelete) {
//                         next();
//                     }
//                     else {
//                         res.json(FailureResponse("04"))
//                     }
//                 } catch (error) {
//                     console.log(error)
//                     res.json(FailureResponse("21", error))
//                 }
//             }
//         })
//     } else {
//         res.json(FailureResponse('22'))
//         console.log("Not Authenticated")
//     }
// }

module.exports = auth