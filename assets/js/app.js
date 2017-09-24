/**
 * Created by hewan on 2017-09-22.
 */
var app=angular.module("myApp",[]);
app.controller('TodoCtrl',['$scope',function ($scope) {
  
  
  $scope.taskList=[];
  GetTasks();
  function GetTasks() {
    if(localStorage.getItem('taskList')){
      $scope.taskList=angular.fromJson(localStorage.getItem('taskList'))
    }
  }
  /*
   添加任务
   1.获取到用户输入的内容
   2.准备一个任务列表数组
   3.添加键盘事件(keyup)
   4.将用户输入的任务名字添加到任务列表数组中
   5.将数据通过ng-repeat指令循环到页面中
   */
  
  
  $scope.addTask=function (event) {
    if(event.keyCode==13){
      //判断如果用户输入了名字 进行下部操作
      if($scope.task){
        //将任务放到数组里面
        $scope.taskList.push({
          //用户的名字
          name:$scope.task,
          /*
           更改任务状态
           1.我们需要一个数据来代表当前这条任务的状态
           2.将代表状态的数据和人物的复选框绑定
           3.根据状态的值来决定是否添加类名
           */
          isCompleted:false, //当前任务完成状态
          isEditing:false //当前任务编辑状态
        })
        //清空文本框
        $scope.task="";
      }
    }
  }
  
  
  /*
   删除任务:
   1.给删除按钮添加事件
   2.找到要删除的数据
   3.删除
   */
  $scope.deleteTask=function (task) {
    $scope.taskList.splice($scope.taskList.indexOf(task),1);
  }
  
  
  /*
   计算未完成任务的数量
   
   1.循环数据
   2.判断当前数据中的isCompleted字段是否为假
   3.累加
   页面中的差值表达式是可以调用函数的  函数体返回什么  页面就显示什么
   
   */
  $scope.unCompletedTaskNum=function () {
    /*1.
    var num=0;
    for(var i=0;i<$scope.taskList.length;i++){
      if(!$scope.taskList[i].isCompleted){
        num++;
      }
    }
    return num;
     */
    
    /*
    2.
    filter 是数组下面的方法 对数组中的元素进行过滤
    参数是一个回调函数，数组中有多少条数据，回调函数就会被执行多少次
    在回调函数中指定过滤条件  符合条件的将会被留下，不符合条件的将会被剔除  返回一个新数组
     */
    return  $scope.taskList.filter(function (item) {
      return !item.isCompleted
    }).length;
  }
  
  /*
  筛选条件
   1.给筛选按钮添加点击事件
   2.判断当前点击的是哪一个按钮
   3.根据当前的按钮修改筛选条件
  */
  $scope.condition="";
  $scope.isActive="All";
  $scope.filterTask=function (type) {
    switch(type){
      case 'All':
        $scope.condition="";
        $scope.isActive="All";
        break;
      case 'Active':
        $scope.condition=false;
        $scope.isActive="Active";
        break;
      case 'Completed':
        $scope.condition=true;
        $scope.isActive="Completed";
        break;
    }
  }
  
  /*
   清除已完成
   1.给清除已完成按钮添加点击事件
   2.找到已完成的任务
   3.删除任务
   */
  
  
  $scope.clearCompleteTask=function () {
    /*
    for(var i=0;i<$scope.taskList.length;i++){
      if($scope.taskList[i].isCompleted){
        $scope.taskList.splice(i,1);
        i--;
      }
    }
    */
    $scope.taskList=$scope.taskList.filter(function (item) {
      return !item.isCompleted;
    })
  }
  
  /*
   批量更改任务状态
   1.给按钮绑定一个值
   2.给按钮添加一个点击事件
   3.修改状态
   */
  $scope.changeTaskStatus=function () {
    for(var i=0;i<$scope.taskList.length;i++){
      $scope.taskList[i].isCompleted=$scope.status;
    }
  }
  
  $scope.updateStatus=function () {
    for(var i=0;i<$scope.taskList.length;i++){
      if(!$scope.taskList[i].isCompleted){
        $scope.status=false;
        return;
      }
    }
    $scope.status=true;
  }
  
  /*
   更改任务名称
   1.给任务名称添加双击事件
   2.将点击的这条任务的isEditing字段改成true
   3.根据isEditing字段来决定是否添加类名
   4.将当前任务的名字和文本框绑定
   5.取消编辑状态
   
   */
  $scope.modifyTaskName=function (task) {
    $scope.taskList.forEach(function (item) {
      item.isEditing=false;
    });
    task.isEditing=true;
  }
  
  $scope.cancelEditing=function (task) {
    task.isEditing=false;
  }
  
 //监听数据发生变化就重新保存
  $scope.$watch('taskList',function () {
    localStorage.setItem('taskList',angular.toJson($scope.taskList));
  },true)
}])

/*
 让文本自动获取焦点
 */
app.directive('inpFocus',['$timeout',function ($timeout) {
  return function (scope,element,attributes) {
    scope.$watch('item.isEditing',function (newValue) {
      if(newValue){
        //改变代码的执行顺序  将代码移动到最后执行
        $timeout(function () {
          element[0].focus();
        },0)
      }
    })
  }
}])