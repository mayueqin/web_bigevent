$(function() {
    //获取用户的基本信息
    $.ajax({
            type: 'get',
            url: '/my/userinfo',
            //设置请求头  携带凭证token
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layui.layer.msg('用户信息获取失败')
                }
                //如果获取成功开始渲染页面  调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
            }
        })
        //渲染用户信息
    function renderAvatar(user) {
        //1.获取用户名称
        var name = user.nickname || user.username;
        //2.设置欢迎文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        //3.渲染头像
        //如果有头像就显示头像文本图像隐藏
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            //如果没有头像就显示文本图像，使用名字首字母用作文本头像
            $('.layui-nav-img').hide();
            var first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }
    }
    //实现退出功能
    $('#btnlogout').on('click', function() {
        //提示用户是否确认退出   icon:3是固定的，数字不一样询问框显示的图标不一样
        layui.layer.confirm('确定要退出吗？', { icon: 3, title: '提示' }, function(index) {
            //如果确定退出就要清空本地存储中的token
            localStorage.removeItem('token');
            //重新跳转到登陆页面
            location.href = '/login.html';
            //关闭confirm询问框
            layui.layer.close(index);
        })
    })
})