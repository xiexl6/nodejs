var db = require("./models/db.js");
var express = require("express");
// var mongoClient = require("mongodb").MongoClient;
var app = express();
app.get("/",function(req,res){
    db.insertOne('stu',{"name":"小潘92333","age":33},function(err,result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
});
app.get("/test",function(req,res){
    db.findByJson('stu',{"age":13},{"pageCount":1,"pageSize":0,"sort":{"name":-1}},function(err,result){
        console.log(result);
        res.send(result);
    })
});
app.get("/del",function(req,res){
    db.deleteManyByJson('stu',{"name":"笑笑"},function(err,result){
        if(err){
            console.log(err);
            res.send("数据删除失败");
            return;
        }
        res.send(result);
    })
});
app.get("/update",function(req,res){
    db.updateByJson('stu',{"name":"菲菲"},{$set:{"name":"大熊","age":18,"性别":"男"}},function(err,result){
        if(err){
            console.log(err);
            res.send("修改数据失败");
            return;
        }
        res.send(result);
    })
});
app.get("/count",function(req,res){
    db.getCountByCollectionName('stu',function(count){
        res.send("该集合文档数是："+count);
    })
})

app.listen(80);