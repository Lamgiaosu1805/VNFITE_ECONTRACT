const LoaiHopDongModel = require('../models/LoaiHopDongModel');
const { FailureResponse, SuccessResponse } = require('../utils/ResponseRequest');

const LoaiHopDongController = {
    createLoaiHopDong: async (req, res) => {
        try {
            const { title, idHopDongMau, madeBy } = req.body;
            if (!title || !idHopDongMau || !madeBy) {
                return res.json(FailureResponse("08", "Thiếu thông tin"));
            }

            const newLoaiHopDong = new LoaiHopDongModel({
                title,
                idHopDongMau,
                madeBy
            });

            await newLoaiHopDong.save();
            return res.json(SuccessResponse({
                message: "Tạo loại hợp đồng thành công",
                data: newLoaiHopDong
            }));
        } catch (error) {
            console.error(error);
            return res.json(FailureResponse("09", "Lỗi khi tạo loại hợp đồng"));
        }
    }
};

module.exports = LoaiHopDongController; 
