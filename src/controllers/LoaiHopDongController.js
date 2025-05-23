const LoaiHopDongModel = require('../models/LoaiHopDongModel');
const { FailureResponse, SuccessResponse } = require('../utils/ResponseRequest');

const LoaiHopDongController = {
    createLoaiHopDong: async (req, res) => {
        try {
            const { title, idHopDongMau, madeBy } = req.body;
            if (!title || !idHopDongMau || !madeBy) {
                return res.json(FailureResponse("13", "Thiếu thông tin"));
            }

            const newLoaiHopDong = new LoaiHopDongModel({
                title,
                idHopDongMau,
                madeBy
            });
            
            await newLoaiHopDong.save();
            res.json(SuccessResponse({
                message: "Tạo loại hợp đồng thành công",
                data: newLoaiHopDong
            }));
        } catch (error) {
            console.error(error);
            res.json(FailureResponse("14", error));
        }
    }
};

module.exports = LoaiHopDongController; 
