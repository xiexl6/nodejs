var express = require("express");
var app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

app.get("/", function (req, res) {
    // Connection URL
    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'test';

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        if(err){
            res.send("连接数据库失败");
            return;
        }
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        db.collection("stu").insertOne({"name":"武松","age":88},function(err,result){
            if(err){
                res.send("插入数据失败！");
                return;
            }
            res.send(result);
            client.close();
        })
    });
});

app.listen(80);