const { default: axios } = require("axios")
const redis = require("../config/connectRedis")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const HopDongController = {
    renderHD: async (req, res) => {
        try {
            const userTokenVNPT = await redis.get('tokenUserVnpt:TIKLUY')
            const {templateId, fullname, cccd, hoKhauThuongTru, diaChiHienTai, soDienThoai, ngayKy, thangKy, namKy} = req.body
            const response = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/template-service/api/templates/${templateId}/render`, {
                "${fullname}": fullname,
                "${cccd}": cccd,
                "${hoKhauThuongTru}": hoKhauThuongTru,
                "${diaChiHienTai}": diaChiHienTai,
                "${soDienThoai}": soDienThoai,
                "${ngayKy}": ngayKy,
                "${thangKy}": thangKy,
                "${namKy}": namKy,
                "${soTaiKhoan}": "",
            }, {
                headers: {
                    Authorization: 'Bearer ' + userTokenVNPT
                },
                responseType: 'stream'
            })
            res.setHeader('Content-Type', response.headers['content-type']);
            res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'inline');
            response.data.pipe(res);
        } catch (error) {
            res.json(FailureResponse("04", error))
            console.log(error)
        }
    },
    getChiTietHD: async (req, res) => {
        try {
            const {templateId} = req.params
            const userTokenVNPT = await redis.get('tokenUserVnpt:TIKLUY')
            const response = await axios.get(`${process.env.HOST_VNPT_ECONTRACT}/template-service/api/templates/v1/${templateId}/all-config`, {
                headers: {
                    Authorization: 'Bearer ' + userTokenVNPT
                }
            })
            res.json(SuccessResponse({
                message: "Success",
                data: {
                    templateFields: response.data.object.templateFields,
                    templateName: response.data.object.templateName,
                    templateId: templateId
                }
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("10", error))
        }
    }
}

module.exports = HopDongController