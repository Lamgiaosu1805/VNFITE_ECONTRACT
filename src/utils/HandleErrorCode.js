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
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode