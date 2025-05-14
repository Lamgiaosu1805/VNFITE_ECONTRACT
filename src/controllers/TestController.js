const TestController = {
    index: (req, res, next) => {
        res.json({
            a: 1,
            b: 2
        })
    },
    ssoCallback: (req, res) => {
        try {
            const userId = "0326dde0-ac08-4455-a215-1e0bdd6eea70"
            res.json({
                error_code: "0",
                message: "Thành công",
                result: {
                    userId: userId,
                    status: "0"
                }
            })
        } catch (error) {
            res.json({
                error_code: "1",
                message: error,
            })
        }
    }
}

module.exports = TestController;