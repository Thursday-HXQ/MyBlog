var commentDao = require("../dao/CommentDao");

var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var captcha = require("svg-captcha");
var url = require('url');

var path = new Map();

function addComment(req,resp){
    var params = url.parse(req.url,true).query;
    commentDao.insertComment(parseInt(params.bid),parseInt(params.parent),params.userName,params.email,timeUtil.getNow(),timeUtil.getNow(),params.content,params.parentName,res=>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","评论成功",null));
        resp.end();
    })
}
path.set("/addComment",addComment)

function queryRandomCode(req,resp){
    var img = captcha.create({fontSize:50,width:100,height:34});
    // console.log(img);
    resp.writeHead(200);
    resp.write(respUtil.writeResult("success","验证码获取成功",img));
    resp.end();
}
path.set("/queryRandomCode",queryRandomCode);

function queryCommentByBlogId(req,resp){
    var params = url.parse(req.url,true).query;
    commentDao.queryCommentByBlogId(parseInt(params.bid),res=>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","获取评论成功",res));
        resp.end();
    })
}

path.set("/queryCommentByBlogId",queryCommentByBlogId);

function queryCommentsCountByBlogId(req,resp){
    var params = url.parse(req.url,true).query;
    commentDao.queryCommentsCountByBlogId(parseInt(params.bid),res=>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","获取总评论数成功",res));
        resp.end();
    })
}
path.set("/queryCommentsCountByBlogId",queryCommentsCountByBlogId);

function queryNewComments(req,resp){
    commentDao.queryNewComments(8,res=>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","获取最新评论成功",res));
        resp.end();
    })
}
path.set("/queryNewComments",queryNewComments);

module.exports.path = path;