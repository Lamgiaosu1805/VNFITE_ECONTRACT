const { default: axios } = require("axios")
const redis = require("../config/connectRedis")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const FormData = require('form-data');
const jwt = require('jsonwebtoken')
const path = require('path');
const fs = require('fs');
const HopDongModel = require("../models/HopDongModel");

const HopDongController = {
    renderHD: async (req, res) => {
        console.log("request body: ", req.body)
        try {
            const userTokenVNPT = await redis.get('tokenUserVnpt:TIKLUY')
            const thirdPartyTokenVNPT = await redis.get('tokenThirdPartyVnpt:TIKLUY')
            const {templateId, fullname, cccd, hoKhauThuongTru, diaChiHienTai, soDienThoai, ngayKy, thangKy, namKy, email, ngaySinh, gioiTinh, ngayCapCCCD, noiCap} = req.body
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
            const chunks = [];
            for await (const chunk of response.data) {
                chunks.push(chunk);
            }
            const pdfBuffer = Buffer.concat(chunks);

            // SETUP FORM-DATA
            const files = req.files;       
            const fields = ''
            const customer = {
                username: soDienThoai,
                userType: "CONSUMER",
                sdt: soDienThoai,
                email: email,
                hoten: fullname,
                sogiayto: cccd,
                ngaySinh: ngaySinh, //dạng dd/mm/yyyy
                gioiTinhId: gioiTinh, // Nam 2; Nữ 1
                ngayCap: ngayCapCCCD,
                noiCap: noiCap
            }
            const contract = {
                verificationType: "NONE",
                sequence: 1,
                signForm: ["NO_AUTHEN", "OTP_EMAIL", "OTP"],
                title: "Hợp đồng hợp tác đầu tư",
                flowTemplateId: "6eead43c-ceb6-4abc-b260-1acb10a7c5c6",
                signFlow: [
                    {
                        signType: "APPROVAL",
                        signForm: [
                            "SMART_CA"
                        ],
                        signFrame: [
                            {
                                x: 41,
                                y: 426,
                                w: 279 - 41,
                                h: 426 - 326,
                                page: 18
                            }
                        ],
                        sequence: 1,
                        userId: "686bc930-af81-4a37-9e77-cd2ca805c643",
                        limitDate: 2
                    }
                ]
            }
            const formData = new FormData();
            formData.append('file', pdfBuffer, {
                filename: 'hopdong_render.pdf',
                contentType: 'application/pdf'
            });
            formData.append('EKYC_CHANDUNG', files.portrait[0].buffer, {
                filename: files.portrait[0].originalname,
                contentType: files.portrait[0].mimetype
            });
          
            formData.append('EKYC_MATTRUOC', files.cccd_front[0].buffer, {
                filename: files.cccd_front[0].originalname,
                contentType: files.cccd_front[0].mimetype
            });
          
            formData.append('EKYC_MATSAU', files.cccd_back[0].buffer, {
                filename: files.cccd_back[0].originalname,
                contentType: files.cccd_back[0].mimetype
            });
            formData.append('fields', JSON.stringify(fields));
            formData.append('customer', JSON.stringify(customer));
            formData.append('contract', JSON.stringify(contract));
            
            const responseTaoHD = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/create-draft-from-file-and-identification-v2`,
                formData,
                {
                    headers: {
                        Authorization: 'Bearer ' + thirdPartyTokenVNPT
                    }
                }
            )
            
            const data = {
                userId: responseTaoHD.data.object.partnerId,
                contractId: responseTaoHD.data.object.contractId,
                fullname: fullname
            }
            await redis.set(`econtract:${soDienThoai}:${cccd}`, JSON.stringify(data), "EX", 3600 * 23)
            res.setHeader('Content-Type', response.headers['content-type']);
            res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'inline');
            res.send(pdfBuffer);
        } catch (error) {
            res.status(400).json(FailureResponse("04", error.response?.data || error))
            console.log(error.response?.data || error)
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
    },
    kyHopDong: async(req, res) => {
        try {
            const {cccd, soDienThoai} = req.body
            const dataHopDong = JSON.parse(await redis.get(`econtract:${soDienThoai}:${cccd}`))
            const thirdPartyTokenVNPT = await redis.get('tokenThirdPartyVnpt:TIKLUY')
            if(!dataHopDong) {
                return res.json(FailureResponse("11", "Hợp đồng không tồn tại"))
            }
            try {
                const responseGuiHD = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${dataHopDong.contractId}/submit-contract`, null, {
                    headers: {
                        Authorization: 'Bearer ' + thirdPartyTokenVNPT
                    }
                })
            } catch (error) {
                console.log(error)
                console.log("Hợp đồng đã được gửi")
            }
            const serviceToken = jwt.sign(dataHopDong,
                process.env.SECRET_KEY,
                {
                    expiresIn: "1d"
                }
            )
            const responseSSO = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/auth-service/sso/exchange-token`, {
                client_id: process.env.CLIENT_ID_VNPT_ECONTRACT,
                client_secret: process.env.CLIENT_SECRET_VNPT_ECONTRACT,
                token: serviceToken
            })
            const responseYcOTP = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${dataHopDong.contractId}/electronic-sign?signForm=OTP_EMAIL`, null, {
                headers: {
                    Authorization: 'Bearer ' + responseSSO.data.access_token
                }
            })
            const dataSSO = {
                idSign: responseYcOTP.data.object.idSign,
                accessTokenSSO: responseSSO.data.access_token,
                contractId: dataHopDong.contractId,
                fullname: dataHopDong.fullname
            }
            await redis.set(`econtract:${soDienThoai}:${cccd}:dataSSO`, JSON.stringify(dataSSO), "EX", 3600)
            res.json(SuccessResponse({
                message: "OTP đã được gửi"
            }))
        } catch (error) {
            console.log(error.response?.data || error)
            res.json(FailureResponse("11", error.response?.data || error))
        }
    },
    validateOTP: async (req, res) => {
        try {
            const {otp, soDienThoai, cccd} = req.body
            const dataSSO = JSON.parse(await redis.get(`econtract:${soDienThoai}:${cccd}:dataSSO`))
            console.log(otp)
            const responseValidateOTP = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esignature-service/esign/${dataSSO.idSign}/verify`, {
                otp: otp
            }, {
                headers: {
                    Authorization: 'Bearer ' + dataSSO.accessTokenSSO
                }
            })
            const data = responseValidateOTP.data
            if(data.status == "OK") {
                const multiSign = [
                    {
                        "pageSign": 17,
                        "bboxSign": [
                            359 + 50,
                            289,
                            597 - 50,
                            440
                        ]
                    }
                ]
                const formData = new FormData();
                const imagePath = path.join(__dirname, '..', '..', 'IMG_5492.png');
                formData.append('signImg1', fs.createReadStream(imagePath), {
                    filename: 'IMG_5492.png',
                    contentType: 'image/jpeg' // hoặc 'image/png' nếu ảnh PNG
                });
                formData.append('multiSign', JSON.stringify(multiSign));
                formData.append('otpCode', "N");
                formData.append('emailOrPhonenumber', "N");
                const responseSign = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esignature-service/esign/${dataSSO.idSign}/sign-by-userId`,
                    formData,
                    {
                        headers: {
                            Authorization: "Bearer " + dataSSO.accessTokenSSO
                        },
                        responseType: 'stream'
                    }
                )
                if(responseSign.status == 200) {
                    const newHopDong = new HopDongModel({
                        cccd: cccd,
                        soDienThoai: soDienThoai,
                        fullname: dataSSO.fullname,
                        idLoaiHopDong: "682fd19c2a1664686b259b29",
                        idHopDong: dataSSO.contractId
                    })
                    await newHopDong.save()
                    const chunks = [];
                    for await (const chunk of responseSign.data) {
                        chunks.push(chunk);
                    }
                    const pdfBuffer = Buffer.concat(chunks);
                    const data = {
                        "SignForm": "SMART_CA",
                        "name": "Nghiêm Khắc Lâm",
                        "signType": "APPROVAL"
                    }
                    const formData = new FormData();
                    formData.append('file', pdfBuffer, {
                        filename: 'hopdong_render.pdf',
                        contentType: 'application/pdf'
                    });
                    formData.append('data', JSON.stringify(data));
                    console.log(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${dataSSO.contractId}/digital-sign`, "ID HĐ")
                    const responseUpdateSign = await axios.post(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${dataSSO.contractId}/digital-sign`, 
                        formData,
                        {
                            headers: {
                                Authorization: "Bearer " + dataSSO.accessTokenSSO
                            }
                        }
                    )
                    // console.log(responseUpdateSign.data, "ABC")
                    // res.setHeader('Content-Type', responseSign.headers['content-type']);
                    // res.setHeader('Content-Disposition', responseSign.headers['content-disposition'] || 'inline');
                    res.json(SuccessResponse({
                        message: "Ký hợp đồng thành công",
                        data: {
                            contractId: responseUpdateSign.data.object.contractId
                        }
                    }))
                }
                else {
                    res.json(FailureResponse("12", "Có lỗi khi tạo hợp đồng"))
                    console.log(responseSign.data)
                }
            } else {
                res.json(FailureResponse("12", "OTP Không tồn tại"))
            }
        } catch (error) {
            console.log(error.response?.data || error)
            res.json(FailureResponse("12", error.response?.data || error))
        }
    },
    taiHopDong: async (req, res) => {
        try {
            const userTokenVNPT = await redis.get('tokenUserVnpt:TIKLUY')
            const thirdPartyTokenVNPT = await redis.get('tokenThirdPartyVnpt:TIKLUY')
            const hopDongChuaTai = await HopDongModel.find({idFile: ""})
            if(hopDongChuaTai.length == 0) {
                return res.json(SuccessResponse({
                    message: "success",
                    data: hopDongChuaTai
                }))
            }
            else {
                const errors = [];
                const success = [];
                for (const hopDong of hopDongChuaTai) {
                    try {
                        console.log(`🔄 Processing contract: ${hopDong.idHopDong}`);
                
                        const chiTietHDRes = await axios.get(`${process.env.HOST_VNPT_ECONTRACT}/esolution-service/contracts/${hopDong.idHopDong}`, {
                            headers: {
                                Authorization: 'Bearer ' + userTokenVNPT
                            }
                        });
                        const downloadHDRes = await axios.get(`${process.env.HOST_VNPT_ECONTRACT}/esignature-service/dsign/esolution/download?contractId=${hopDong.idHopDong}&documentType=CONTRACT&documentHash=${chiTietHDRes.data.object.documentHash}`, {
                            headers: {
                                Authorization: 'Bearer ' + userTokenVNPT
                            },
                            responseType: 'stream'
                        });
                        const chunks = [];
                        for await (const chunk of downloadHDRes.data) {
                            chunks.push(chunk);
                        }
                        const pdfBuffer = Buffer.concat(chunks);
                        const mappings = [{
                            idHopDong: hopDong.idHopDong
                        }]
                        const formData = new FormData();
                        formData.append('files', pdfBuffer, {
                            filename: 'hopdong_render.pdf',
                            contentType: 'application/pdf'
                        });
                        formData.append('mappings', JSON.stringify(mappings));
                        const getIdFileRes = await axios.post(`https://service.vnfite.com.vn/file-manager/v2/upload`, formData);
                
                        // // ✅ Cập nhật hợp đồng
                        await HopDongModel.updateOne(
                            { idHopDong: hopDong.idHopDong },
                            { $set: { idFile: getIdFileRes.data.files[0].fileId} }
                        );
                
                        success.push({
                            contractId: hopDong.idHopDong,
                            idFile: getIdFileRes.data.files[0].fileId
                        });
                    } catch (err) {
                        console.error(`❌ Failed contract ${hopDong.idHopDong}:`, err.message);
                        errors.push({
                            contractId: hopDong.idHopDong,
                            error: err.message,
                        });
                    }
                }
                return res.json({
                    success: errors.length === 0,
                    updated: success.length,
                    failed: errors.length,
                    details: {
                        success,
                        errors,
                    }
                });
            }
        } catch (error) {
            console.log(error.response?.data || error)
            res.json(FailureResponse("15", error.response?.data || error))
        }
    },
    showHopDong: async (req, res) => {
        try {
            const {cccd, sdt} = req.body
            const hopDong = await HopDongModel.findOne({cccd, soDienThoai: sdt, idLoaiHopDong: "682fd19c2a1664686b259b29"}).sort({ createdAt: -1 })
            if(hopDong) {
                const response = await axios.get(`https://service.vnfite.com.vn/file-manager/v2/file/${hopDong.idFile}`, {
                    responseType: 'stream'
                })
                const chunks = [];
                for await (const chunk of response.data) {
                    chunks.push(chunk);
                }
                const pdfBuffer = Buffer.concat(chunks);
                res.setHeader('Content-Type', response.headers['content-type']);
                res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'inline');
                res.send(pdfBuffer);
            }
            else {
                res.status(400).json(FailureResponse("16", "Hợp đồng không tồn tại"))
            }
        } catch (error) {
            console.log(error.response?.data || error)
            res.status(400).json(FailureResponse("16", error.response?.data || error))
        }
    }
}

module.exports = HopDongController