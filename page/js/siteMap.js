var blogList = new Vue({
    el:"#blog_list",
    data:{
        blogList:[]
    },
    computed:{
        
    },
    created(){
        axios({
            method:"get",
            url:"/queryAllBlog"
        }).then(res=>{
            console.log(res.data.data)
            for(var i = 0;i<res.data.data.length;i++){
                res.data.data[i].link = "/blog_detail.html?bid="+res.data.data[i].id
            }
             blogList.blogList = res.data.data
        }).catch(res=>{
            console.log("请求失败！")
        })
    }
})