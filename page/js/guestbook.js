var blogComments = new Vue({
    el:"#blog_comments",
    data:{
        total:0,
        commentList:[
        ]
    },
    computed:{
        reply(){
            return function(commentId,userName){
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                location.href ="#send_comment";
            }
        }
    },
    created(){
        var bid = -2;
        axios({
            method:"get",
            url:"/queryCommentByBlogId?bid="+bid
        }).then(res=>{
            console.log(res)
            res.data.data.forEach((el,index)=>{
                blogComments.commentList.push({
                    id:el.id,
                    name:el.username,
                    ctime:el.ctime,
                    comments:el.comments,
                    option:el.parent > -1 ? "回复@ "+el.parent_name:"",
                })
            })
            
        }).catch(res=>{
            console.log("请求失败！")
        });
        axios({
            method:'get',
            url:'/queryCommentsCountByBlogId?bid='+bid
        }).then(res=>{
           blogComments.total = res.data.data[0].count
        }).catch(res=>{
            console.log("请求失败！")
        })
    }
})
var sendComment = new Vue({
    el:"#send_comment",
    data:{
        vcode:"",
        rightCode:"",
    },
    computed:{
        changeCode(){
            return function(){
                axios({
                    method:"get",
                    url:"/queryRandomCode"
                }).then(res=>{
                    // console.log(res)
                    sendComment.vcode = res.data.data.data;
                    sendComment.rightCode = res.data.data.text;
                }).catch(res=>{
                    console.log("请求失败！")
                })
            }
        }
        ,
        sendComment(){
            return function(){
                var code = document.getElementById("comment_code").value
                if(code!= sendComment.rightCode){
                    alert("验证码有误！");
                    return;
                }
               
                var bid = -2;

                //reply 如果回复别人则 >0， 不回复别人 = -1
                var reply = document.getElementById("comment_reply").value
                var replyName = document.getElementById("comment_reply_name").value
                var name = document.getElementById("comment_name").value
                var email = document.getElementById("comment_email").value
                var content = document.getElementById("comment_content").value
                axios({
                    method:"get",
                    url:"/addComment?bid="+bid +"&parent="+reply+"&userName="+name+"&email="+email+"&content="+content+"&parentName="+replyName
                }).then(res=>{
                    console.log(res)
                    alert("评论成功！")
                }).catch(res =>{
                    console.log("请求失败！")
                })

            }

        }
    },
    created(){
        this.changeCode();
    }
})