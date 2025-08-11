const cron = require('node-cron');
const getTokenVnpt = require('../utils/getTokenVnpt');
const redis = require('../config/connectRedis');

module.exports = () => {
    cron.schedule('0 */7 * * *', async () => {
        try {
            const data = await getTokenVnpt.tokenUserThirdPartyVNF()
            await redis.set('tokenThirdPartyVnpt:VNFITE', data.access_token, "EX", 3600 * 23)
            console.log("JOB Update Token Third Party VNPT VNFITE: Success")
        } catch (error) {
            console.log("JOB Update Token Third Party VNPT VNFITE Failure")
            console.log(error)
        }
    }) 
}