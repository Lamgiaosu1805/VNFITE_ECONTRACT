const { default: axios } = require("axios")

const getTokenVnpt = {
    tokenUser: async () => {
        console.log(`${process.env.HOST_VNPT_ECONTRACT}/auth-service/oauth/token`)
        const response = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/auth-service/oauth/token`, {
            client_id: process.env.CLIENT_ID_VNPT_ECONTRACT,
            client_secret: process.env.CLIENT_SECRET_VNPT_ECONTRACT,
            username: process.env.USERNAME_VNPT_ECONTRACT,
            password: process.env.PASSWORD_VNPT_ECONTRACT,
            domain: process.env.DOMAIN_VNPT_ECONTRACT,
            grant_type: "password"
        })
        return {
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        }
    },
    tokenThirdParty: async () => {
        const response = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/auth-service/oauth/token`, {
            client_id: process.env.CLIENT_ID_VNPT_ECONTRACT,
            client_secret: process.env.CLIENT_SECRET_VNPT_ECONTRACT,
            grant_type: "client_credentials"
        })
        return {
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        }
    }
}

module.exports = getTokenVnpt