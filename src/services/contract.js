const axios = require("axios");
const FormData = require("form-data");
const HopDongModel = require("../models/HopDongModel");
const redis = require("../config/connectRedis")

const processHopDongChuaTai = async () => {
    const userTokenVNPT = await redis.get('tokenUserVnpt:TIKLUY');
    const hopDongChuaTai = await HopDongModel.find({ idFile: "" });

    if (hopDongChuaTai.length === 0) {
        return { message: "No contracts to process", data: [] };
    }

    const errors = [];
    const success = [];

    for (const hopDong of hopDongChuaTai) {
        try {
        const chiTietHDRes = await axios.get(
            `${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${hopDong.idHopDong}`,
            { headers: { Authorization: 'Bearer ' + userTokenVNPT } }
        );

        const downloadHDRes = await axios.get(
            `${process.env.HOST_VNPT_ECONTRACT}/esignature-service/dsign/esolution/download?contractId=${hopDong.idHopDong}&documentType=CONTRACT&documentHash=${chiTietHDRes.data.object.documentHash}`,
            {
            headers: { Authorization: 'Bearer ' + userTokenVNPT },
            responseType: 'stream'
            }
        );

        const chunks = [];
        for await (const chunk of downloadHDRes.data) {
            chunks.push(chunk);
        }

        const pdfBuffer = Buffer.concat(chunks);
        const mappings = [{ idHopDong: hopDong.idHopDong }];
        const formData = new FormData();

        formData.append('files', pdfBuffer, {
            filename: 'hopdong_render.pdf',
            contentType: 'application/pdf'
        });
        formData.append('mappings', JSON.stringify(mappings));

        const getIdFileRes = await axios.post(
            `https://service.vnfite.com.vn/file-manager/v2/upload`,
            formData,
            { headers: formData.getHeaders() }
        );

        await HopDongModel.updateOne(
            { idHopDong: hopDong.idHopDong },
            { $set: { idFile: getIdFileRes.data.files[0].fileId } }
        );

        success.push({
            contractId: hopDong.idHopDong,
            idFile: getIdFileRes.data.files[0].fileId
        });
        } catch (err) {
            errors.push({
                contractId: hopDong.idHopDong,
                error: err.message
            });
        }
    }

    return {
        success: errors.length === 0,
        updated: success.length,
        failed: errors.length,
        details: { success, errors }
    };
};

module.exports = {processHopDongChuaTai};