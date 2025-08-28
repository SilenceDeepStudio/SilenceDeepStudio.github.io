# ROS通信机制简述

ros的主要通信机制有三种：话题通信、服务通信与参数服务器。

---

## 话题通信介绍

> 情景引入：
> 
> 初次进入微博app时，软件会让你选择自己感兴趣的话题，比如央视新闻的“体育”话题。之后大数据平台就会不停向你推送央视“体育”话题的各种新闻，并且你只能接收这些新闻，而不能向央视发送自己的内容。

以上就是一个话题通信的现实映射，在ROS的话题通信中：大数据平台就是我们的ros master，“体育”就是一个话题，央视是发布方，用户是订阅方，各种新闻是话题内容。在实际实现中， ROSmaster 不需要用户实现，连接的建立也已经被封装了，故需要关注的关键点有三个:

1. 发布方
2. 接收方
3. 数据

## 话题通信基本操作

#### 需求

> 编写发布方与订阅方实现，发布方以10hz发布文本消息，订阅方订阅消息并打印。

#### 1.发布方

```cpp
#include "ros/ros.h"
#include "std_msgs/String.h"
#include <sstream>
/*
    需求：
        编写文本消息并以10Hz频率发送

    发布方实现：
        0、包含头文件
               String消息类型
        1、初始化一个节点
        2、创建一个节点句柄
        3、创建发布方
        4、编写发布内容
        5、发布
*/

int main(int argc, char  *argv[])
{

    setlocale(LC_ALL, ""); // 解决中文乱码
    // 1、初始化一个节点
    ros::init(argc, argv, "ergouzi");
    // 2、创建一个节点句柄
    ros::NodeHandle nh;
    // 3、创建发布方
    // 参数：<消息泛型>(话题名称， 缓冲区大小)
    ros::Publisher pub = nh.advertise<std_msgs::String>("fang", 10);
    // 4、编写发布内容
    std_msgs::String msg;
    // 5、发布
    ros::Rate rate(10); // 设置频率10Hz
    int count = 0;
    std::stringstream ss;

    ros::Duration(1.0).sleep(); // 避免数据丢失
    while(ros::ok()){
        ss.str(""); // 清空字符串内容
        ss.clear(); // 重置流状态
        ss << "hello --> " << count; //拼接字符串
        msg.data = ss.str().c_str();
        pub.publish(msg);

        ROS_INFO("发布的数据是：%s\n", ss.str().c_str());     
        count++;
        ros::spinOnce();
        rate.sleep();
    }

    return 0;
}
*/
```

#### 2.订阅方

```cpp
#include "ros/ros.h"
#include "std_msgs/String.h"

/*
    订阅方实现：
        0、包含头文件
               String消息类型
        1、初始化一个节点
        2、创建一个节点句柄
        3、创建订阅方
        4、编写订阅逻辑
*/

// 回调函数
void doMsg(const std_msgs::String::ConstPtr msg_p){
    ROS_INFO("收到:--> %s", msg_p->data.c_str());
}

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    // 1、初始化一个节点
    ros::init(argc, argv, "cuihua");
    // 2、创建一个节点句柄
    ros::NodeHandle nh;
    // 3、创建订阅方
    // 参数：(话题, 缓冲区大小, 回调函数)
    ros::Subscriber sub = nh.subscribe("fang", 10, doMsg);
    // 4、编写订阅逻辑
    ros::spin();

    /* code */
    return 0;
}
```

---

## 服务通信介绍

> 情景引入：
> 
> 当下水道堵塞时，我们可能需要家政公司派遣人员来进行疏通。在这个过程中我们会向家政公司请求一项服务“疏通下水道”，家政公司根据这个请求派遣工作人员进行疏通。

以上是服务通信的现实映射，在ROS的服务通信中：家政公司就是ros master，“疏通下水道”就是一项服务，我们是客户端，工作人员是服务端。在实际实现中， 需要关注的关键点同样有三个:

1. 客户端
2. 服务端
3. 数据

## 服务通信基本操作

#### 需求

> 编写服务通信，客户端提交两个整数至服务端，服务端求和并响应结果到客户端。

#### 1.服务端

