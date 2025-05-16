const testRouter = require('./test')
const authRouter = require('./auth')
const partnerRouter = require('./partner')

const route = (app) => {
    app.use(`/test`, testRouter)
    app.use(`/auth`, authRouter)
    app.use(`/partner`, partnerRouter)
}

module.exports = route;