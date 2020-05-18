module.exports = {
    // 成功
    handleSuc(status='',result = '', msg = '操作成功') {
        return {
            status,
            msg,
            result
        }
    },
    // 失败
    handleFail(status='',result = '', msg = '操作失败') {
        return {
            status,
            msg,
            result
        }
    }
}