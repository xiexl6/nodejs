var settings = require("../properties/settings.js");
var mongodbClient = require("mongodb").MongoClient;
var dbName = settings.dbName;
var url = settings.url;
// const db;
//连接数据库
function connect(callback){
    
    mongodbClient.connect(url,function(err,client){
        if(err){
            callback(err,null);
            return;
        }
        console.log("连接数据库成功");
        // const db = client.db(dbName);
        callback(err,client);
    })
};
//插入一条数据
exports.insertOne = function(collectionName,json, callback){
    connect(function(err,client){
       var db = client.db(dbName); 
       db.collection(collectionName).insertOne(json,function(err,result){
           if(err){
               callback(err,null);
               return;
           }
           console.log("插入数据成功");
           callback(err,result);
       })
       client.close();
    })
};
//C是{pagecount，pagesize,sort}
exports.findByJson = function(collectionName,json,C,D){
    var result = [];
    if(arguments.length==3){
        var callback = C;
        var skipNumber = 0;
        var limit = 0;
    }else if(arguments.length==4){
        var callback = D;
        var page = C;
        var skipNumber = page.pageCount * page.pageSize || 0;
        var limit = page.pageCount || 0;
        var sort = page.sort || {};
    }else{
        throw new Error("查找方法必须是三个参数或四个参数");
        return;
    }
    connect(function(err,client){
        var db = client.db(dbName); 
        var cursor = db.collection(collectionName).find(json).skip(skipNumber).limit(limit).sort(sort);
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                client.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                client.close(); //关闭数据库
            }
        });  
    });     
};
//删除
exports.deleteManyByJson = function(collectionName,json,callback){
    connect(function(err,client){
        var db = client.db(dbName); 
        db.collection(collectionName).deleteMany(json,function(err,result){
            if(err){
                callback(err,null);
                return;
            }
            console.log("删除数据成功");
            callback(err,result);
        })
        client.close();
     })
};
//修改
exports.updateByJson = function(collectionName,jsonCondition,jsonChange,callback){
    connect(function(err,client){
        var db = client.db(dbName); 
        db.collection(collectionName).updateMany(jsonCondition,jsonChange,function(err,result){
            if(err){
                callback(err,null);
                return;
            }
            console.log("修改数据成功");
            callback(err,result);
            client.close();
        })
     })
};
//获取集合总数
exports.getCountByCollectionName = function(collectionName,callback){
    connect(function(err,client){
        var db = client.db(dbName); 
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            client.close();
        })
     })
}