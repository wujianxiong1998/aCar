layui.define(["jquery"],function(exports) {
    "use strict";

    var $ = layui.jquery,
        tableData = {},
        Class = function () {
        };

    Class.prototype.render = function(options){
        var othis = this;
        othis.id = options.id;
        var dataTableDOM = $(options.id).next().find('div.layui-table-body table')[0];
        var tdDOM = $(dataTableDOM).find("td[data-field='"+options.field+"']");
        if(!options.data){
            $.getJSON(options.url,options.where,function (result) {
                if(options.parseData){
                    othis.data = options.parseData(result.data);
                }else {
                    othis.data = result.data;
                }
                tdDOM.each(function () {
                    var text = $(this).find("div.layui-table-cell").eq(0).text();
                    text = othis.getOption(text);
                    $(this).find("div.layui-table-cell").eq(0).text(text);
                });
            });
        }else {
            othis.data = options.data;
            tdDOM.each(function () {
                var text = $(this).find("div.layui-table-cell").eq(0).text();
                text = othis.getOption(text);
                $(this).find("div.layui-table-cell").eq(0).text(text);
            });
        }
        othis.callback = options.callback;

        //解决下拉框超出表格最大高度时，被覆盖的问题。
        tdDOM.bind('click',function (e) {
            var that = this;
            othis.td = that;
            if(!othis.deleteAll(that)){
                return;
            }
            var input = $('<input class="layui-input layui-table-select-input" placeholder="关键字搜索">');
            var icon = $('<i class="layui-icon layui-table-select-edge" data-td-text="'+$(that).find("div.layui-table-cell").eq(0).text()+'" >&#xe625;</i>');
            $(that).append(input);
            $(that).append(icon);
            input.focus();
            input.bind('input propertychange', function(){
                var val = this.value;
                var dl = $('div.layui-table-select-div').find('dl').eq(0);
                var searchDDs = [];
                if(val === null || val === '' || val.length === 0){
                    searchDDs = othis.createHtml(othis.data);
                }else {
                    searchDDs = othis.searchHtml(othis.data,val);
                }
                dl.html("");
                dl.prepend(searchDDs.join(" "));
                othis.ddClick(that);
                //重新注册鼠标移动事件
                $(window).unbind('mousemove'); //解绑注册事件
                othis.registermMousemove(that,tdInfo.type); //注册事件
            });
            icon.bind('click',function () {
                layui.stope();
                othis.deleteAll();
            });
            //layui.stope(input);
            var thisY = that.getBoundingClientRect().top; //y坐标
            var thisX = that.getBoundingClientRect().left; //x坐标
            var tdHeight = that.offsetHeight;
            var tdWidth = that.offsetWidth;
            var tdInfo = {
                x:thisX,
                y:thisY,
                width:tdWidth,
                height:tdHeight,
                type:'',
                td:that
            };
            var winHeight = $(window).height();
            //当前y坐标大于窗口0.55倍的高度则往上延伸，否则往下延伸。
            if(thisY+tdHeight > 0.55*winHeight){
                //往上延伸
                tdInfo.type = 'up';
            }else {
                //往下延伸
                tdInfo.type = 'down';
            }
            othis.dynamicGenerationSelect(othis.data,tdInfo);
            othis.registermMousemove(that,tdInfo.type);
        });
    };

    //给下拉列表注册点击事件
    Class.prototype.ddClick = function(){
        var othis = this;
        $('div.layui-table-select-div').find('dd').bind('click',function (e) {
            layui.stope(e);
            var name = $(this).attr('lay-value');
            othis.deleteAll();
            if(othis.callback){
                var thisIndex = $(othis.td).parent().data('index');
                thisIndex = parseInt(thisIndex);
                var thisData = tableData[othis.id][thisIndex];
                var update = {name:name,value:$(this).text()};
                var thisObj = {
                    data:thisData,
                    select:update,
                    td:othis.td,
                    update:function (o) {
                        $.extend(this.data,o);
                        var v = this.data[$(this.td).data('field')];
                        $(this.td).find("div.layui-table-cell").eq(0).text(othis.getOption(v));
                    }
                };
                othis.callback(thisObj);
            }
        });
    };


    //生成下拉选择框的html代码
    Class.prototype.createHtml = function(selectData,data){
        if(!data)data = [];
        selectData.forEach(function (e) {
            data.push('<dd lay-value="'+e.name+'" class="layui-table-select-dd">'+e.value+'</dd>');
        });
        return data;
    };
    //生成根据关键字搜索的下拉选择框
    Class.prototype.searchHtml = function(selectData,search,data){
        if(!data)data = [];
        selectData.forEach(function (e) {
            if((e.value+'').indexOf(search)>-1){
                data.push('<dd lay-value="'+e.name+'" class="layui-table-select-dd">'+e.value+'</dd>');
            }
        });
        return data;
    };

    //获取一个下拉框的数据
    Class.prototype.getOption = function(value){
        var othis = this;
        var dataArr = othis.data;
        if(!dataArr)return '';
        for(var i=0;i<dataArr.length;i++){
            var e = dataArr[i];
            if((e.name+'') === (value+'')){
                return e.value;
            }
        }
        return '';
    };

    //删除所有删除下拉框和input和div
    Class.prototype.deleteAll = function(td){
        var othis = this;
        var divDom = $('div.layui-table-select-div');
        if(divDom.length == 0){
            return true;
        }
        divDom = divDom[0];
        if(othis.getKey(td) === $(divDom).data('key')){
            //同一个td元素不动态生成下拉列表
            return false;
        }else {
            $('div.layui-table-body').find('td').each(function () {
                var icon = $(this).find('i.layui-table-select-edge');
                if(icon.length === 0){
                    return;
                }
                $(this).find('input.layui-table-select-input').blur();
                $(this).find('input.layui-table-select-input').remove();
                icon = icon.eq(0);
                var text = icon.attr('data-td-text');
                $(this).find("div.layui-table-cell").eq(0).text(text);
                icon.remove();
            });

            $(divDom).remove();
            return true;
        }
    };

    //动态生成下拉框
    Class.prototype.dynamicGenerationSelect = function(data,tdInfo){
        var othis = this;
        var domArr = [];
        var winHeight = $(window).height();
        var type = tdInfo.type === 'up'?'top:auto;bottom: '+(winHeight-tdInfo.y)+'px;':'bottom:auto;top:'+(tdInfo.y+tdInfo.height)+'px;';
        var width = tdInfo.width;
        var left = tdInfo.x;
        domArr.push('<div class="layui-table-select-div" data-key="'+othis.getKey(tdInfo.td)+'" style="z-index: 19910908;'+type+' width:'+width+'px;position: absolute; left: '+left+'px;">');
            domArr.push('<dl>');
                if(data){
                    othis.createHtml(data,domArr);
                }else {
                    domArr.push('<dd lay-value="" class="">无数据</dd>');
                }
            domArr.push('</dl>');
        domArr.push('</div>');
        $('body').append(domArr.join(" "));
        othis.ddClick();
    };

    //生成key -> 表id+行索引+列索引，中间以“-”相连，用于识别是否是点击同一个单元格。
    Class.prototype.getKey = function (that) {
        var othis = this;
        return othis.id+'-'+$(that).parent().data('index')+$(that).data('key');
    };

    //注册鼠标移动事件
    Class.prototype.registermMousemove = function (that,type) {
        var othis = this;
        var divDom = $('div.layui-table-select-div')[0];
        var divHeight = divDom.offsetHeight;
        var thisY = that.getBoundingClientRect().top; //y坐标
        var thisX = that.getBoundingClientRect().left; //x坐标
        var tdHeight = that.offsetHeight;
        var tdWidth = that.offsetWidth;
        var maxY,maxX,minY,minX;
        //计算出最大y坐标、最小y坐标、最大x坐标，最小x坐标。
        if('down' === type){
            //往下延伸
            maxY = thisY+tdHeight+divHeight;
            maxX = thisX + tdWidth;
            minY = thisY;
            minX = thisX;
        }else {
            //往上延伸
            maxY = thisY+tdHeight;
            maxX = thisX + tdWidth;
            minY = thisY-divHeight;
            minX = thisX;
        }
        //再次绑定鼠标移动事件
        $(window).bind('mousemove',function (e) {
            e = e || window.event;
            if(e.pageX || e.pageY) {
                var xy = {x:e.pageX,y:e.pageY};
                console.log(xy);
                if(xy.x > maxX || xy.x < minX || xy.y > maxY || xy.y < minY){
                    //此范围内删除所有下拉框和input
                    othis.deleteAll();
                    //取消绑定的鼠标移动事件
                    $(window).unbind('mousemove');
                }
            }
        });
    };

    var active = {
        render:function (options) {
            new Class().render(options);
        },
        initTableData:function (data) {
            tableData[data.id] = data.data;
        }
    };

    exports('layuiTableColumnSelect', active);
});