```cpp
#include "ros/ros.h"
#include "pck_server_client/AddInts.h"
/*
    服务端实现：解析客户端数字，并相应结果
    0、包含头文件
            自定义服务消息类型
    1、初始化 ROS 节点
    2、创建 节点句柄
    3、创建服务对象
    4、处理请求并响应
    5、spin()
*/
// 回调函数
bool doNums(pck_server_client::AddInts::Request &request,
            pck_server_client::AddInts::Response &response){
    //1、处理请求
    int num1 = request.num1;
    int num2 = request.num2;
    ROS_INFO("接收到的数据：num1 = %d, num2 = %d", num1, num2);
    //2、组织响应
    int sum = num1 + num2;
    response.sum = sum; 
    ROS_INFO("求和结果：sum = %d", sum);

    return true;
}

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    // 1、初始化 ROS 节点
    ros::init(argc, argv, "heiShui");
    // 2、创建 节点句柄
    ros::NodeHandle nh;
    // 3、创建服务对象
    ros::ServiceServer server = nh.advertiseService("addInts", doNums);
    // 4、处理请求并响应
    ROS_INFO("服务器端已启动");
    // 5、spin()
    ros::spin();
    return 0;
}
```

#### 2.客户端

```cpp
#include "ros/ros.h"
#include "pck_server_client/AddInts.h"

/*
    客户端：提交两个整数，并处理响应的结果
    0、包含头文件
            自定义服务消息类型
    1、初始化 ROS 节点
    2、创建 节点句柄
    3、创建客户端对象
    4、提交请求并处理响应结果
*/

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    // 1、初始化 ROS 节点
    ros::init(argc, argv, "client");
    // 2、创建 节点句柄
    ros::NodeHandle nh;
    // 3、创建客户端对象
    ros::ServiceClient client = nh.serviceClient<pck_server_client::AddInts>("addInts");
    // 4、提交请求并处理响应结果
    pck_server_client::AddInts num;
    // 4-1、组织请求
    if(argc != 2+1){
        ROS_WARN("参数个数不是2");
    }else{
        ROS_INFO("参数个数正确");
    }
    num.request.num1 = atoi(argv[1]);
    num.request.num2 = atoi(argv[2]);
    // 等待服务器端启动,两个均可
    // client.waitForExistence("addInts");
    ros::service::waitForService("addInts");
    bool retevl = client.call(num);
    // 4-2、处理响应
    if(retevl == true){
        ROS_INFO("响应成功");
        ROS_INFO("响应结果为: %d", num.response.sum);
    }else{
        ROS_INFO("处理失败");
    }
    return 0;
}
```

---

## 参数服务器介绍

> 参数服务器实现是最为简单的，它就像一个公共容器，任何节点都可以向其中存取数据，实现数据的共享。

## 话题通信基本操作

#### 需求

> 实现参数服务器参数的增删改查操作。

需要注意的是，参数服务器的相关操作均有两套API：ros::NodeHandle 与 ros::param

,二者效果完全相同，仅是调用方式不同。

#### 1.参数新增与修改

```cpp
#include "ros/ros.h"

/*
    机器人参数的新增与修改
    0、（参数服务器部分的操作均有两套API）(ros::NodeHandle）(ros::param)
    1、初始化 ROS 节点
    2、创建节点句柄
    3、参数新增
    3-1、ros::NodeHandle
    3-2、ros::param
    4、参数修改
    4-1、ros::NodeHandle
    4-2、ros::param
*/

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    // 1、初始化 ROS 节点
    ros::init(argc, argv, "set_change_param");
    // 2、创建节点句柄
    ros::NodeHandle nh;
    // 3、参数新增
    // 3-1、ros::NodeHandle
    nh.setParam("type", "xiaoHuang");
    nh.setParam("radius", 0.15);
    // 3-2、ros::param
    ros::param::set("type_param", "xiaoBai");
    ros::param::set("radius_param", 0.25);
    // 4、参数修改
    // 4-1、ros::NodeHandle
    nh.setParam("radius", 0.2);
    // 4-2、ros::param
    ros::param::set("radius_param", 0.3);

    return 0;
}
```

### 2.参数查询

