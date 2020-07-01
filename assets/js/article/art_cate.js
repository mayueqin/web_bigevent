$(function(){

    var layer=layui.layer;
    var form=layui.form;
    initArtCateList()
    //获取文章分类列表
    function initArtCateList(){
        $.ajax({
            type:'get',
            url:'/my/article/cates',
            success:function(res){
                console.log(res)
                var htmlstr=template('tpl-cate',res);
                $('tbody').html(htmlstr)
            }
        })
    }

    //为添加分类按钮绑定点击事件  显示弹出层
    var indexAdd=null;
    $('#btnAddCate').on('click',function(){
        indexAdd=layer.open({
             type:1,
             area:['500px','250px'],
             title:'添加文章分类',
             content:$('#form_Addcate').html()
         })
    })

    //添加表单提交事件
    $('body').on('submit','#form_Add',function(e){
        e.preventDefault();
        var fd=$(this).serialize();
        console.log(fd);
        $.ajax({
            type:'post',
            url:'/my/article/addcates',
            data:fd,
            success:function(res){
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                  }
                  initArtCateList()
                  layer.msg('新增分类成功！')
                  // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)  
            }
        })
    })


    //使用代理方式 为编辑按钮添加点击事件  显示弹出层  
    var indexEdit=null;
    $('tbody').on('click','.btn-edit',function(){
        indexEdit=layer.open({
            type:1,
             area:['500px','250px'],
             title:'修改文章分类',
             content:$('#form_Editcate').html()
        })
        var id=$(this).attr('data-id');
        $.ajax({
            type:'get',
            url:'/my/article/cates/'+id,
            success:function(res){
                console.log(res);
                // if(res.status!==0){
                //     return layer.msg('获取分类失败')
                // }
                // layer.msg('获取分类成功')
                 form.val('form_edit',res.data)
            }
        })
    })
    //提交编辑表单发布请求更新分类信息
    $('body').on('submit','#form_Edit',function(e){
        e.preventDefault();
        var fd=$(this).serialize();
        $.ajax({
            type:'post',
            url:'/my/article/updatecate',
            data:fd,
            success:function(res){
                console.log(res);
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    //点击删除按钮删除分类
    $('tbody').on('click','.btn-delete',function(){
        var id=$(this).attr('data-id');
          layer.confirm('确定要删除吗？',{icon:3,title:'提示'},function(index){
            $.ajax({
            type:'get',
            url:'/my/article/deletecate/'+id,
            success:function(res){
                console.log(res);
                initArtCateList();
                layer.close(index);
              }
           })
        })
       
    })
    
    
})