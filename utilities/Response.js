export function successResponse (res) {
    var response = {"code":200,"status":"success","data":res};
    return response;
}
export function failureResponse (res) {
    var response = {"code":500,"status":"failure","data":res};
    return response;
}
 