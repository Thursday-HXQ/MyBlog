var dbutil = require('./DBUtil');

function insertComment(blogId,parent,userName,email,ctime,utime,comments,parentName,success){
    var insertSql = "insert into comments (`blog_id`,`parent`,`username`,`email`,`comments`,`ctime`,`utime`,`parent_name`) values (?,?,?,?,?,?,?,?)";
    var params = [blogId,parent,userName,email,comments,ctime,utime,parentName];

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

function queryCommentByBlogId(blogId,success){
    var querySql = "select * from comments where blog_id = ?;";
    var params = [blogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,(err,res) =>{
        if(err == null){
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}
function queryCommentsCountByBlogId(blogId,success){
    var querySql = "select count(1) as count from comments where blog_id = ?;";
    var params = [blogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,(err,res) =>{
        if(err == null){
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}
function queryNewComments(size,success){
    var querySql = "select * from comments order by id desc limit ?;";
    var params = [size];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,(err,res) =>{
        if(err == null){
            success(res)
        }else{
            console.log(err)
        }
    });
    connection.end();
}
module.exports.insertComment= insertComment;
module.exports.queryCommentByBlogId= queryCommentByBlogId;
module.exports.queryNewComments = queryNewComments