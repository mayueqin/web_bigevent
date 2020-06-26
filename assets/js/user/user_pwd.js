$(function() {
    //自定义密码验证规则
    var form = layui.form;
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须是6~12位，且不能有空格'],
            samePwd: function(value) {
                if (value == $('[name=oldPwd]').val()) {
                    return '新旧密码不能相同'
                }
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致'
                }
            }
        })
        //发起请求重置密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败')
                }
                layui.layer.msg('重置密码成功');
                //请求成功重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})