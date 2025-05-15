const TestController = {
    index: (req, res, next) => {
        res.json({
            a: 1,
            b: 2
        })
    },
    ssoCallback: (req, res) => {
        try {
            const userId = "e543d1fd-5a88-4369-baef-98947a485dbc"
            res.json({
                error_code: "0",
                message: "Thành công",
                result: {
                    userId: userId,
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
    }
}

module.exports = TestController;