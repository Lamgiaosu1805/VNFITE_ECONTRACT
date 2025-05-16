const cron = require('node-cron');
const getTokenVnpt = require('../utils/getTokenVnpt');
const redis = require('../config/connectRedis');

module.exports = () => {
    cron.schedule('0 */6 * * *', async () => {
        try {
            const data = await getTokenVnpt.tokenUser()
            await redis.set('tokenUserVnpt:TIKLUY', data.access_token, "EX", 3600 * 23)
            console.log("JOB Update Token User VNPT TIKLUY: Success")
        } catch (error) {
            console.log("JOB Update Token user VNPT TIKLUY Failure")
            console.log(error)
        }
    }) 
}