const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return `Error: ${errorCode}, Có lỗi khi getTokenUserVNPT`;
        case "02":
            return `Error: ${errorCode}, Có lỗi khi getTokenThirdPartyVNPT`;
        case "03":
            return `Error: ${errorCode}, Có lỗi khi tạo Partner`;
        case "04":
            return `Error: ${errorCode}, Có lỗi khi Render hợp đồng`;
        case "05":
            return `Error: ${errorCode}, Partner không tồn tại`;
        case "06":
            return `Error: ${errorCode}, Thông tin không chính xác đăng nhập`;
        case "07":
            return `Error: ${errorCode}, Có lỗi khi get token partner`;
        case "08":
            return `Error: ${errorCode}, Not Authenticated`;
        case "09":
            return `Error: ${errorCode}, Token Invalid`;
        case "10":
            return `Error: ${errorCode}, Có lỗi khi lấy chi tiết hợp đồng`;
        case "11":
            return `Error: ${errorCode}, Có lỗi khi ký hợp đồng`;
        case "12":
            return `Error: ${errorCode}, Có lỗi khi ký xác thực OTP`;
        case "13":
            return `Error: ${errorCode}, Thiếu thông tin`;
        case "14":
            return `Error: ${errorCode}, Lỗi khi tạo loại hợp đồng`;
        case "15":
            return `Error: ${errorCode}, Có lỗi khi tải hợp đồng`;
        case "16":
            return `Error: ${errorCode}, Có lỗi khi show`;
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode