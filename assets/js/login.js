$(function() {
    // 点击去注册按钮绑定事件
    $('#link_reg').on('click', function() {
            $('.reg-box').show();
            $('.login-box').hide();

        })
        // 点击去登录按钮绑定事件
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        //自定义登录/注册验证规则
    var form = layui.form;
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能有空格！'],
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致'
                }
            }
        })
        // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            //收集数据
            var data = {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val(),
                }
                // 发起post请求
            $.ajax({
                type: 'post',
                url: '/api/reguser',
                data,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功，请登录！')
                        // 模拟人的点击行为
                    $('#link_login').click()
                }
            })
        })
        //监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        //收集数据
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val(),
        }


        $.post('/api/login', data, function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('登陆失败')
            }
            layui.layer.msg('登陆成功');
            localStorage.setItem('token', res.token);
            location.href = "/index.html"

        })
    })

})