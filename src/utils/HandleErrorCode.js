const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return `Error: ${errorCode}, Có lỗi khi getTokenUserVNPT`;
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

module.exports = HandleErrorCode