const { default: axios } = require("axios")
const redis = require("../config/connectRedis")
const { FailureResponse } = require("../utils/ResponseRequest")

const HopDongController = {
    renderChiTietHD: async (req, res) => {
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
    }
}

module.exports = HopDongController