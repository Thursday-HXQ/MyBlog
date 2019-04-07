var dbutil = require("./DBUtil");

function queryTag(tag,success){
    var insertSql = "select * from tags where tag = ?";
    var params = [tag];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,(err,res) =>{
        if(err == null){
            console.log(res)
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}

function insertTag(tag,ctime,utime,success){
    var insertSql = "insert into tags (`tag`,`ctime`,`utime`) values (?,?,?)";
    var params = [tag,ctime,utime];

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

function queryRandomTags(success){
    var querySql = "select * from tags";

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

module.exports.insertTag = insertTag;
module.exports.queryTag = queryTag;
module.exports.queryRandomTags = queryRandomTags;