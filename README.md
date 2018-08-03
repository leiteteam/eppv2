# eppv2
项目代码框架和注意事项：
1.本项目是基于ionic3+Cordova+Android开发的混合型应用；ionic3实现绝大多数的页面展现也业务逻辑；
Android作为底座，对上层H5页面提供原生硬件相关的接口，提供接口能力的中间件就是Cordova完成的。
2，Android底座接口目前主要包含哪些？
    1) 网络请求，由ionic层TyNetworkServiceProvider提供上层接口，经由自定义Cordova插件TyNative的post方法实现；
    2）数据存储，由DeviceIntefaceServiceProvider和DeviceIntefaceServiceProvider提供上层接口，由底层TyNative的两个接口分别实现，具体如下：
        a，saveString和getString接口直接实现key-value形式的存储；
        b，由push接口使用自定义的命令code实现复杂数据接口的存储，类似saveSample，getDoneTaskLIst等
    3）相机拍照和二维码扫描，由Cordova原生插件Camera和自定义插件使用push接口“qrScan”实现；
    4）gps定位信息通过push接口location指令获取；
3，目前页面上的UI地图展示使用的是高德Js-api地图。详情可参考：https://lbs.amap.com/api/javascript-api/summary/
4，由于需求原因，项目首页使用4个子app模式展示，进入每个子app要求重新登录，更新appType，详参home.ts
5，由于需求原因，任务需要离线完成，在线时上传，因此有一套离线缓存设计：
    1）将服务端下发的任务列表的每一项，视为一个不可分割的子任务：去样点采集样品，样品包含一个主样和多个字样；
    2）改子任务属于一个样点位置，可能多个子任务都属于某一个样点位置，样点位置又管理企业信息；
    3）子任务中设计包含所属父级信息，公共信息，分样信息以及将要发生的或已经完成的样品信息;
    4) 任务对象重构过程：
       a，第一步，先把服务端获取的task列表项重构，公共信息抽取到task对象：
        {
        "TaskID": 85, 
		...

        //提取出来的公共信息放到task中
		"GroupName": "采样小组01",
		"GroupMember": "管理员、何璐、十路",
		"category": [...],
		//提取出来的公共信息放到task中

        //自带的父级信息
		"Point": {... },
		"Company": {
			"CompanyName": "",
			...
		}
        //自带的父级信息
	}
    此时task尚无sample信息。
    b，客户端将重构后的task对象进行再次包装，以完成离线数据状态更新管理，因此底层数据库设计了TaskData实体类，结构如下：
        public String taskid;//唯一关联data字段
        public String userid;//关联用户，避免同一个手机不同用户登录后看到的任务数据混乱
        public String data;//data部分时上一步初步重构后的task对象的string字符串
        public String samples;//这里的samples实际上对应的是该任务的一个样品，但该样品含主样和多个字样，因此叫samples
        //0:待采样;1:已采样未上传，可修改，2：已上传
        public int state;

        该底层对象，经过接口读取到上层，将被转成最终的task大json对象，结构如下：
        {
	        "username": "cy000102",
	        "state": 1,
	        "taskid": 85,
	        "data": {
		        "GroupName": "采样小组01",
		        "GroupMember": "管理员、何璐、十路",
		        "category": [...],
		        "TaskID": 85,
                ...
                "Point": {... },
                "Company": {
                    "CompanyName": "",
                    "CompanyAddress": "",
                    "CLongitude": "",
                    "CLatitude": ""
                }
            },
            "samples":{...}//这里的samples实际上对应的是该任务的一个样品，但该样品含主样和多个字样，因此叫samples
        }
    c,明白了这个设计方式之后，就知道采样页面列表项跳转样品采集页面所需传的对象就是最终形态的task大json，理论上可以满足后续页面所有UI展示所需要的数据，并且可方便的存储采集过程产生的样品信息：内存中给task大json赋值samples对象的数据，然后直接调用底座saveSamle的存储方法即可。
    d，需要注意的是，上层向下传task大json对象时，需要转JSON.stringfy化，而底层向上层恢复json对象时JSON.parse，而其中最关键的地方就是最终的task大对象里面的data字段和samples字段是string类型，需要各自独立解析方能最终还原成大json，反之亦然：
        taskList.forEach(element => {
          let task = JSON.parse(element);
          task.data = JSON.parse(task.data);
          if (task.samples){
            task.samples = JSON.parse(task.samples);
          }
          this.doneList.push(task);
        });
