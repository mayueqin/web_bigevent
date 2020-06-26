$(function() {
        initUserInfo()

    })
    //自定义验证规则
var form = layui.form;
form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    //初始化用户基本信息
function initUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('初始化用户信息失败')
            }
            //成功就将数据显示到表单  使用form.val()快速为表单赋值
            form.val('formUserInfo', res.data);
        }
    })
}
//实现重置表单功能
$('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })
    //请求更新用户信息
$('.layui-form').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('修改用户信息失败')
            }
            layui.layer.msg('修改用户信息成功')
            window.parent.getUserInfo(); //全局下调用getUserInfo
        }
    })
})