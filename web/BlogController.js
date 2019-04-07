var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var tagsBlogMappingDao = require("../dao/TagsBlogMappingDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require('url');

var path = new Map();

function queryHotBlog(req,resp){
    blogDao.queryHotBlog(5,res =>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}
path.set("/queryHotBlog",queryHotBlog);

function queryAllBlog(req,resp){
    blogDao.queryAllBlog(res =>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}
path.set("/queryAllBlog",queryAllBlog);

function queryBlogById(req,resp){
    var params = url.parse(req.url,true).query;
    blogDao.queryBlogById(parseInt(params.bid),res =>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
        blogDao.addViews(parseInt(params.bid),res=>{})
    })
}
path.set('/queryBlogById',queryBlogById);

function queryBlogCount(req,resp){
    blogDao.queryBlogCount(res =>{
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}

path.set('/queryBlogCount',queryBlogCount);

function queryBlogByPage(req,resp){
    var params = url.parse(req.url,true).query;
    blogDao.queryBlogByPage(parseInt(params.page),parseInt(params.pageSize),(res) =>{
        for(var i = 0;i < res.length ; i++){
            res[i].content = res[i].content.replace(/<img [\w\W]* >/g,"")
            res[i].content = res[i].content.replace(/<[\w\W]{1,5}>/g,"")
            res[i].content = res[i].content.substring(0,300);
        }
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}
path.set("/queryBlogByPage",queryBlogByPage)


function editBlog(req,resp){
    var params = url.parse(req.url,true).query;
    var tags = params.tags.replace(/ /g,"").replace("，",",");
    req.on('data',function(data){
        blogDao.insertBlog(params.title,data.toString(),tags,0,timeUtil.getNow(),timeUtil.getNow(), (res) =>{
            resp.writeHead(200);
            resp.write(respUtil.writeResult("success","添加成功",null));
            resp.end();

            var blogId = res.insertId;
            var tagList = tags.split(",");
            for(var i = 0; i < tagList.length; i++){
                if(tagList[i] == ""){
                    continue;
                }
                queryTag(tagList[i],blogId)
            }
        });
    });
}

path.set("/editBlog",editBlog)

function queryTag(tag,blogId){
    tagsDao.queryTag(tag,res =>{
        if(res == null || res.length == 0){
            //如果不存在tag 则插tag在插映射
            insertTag(tag,blogId)
        }else{
            //存在此标签，则只需插入映射
            tagsBlogMappingDao.insertTagBlogMapping(res[0].id,blogId,timeUtil.getNow(),timeUtil.getNow(),res => {});
        }
    })
}

function insertTag(tag,blogId){
    tagsDao.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),(res) =>{
        insertTagBlogMapping(res.insertId,blogId)
    })
}

function insertTagBlogMapping(tagId,blogId){
    tagsBlogMappingDao.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),(res) =>{})
}

module.exports.path = path;