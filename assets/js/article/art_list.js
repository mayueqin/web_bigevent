$(function() {
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    //初始化文章分类
    initCate()

    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-ArtCate', res);
                $('[name=cate_id]').html(htmlStr)
                form.render(); //此行代码不能少，必须重新加载渲染页面
            }
        })
    }

    //初始化文章列表
    initTable()

    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                var htmlstr = template('tpl-ArtList', res);
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }

    //为筛选按钮绑定点击事件 实现筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    //实现自定义分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, //数据总数，从服务端得到
            curr: q.pagenum,
            limit: q.pagesize,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调函数的有两种方式：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            jump: function(obj, first) { //obj指的是laypage.render()方法里的对象
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //为了避免死循环，首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }

    //为删除按钮绑定点击事件 显示询问框
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function(index) {
            //index指的是当前弹出层
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable() //重新获取文章列表
                }
            })
            layer.close(index) //关闭弹出层
        });
    })


})