```cpp
#include "ros/ros.h"

/*
    参数查询
    1、ros::NodeHandle
    1-1、param  最简易，返回键对应的值
    1-2、getParam  有bool返回值
    1-3、getParamCached  同getParam，性能有提升，但重复调用无法获得新参数
    1-4、getParamNames  获取所有参数的名称(键)
    1-5、hasParam  判断某个参数名称(键)是否有值
    1-6、searchParam  搜索键，存在则存储这个键,很没用

    2、ros::param     二者功能和用法完全相同
    2-1、param 
    2-2、get
    2-3、getCached
    2-4、getParamNames
    2-5、has
    2-6、search
*/

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    ros::init(argc, argv, "get_param");
    ros::NodeHandle nh;
    // 1、ros::NodeHandle
    // 1-1、param
    double param_1 = nh.param("radius", 1);
    ROS_INFO("param_1 --> %.2lf", param_1);
    double param_2 = nh.param("diameter", 1);
    ROS_INFO("param_2 --> %.2f", param_2);
    // 1-2、getParam
    double getParam_1 = 0.0;
    bool retevl = nh.getParam("radius", getParam_1);
    if(retevl == true){
        ROS_INFO("getParam_1 --> %.2f", getParam_1);
    }else{
        ROS_INFO("getParam_1 --> 参数不存在");
    }
    // 1-3、getParamCached  
    // 实现与 getParam 相同
    // 1-4、getParamNames
    std::vector<std::string> names;
    nh.getParamNames(names);
    for(auto &&name : names){
        ROS_INFO("参数名称 --> %s", name.c_str());
    }
    // 1-5、hasParam 
    bool retevl_1 = nh.hasParam("radius");
    ROS_INFO("radius是否存在 --> %d", retevl_1);
    bool retevl_2 = nh.hasParam("diameter");
    ROS_INFO("diameter是否存在 --> %d", retevl_2);
    // 1-6、searchParam
    std::string key_1, key_2;
    nh.getParam("/radius", key_1);
    nh.getParam("diameter", key_2);
    ROS_INFO("%s, %s", key_1.c_str(), key_2.c_str());

    return 0;
}
```

### 3.参数删除

```cpp
#include "ros/ros.h"

/*
    参数的删除实现
    1、ros::NodeHandle
    2、ros::param 
*/

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");
    ros::init(argc, argv, "del_param");
    ros::NodeHandle nh;

    nh.setParam("color", "green");
    nh.setParam("size", 12);
    // 1、ros::NodeHandle
    bool retevl = nh.deleteParam("color");
    ROS_INFO("color参数 是否删除 --> %d", retevl);
    // 2、ros::param 
    bool retevl_1 = ros::param::del("size");
    ROS_INFO("size参数 是否删除 --> %d", retevl_1);

    return 0;
}
```

---

## 三种通信机制的比较

三种通信机制中，参数服务器是一种数据共享机制，可以在不同的节点之间共享数据，话题通信与服务通信是在不同的节点之间传递数据的，三者是ROS中最基础也是应用最为广泛的通信机制

这其中，话题通信和服务通信有一定的相似性也有本质上的差异，在此将二者做一下简单比较:

二者的实现流程是比较相似的，都是涉及到四个要素:

- 要素1: 消息的发布方/客户端(Publisher/Client)
- 要素2: 消息的订阅方/服务端(Subscriber/Server)
- 要素3: 话题名称(Topic/Service)
- 要素4: 数据载体(msg/srv)

二者本质差异：

|             | Topic(话题)                  | Service(服务)                   |
| ----------- | -------------------------- | ----------------------------- |
| 通信模式        | 发布/订阅                      | 请求/响应                         |
| 同步性         | 异步                         | 同步                            |
| 底层协议        | ROSTCP/ROSUDP              | ROSTCP/ROSUDP                 |
| 缓冲区         | 有                          | 无                             |
| 实时性         | 弱                          | 强                             |
| 节点关系        | 多对多                        | 一对多(一个 Server)                |
| 通信数据        | msg                        | srv                           |
| <u>使用场景</u> | <u>连续高频的数据发布与接收:雷达、里程计</u> | <u>偶尔调用或执行某一项特定功能：拍照、语音识别</u> |

根据不同的使用场景选择最合适的通信机制才可让数据传输事半功倍！
