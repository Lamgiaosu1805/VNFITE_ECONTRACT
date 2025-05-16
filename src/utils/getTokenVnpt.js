const { default: axios } = require("axios")

const getTokenVnpt = {
    tokenUser: async () => {
        const response = await axios.post(process.env.HOST_VNPT_ECONTRACT, {
            client_id: process.env.CLIENT_ID_VNPT_ECONTRACT,
            client_secret: process.env.CLIENT_SECRET_VNPT_ECONTRACT,
            username: process.env.USERNAME_VNPT_ECONTRACT,
            password: process.env.PASSWORD_VNPT_ECONTRACT,
            domain: process.env.DOMAIN_VNPT_ECONTRACT,
            grant_type: process.env.GRANT_TYPE_VNPT_ECONTRACT
        })
        return {
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        }
    }
}

module.exports = getTokenVnpt