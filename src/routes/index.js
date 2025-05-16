const testRouter = require('./test')
const authRouter = require('./auth')
const partnerRouter = require('./partner')
const hopDongRouter = require('./hopDong')

const route = (app) => {
    app.use(`/test`, testRouter)
    app.use(`/auth`, authRouter)
    app.use(`/partner`, partnerRouter)
    app.use(`/hopDong`, hopDongRouter)
}

module.exports = route;