const redis = require("../config/connectRedis")
const getTokenVnpt = require("../utils/getTokenVnpt")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const TestController = {
    ssoCallback: async (req, res) => {
        try {
            const data = req.data
            console.log(data)
            res.json({
                error_code: "0",
                message: "Thành công",
                result: {
                    userId: data.userId,
                    status: "0"
                }
            })
            console.log("Call back thành công")
        } catch (error) {
            console.log(error, "ERR")
            res.json({
                error_code: "1",
                message: error,
            })
        }
    },
    getTokenUserVNPT: async (req, res) => {
        try {
            const data = await getTokenVnpt.tokenUser()
            await redis.set('tokenUserVnpt:TIKLUY', data.access_token, "EX", 3600 * 23)
            res.json(SuccessResponse({
                message: "Success",
                data: data
            }))
        } catch (error) {
            res.json(FailureResponse("01", error))
        }
    },
    getTokenThirdPartyVNPT: async (req, res) => {
        try {
            const data = await getTokenVnpt.tokenThirdParty()
            await redis.set('tokenThirdPartyVnpt:TIKLUY', data.access_token, "EX", 3600 * 23)
            res.json(SuccessResponse({
                message: "Success",
                data: data
            }))
        } catch (error) {
            res.json(FailureResponse("02", error))
        }
    }
}

module.exports = TestController;