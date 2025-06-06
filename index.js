require('dotenv').config();
const express = require('express')
const app = express()
const route = require('./src/routes')
const morgan = require('morgan')
const db = require('./src/config/connectDB')

//use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

db.connect();

// Khởi tạo job
require('./src/jobs')();

//routing
route(app);

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})