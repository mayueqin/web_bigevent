$(function() {

    var form = layui.form;

    // 获取地址栏参数    文章列表页点击编辑跳转链接时传入到地址栏一个参数Id
    var $Id = new URLSearchParams(location.search).get("Id");
    console.log($Id);

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }


    //渲染原始文章数据
    $.ajax({
        type: 'get',
        url: '/my/article/' + $Id,
        success: function(res) {
            console.log(res);
            //必须有数据了才能初始化富文本编辑器
            initEditor()
            form.val('render-editform', res.data)
                //由于图片不能直接赋值过来需要单独处理
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
                // 把当前所属的分类传进去，进行默认选中的判断
            initCate(res.data.cate_id);

        }
    })

    //初始化分类

    function initCate(currentCateId = "") {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                res.currentCateId = currentCateId;
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }

    //更换图片操作
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //点击选择封面按钮绑定事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })


    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 为表单绑定 submit 提交事件
    $('#form-edit').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                editArticle(fd)
            })
    })


    //请求发布
    function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})