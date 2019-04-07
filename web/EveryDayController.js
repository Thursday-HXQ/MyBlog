var everyDayDao = require("../dao/EveryDayDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");


var path = new Map();

function editEveryDay(req,resp){
    req.on('data',function(data){
        everyDayDao.inserEveryDay(data.toString().trim(),timeUtil.getNow(),(res) =>{
            resp.writeHead(200);
            resp.write(respUtil.writeResult("success","添加成功",null));
            resp.end();
        })
    })
}

path.set('/editEveryDay',editEveryDay);

function queryEveryDay(req,resp){
    everyDayDao.queryEveryDay((res) => {
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}

path.set('/queryEveryDay',queryEveryDay);

module.exports.path = path;