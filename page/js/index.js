var everyday = new Vue({
    el:'#every_day',
    data:{
        content:'sdfsadfvxafw'
    },
    computed:{
        getContent(){
            return this.content
        }
    },
    created(){
        //请求数据 赋予content
        axios({
            method:'get',
            url:'/queryEveryDay'
        }).then( (resp) => {
            everyday.content = resp.data.data[0].content
            console.log(resp.data.data[0].content)
        }).catch(resp => {
            console.log('请求失败！')
        });
    }
});

var articleList = new Vue({
    el:'#article_list',
    data:{
        page:1,
        pageSize:5,
        count:100,
        pageNumList:[],
        articleList:[]
    },
    created(){
        this.getPage(this.page,this.pageSize)
    },
    computed:{
        jumpTo(){
            return function(page){
                console.log(page)
                this.getPage(page,this.pageSize)
            }   
        },
        getPage(){
            
            return function (page,pageSize){
                var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&"):"";
                if(searchUrlParams == ""){
                    return ;
                }
                var tag = "";
                for(var i = 0;i<searchUrlParams.length ; i++){
                    if(searchUrlParams[i].split("=")[0] == "tag"){
                        try{
                            tag = searchUrlParams[i].split("=")[1]
                        }catch(e){
                            console.log(e);
                        }
                    }
                }
                console.log(tag)
                if(tag == ""){ //非查询情况
                    //数据库里是从0页开始查，因此page-1
                    axios({
                        method:'get',
                        url:'/queryBlogByPage?page='+ ( page - 1 ) +'&pageSize='+pageSize,

                    }).then(resp =>{
                        console.log(resp)
                        var result = resp.data.data;
                        var list = [];

                        for(var i = 0;i < result.length ; i++){
                            var temp = [];
                            temp.title = result[i].title;
                            temp.content = result[i].content;
                            temp.date = result[i].ctime;
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?bid=" +result[i].id
                            list.push(temp);
                        }
                        articleList.articleList = list
                        this.page = page;
                    }).catch(resp =>{
                        console.log("请求错误！",res)
                    })
                    axios({
                        method:'get',
                        url:'/queryBlogCount'
                    }).then(res =>{
                        articleList.count = res.data.data[0].count;
                        console.log(articleList.count)
                        articleList.generatePageTool;
                    }).catch(res =>{
                        console.log(res)
                    })

                }else{
                    axios({
                        method:'get',
                        url:'/queryByTag?page='+ ( page - 1 ) +'&pageSize='+pageSize+"&tag="+tag,

                    }).then(resp =>{
                        console.log(resp)
                        var result = resp.data.data;
                        var list = [];

                        for(var i = 0;i < result.length ; i++){
                            var temp = [];
                            temp.title = result[i].title;
                            temp.content = result[i].content;
                            temp.date = result[i].ctime;
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?bid=" +result[i].id
                            list.push(temp);
                        }
                        articleList.articleList = list
                        this.page = page;
                    }).catch(resp =>{
                        console.log("请求错误！")
                    })
                    axios({
                        method:'get',
                        url:'/queryByTagCount?tag='+tag
                    }).then(res =>{
                        articleList.count = res.data.data[0].count;
                        console.log(articleList.count)
                        articleList.generatePageTool;
                    }).catch(res =>{})
                }

                // console.log(this)
                
            }
        },
        generatePageTool(){
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result =  [] ;
            result.push( { text:"<<",page:1 });
            if(nowPage > 2){
                result.push({text:nowPage - 2,page:nowPage - 2})
            }
            if(nowPage > 1){ //
                result.push({text:nowPage - 1,page:nowPage - 1})
            }

            result.push({text:nowPage,page:nowPage})
            if(nowPage + 1 <= ((totalCount + pageSize -1) / pageSize)){ 
                
                result.push({text:nowPage +1 ,page:nowPage +1})
            }
            if(nowPage + 2 <= ((totalCount + pageSize -1) / pageSize)){ 
                //小于最后一页则，加入下一页
                result.push({text:nowPage +2 ,page:nowPage +2})
            }
            result.push( { text:">>",page:parseInt((totalCount + pageSize -1)/pageSize)});
            this.pageNumList = result;
            return result;
        }
    }
})