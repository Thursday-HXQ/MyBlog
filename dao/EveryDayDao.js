var dbutil = require('./DBUtil');

function inserEveryDay(content,ctime,success){
    var insertSql = "insert into every_day (`content`,`ctime`) values (?,?)";
    var params = [content,ctime];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,(err,res) =>{
        if(err == null){
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}
function queryEveryDay(success){
    var querySql = "select * from every_day order by id desc limit 1;";

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,(err,res) =>{
        if(err == null){
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}
module.exports.inserEveryDay = inserEveryDay;
module.exports.queryEveryDay = queryEveryDay;
