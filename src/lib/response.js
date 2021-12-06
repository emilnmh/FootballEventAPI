module.exports.successResponse = function (res, data, status = 200){
    res.status(status).send({data: data});
}