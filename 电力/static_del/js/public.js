//弹出层Div
function OpenDiv(title,wh,content){//标题，高度宽度，内容或者DOM元素
	layer.open({
		skin: 'demo-class'//自定义样式
		,type: 1 //内容形态
		,title: title //不显示标题栏
		,closeBtn: '1'//按钮样式
		,area: wh //高宽度
		,shade: 0.5 //遮罩层
		,maxmin : true //最大化
		,anim: 0 //过渡动画
		,id: 'LAY_layuipro' //设定一个id，防止重复弹出
		,btn: false //按钮名称
		,btnAlign: 'c'
		,moveType: 1 //拖拽模式，0或者1
		,content: content
		,yes: function(index, layero){
			//执行保存方法
			return false;
		}
		,success: function(layero){
			//点击成功方法
			return false;
		}
	});
}
//弹出层iframe
function OpenHtml(title,wh,content){//标题，高度宽度，链接地址
	layer.open({
		skin: 'demo-class'//自定义样式
		,type: 2 //内容形态
		,title: [title,"font-size:16px;font-weight:bold"] //不显示标题栏
		,closeBtn: '1'//按钮样式
		,area: wh //高宽度
		,shade: 0.5 //遮罩层
		,maxmin :true //最大化
		,anim: 0 //过渡动画
		,id: 'LAY_layuipro' //设定一个id，防止重复弹出
		,btn: false //按钮名称
		,btnAlign: 'c'
		,moveType: 1 //拖拽模式，0或者1
		,content: content
		,yes: function(index, layero){
			//执行保存方法
			return false;
		}
		,success: function(layero){
			//点击成功方法
			return false;
		}
	});
}
//表格数据提交方法
function SubmitTable(url,data,type,iframe,lay_id){//地址，数据，方式，是否iframe,重载tabel的lay-filter ID
	layer.confirm('是否确定保存？',{icon: 3, title:'系统信息'},function(index){
		var $ = layui.jquery;
		var table = layui.table;
		if(iframe){
			layer = parent.layer;
			table = parent.layui.table;
		}
		var indexIframe = layer.getFrameIndex(window.name);//获取当前窗口索引
		$.ajax({
			url: url,//请求地址
			data:JSON.stringify(data),//请求数据
			type:type,//请求方法
			dataType:"json",//数据类型
			contentType: 'application/json',
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.close(indexIframe);//关闭当前窗口
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					if(lay_id){
						table.reload(lay_id);//重载tabel数据
					}
				} else {
					layer.msg(data.data,{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		//console.log(error);
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      	},
	      	complete:function(xhr,status){
	      		//console.log(status);
	      	}
		});
		return false;
		layer.close(index);
	});
}
//普通数据提交方法
function SubmitData(url,data,type,iframe,render){//地址，数据，方式，是否iframe,回调函数
	layer.confirm('是否确定保存？',{icon: 3, title:'系统信息'},function(index){
		var $ = layui.jquery;
		if(iframe){
			layer = parent.layer;
		}
		var indexIframe = layer.getFrameIndex(window.name);//获取当前窗口索引
		$.ajax({
			url: url,//请求地址
			data:data,//请求数据
			type:type,//请求方法
			dataType:"json",//数据类型
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.close(indexIframe);//关闭当前窗口
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					render();
				} else {
					layer.msg('抱歉，操作失败',{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		//console.log(error);
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      	},
	      	complete:function(xhr,status){
	      		//console.log(status);
	      	}
		});
		return false;
		layer.close(index);
	});
}
//开关提交方法
function SubmitSwitch(url,data,type,lay_id){//地址，数据，方式，重载tabel的lay-filter ID
	var $ = layui.jquery;
	var table = layui.table;
	layer.confirm('真的要设置为<span style="padding:0px 5px;color:rgb(255,0,0)">'+data.content+'</span>吗？',{icon: 3, title:'系统信息'},function(index){
		$.ajax({
			url: url,//请求地址
			data:data,//请求数据
			type:type,//请求方法
			dataType:"json",//数据类型
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					table.reload(lay_id);//重载tabel数据
				} else {
					layer.msg('抱歉，操作失败',{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		//console.log(error);
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      		table.reload(lay_id);
	      	},
	      	complete:function(xhr,status){
	      		//console.log(status);
	      	}
		});
		return false;
		layer.close(index);
	},function(index){
		table.reload(lay_id);
	});
}
//初始化数据方法
function getData(url,data,type,render){//地址，数据，方式，方法
	var $ = layui.jquery;
	$.ajax({
		url: url,
		data:data,
		type:type,
		async:true,
		beforeSend:function(){},
		success: function(data){
        	if(data.code == 0){
        		if(data.data != null){
        			render(data.data);
        		} else {
        			layer.msg('抱歉，没有数据',{icon:2,time:2000});
        		}
			} else {
				layer.msg('抱歉，操作失败',{icon:2,time:2000});
			}
      	},
      	error:function(xhr,status,error){
      		layer.msg('抱歉，查询失败',{icon:2,time:2000});
      	},
      	complete:function(xhr,status){
      		//console.log(xhr);
      	}
	});
	return false;
}
//搜索表格方法
function SearchTable(data,lay_id){
	var table = layui.table;
	table.reload(lay_id, {
		where: data
    	,page: {curr: 1}//重新从第 1 页开始
  	});
}

function UpdateTable(url,type,data,title,lay_id){
	var $ = layui.jquery;
	var table = layui.table;
	layer.confirm(title,{icon: 3, title:'系统信息'},function(index){
		$.ajax({
			url: url,//请求地址
			data:JSON.stringify(data),//请求数据
			type:type,//请求方法
			contentType: 'application/json',
			dataType:"json",//数据类型
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					table.reload(lay_id);//重载tabel数据
				} else {
					layer.msg('抱歉，操作失败',{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		 
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      	},
	      	complete:function(xhr,status){
	      		 
	      	}
		});
		return false;
		layer.close(index);
	});
}


//删除表数据方法
function DeleteTable(url,type,data,lay_id){//地址，方式，数据，重载tabel的lay-filter ID
	var $ = layui.jquery;
	var table = layui.table;
	layer.confirm('确定要删除吗？',{icon: 3, title:'系统信息'},function(index){
		$.ajax({
			url: url,//请求地址
			data:data,//请求数据
			type:type,//请求方法
			dataType:"json",//数据类型
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					table.reload(lay_id);//重载tabel数据
				} else {
					layer.msg('抱歉，操作失败',{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		//console.log(error);
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      	},
	      	complete:function(xhr,status){
	      		//console.log(status);
	      	}
		});
		return false;
		layer.close(index);
	});
}
//删除数据方法
function DeleteData(url,type,data,render){//地址，方式，数据，回调函数
	var $ = layui.jquery;
	layer.confirm('确定要删除吗？',{icon: 3, title:'系统信息'},function(index){
		$.ajax({
			url: url,//请求地址
			data:data,//请求数据
			type:type,//请求方法
			dataType:"json",//数据类型
			async:true,//是否异步
			beforeSend:function(){
				//console.log(data);
				//console.log(JSON.stringify(data));
			},
			success: function(data){
	        	if(data.code == 0){
					layer.msg('恭喜，操作成功',{icon:1,time:2000});
					render();
				} else {
					layer.msg('抱歉，操作失败',{icon:2,time:2000});
				}
	      	},
	      	error:function(xhr,status,error){
	      		//console.log(error);
	      		layer.msg('抱歉，连接失败',{icon:2,time:2000});
	      	},
	      	complete:function(xhr,status){
	      		//console.log(status);
	      	}
		});
		return false;
		layer.close(index);
	});
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
