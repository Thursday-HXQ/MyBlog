var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tags:[]
    },
    computed: {
        randomColor() {
            return function () {
                var red = Math.random() * 255;
                var green = Math.random() * 255;
                var blue = Math.random() * 255;
                return "rgb(" + red + "," + green + "," + blue + ")";
            }
        },
        randomSize() {
            return function () {
                var size = (Math.random() * 20 + 12) + 'px';
                return size;

            }
        }
    },
    created() {
        axios({
            method:"get",
            url:"/queryRandomTags"
        }).then(res=>{
            var result = [];
            for(var i =0; i<res.data.data.length;i++){
                result.push({text:res.data.data[i].tag,link:"/?tag="+res.data.data[i].tag})
            }
            randomTags.tags = result;
        }).catch(res=>{
            console.log("请求失败！",res)
        })
    }
});

var newHot = new Vue({
    el: "#new_hot",
    data: {
        titleList: []
    },
    computed:{},
    created(){
        axios({
            method:"get",
            url:"/queryHotBlog"
        }).then(res=>{
            console.log(res)
            var result = [];
            for(var i =0;i<res.data.data.length; i++){
                var temp = {};
                temp.title = res.data.data[i].title;
                temp.link = "/blog_detail.html?bid="+res.data.data[i].id;
                result.push(temp)
            }
            newHot.titleList = result;
        }).catch(res=>{
            console.log("请求失败")
        })
    }

});

var newComments = new Vue({
    el: "#new_comments",
    data: {
        commentList: [
        ]
    },
    computed:{},
    created(){
        axios({
            method:"get",
            url:"/queryNewComments"
        }).then(res=>{
            console.log(res)
            var result = [];
            for(var i =0;i<res.data.data.length; i++){
                var temp = {};
                temp.name = res.data.data[i].username;
                temp.date = res.data.data[i].ctime;
                temp.comment = res.data.data[i].comments;
                result.push(temp)
            }
            newComments.commentList = result;

        }).catch(res=>{console.log("请求失败！")})
    }

})