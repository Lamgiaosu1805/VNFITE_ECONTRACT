const testRouter = require('./test')
const authRouter = require('./auth')

const route = (app) => {
    app.use(`/test`, testRouter)
    app.use(`/auth`, authRouter)
}

module.exports = route;