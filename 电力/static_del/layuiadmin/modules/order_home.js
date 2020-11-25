/** layuiAdmin.std-v1.1.0 LPPL License By http://www.layui.com/admin/ */
;
layui.define(function (e) {
    var a = layui.admin;
    layui.use(["admin", "carousel"],
        function () {
            var e = layui.$,
                a = (layui.admin, layui.carousel),
                l = layui.element,
                t = layui.device();
            e(".layadmin-carousel").each(function () {
                var l = e(this);
                a.render({
                    elem: this,
                    width: "100%",
                    arrow: "none",
                    interval: l.data("interval"),
                    autoplay: l.data("autoplay") === !0,
                    trigger: t.ios || t.android ? "click" : "hover",
                    anim: l.data("anim")
                })
            }),
                l.render("progress")
        }),
        layui.use(["carousel", "echarts", "zlajax"],
            function () {
                var my_data = [];
                var zlajax = layui.zlajax;
                zlajax.get({
                    url: "/order_data/",
                    async: false,
                    success: function (data) {
                        if (data.code == 0) {
                            var temp = data.data.data_list[0];
                            my_data = [temp.Jan, temp.Feb, temp.Mar, temp.Apr, temp.May, temp.Jun, temp.July, temp.Aug, temp.Sep, temp.Oct, temp.Nov, temp.Dec];
                        } else {
                            layer.msg(data.msg, {offset: '50%', icon: 5, time: 3000});
                        }
                    }
                });
                var e = layui.$,
                    a = (layui.carousel, layui.echarts),
                    l = [],
                    t = [{
                        tooltip: {
                            trigger: "axis"
                        },
                        calculable: !0,
                        xAxis: [{
                            type: "category",
                            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                        }],
                        yAxis: [{
                            type: "value",
                            axisLabel: {
                                formatter: "{value} 元"
                            }
                        }],
                        series: [{
                            type: "line",
                            data: my_data,
                            label: {
                                show: true
                            },
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }]
                    }],
                    i = e("#LAY-index-pagetwo").children("div"),
                    n = function (e) {
                        l[e] = a.init(i[e], layui.echartsTheme),
                            l[e].setOption(t[e]),
                            window.onresize = l[e].resize
                    };
                i[0] && n(0)
            }),
        e("sample", {})
});