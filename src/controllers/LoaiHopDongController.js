const LoaiHopDong = require('../models/LoaiHopDongModel');
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const createLoaiHopDong = async (req, res) => {
    const { title, idHopDongMau, madeBy } = req.body;
    if (!title || !idHopDongMau || !madeBy) {
      return res.json(FailureResponse("08","Thiếu thông tin bắt buộc"));
    }
    const newLoaiHopDong = new LoaiHopDong({
      title,
      idHopDongMau,
      madeBy
    });
    try {
    await newLoaiHopDong.save();
        return res.json(SuccessResponse({
            message: "Tạo loại hợp đồng thành công",
            data: newLoaiHopDong
    }));
  } catch (error) {
    console.error(error);
    return res.json(FailureResponse("09", "Lỗi khi tạo loại hợp đồng"));
  }
};
module.exports = {createLoaiHopDong};