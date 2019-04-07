var tagsDao = require("../dao/TagsDao");
var blogDao = require("../dao/BlogDao");
var tagBlogMappingDao = require("../dao/TagsBlogMappingDao")
var respUtil = require("../util/RespUtil");
var url = require('url');
var path = new Map();

function queryRandomTags(req,resp) {
    tagsDao.queryRandomTags(res =>{
        res.sort(function (){
            return Math.random() > 0.5? true:false
        })
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",res));
        resp.end();
    })
}

path.set("/queryRandomTags",queryRandomTags);

function queryByTag(req,resp) {
    var params = url.parse(req.url,true).query;
    tagsDao.queryTag(params.tag,res =>{
        if(res == null && res.length == 0){
            resp.writeHead(200);
            resp.write(respUtil.writeResult("success","查询成功",res));
            resp.end();
        }else{
            console.log(res)
            tagBlogMappingDao.queryByTag(res[0].id,parseInt(params.page),parseInt(params.pageSize),result =>{
                console.log(result)
                var blogList = [];
                for(var i = 0; i<result.length;i++){
                    blogDao.queryBlogById(result[i].blog_id,(result) =>{
                        blogList.push(result[0]);
                    })
                }
                getResult(blogList,result.length,resp)

            })
        }
    })

}

path.set("/queryByTag",queryByTag);

function queryByTagCount(req,resp) {
    var params = url.parse(req.url,true).query;
    tagsDao.queryTag(params.tag,res =>{
       tagBlogMappingDao.queryByTagCount(res[0].id,result=>{
           resp.writeHead(200);
           resp.write(respUtil.writeResult("success","查询成功",result));
           resp.end();
       })
    })

}
path.set("/queryByTagCount",queryByTagCount);

function getResult(blogList,len,resp){
    if(blogList.length < len){
        setTimeout(function(){
            getResult(blogList,len,resp)
        },10);
    }else{
        for(var i = 0;i < blogList.length ; i++){
            blogList[i].content = blogList[i].content.replace(/<img [\w\W]* >/g,"")
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g,"")
            blogList[i].content = blogList[i].content.substring(0,300);
        }
        resp.writeHead(200);
        resp.write(respUtil.writeResult("success","查询成功",blogList));
        resp.end();
    }
}

module.exports.path = path;