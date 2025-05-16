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
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode