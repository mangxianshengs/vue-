var mysql=require('mysql');
var connection=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'lolserve'
});

connection.connect((err)=>{
    if(err){
        console.error('error connecting'+err.stack);
        return;
    }

    console.log('connected as id数据库连接成功'+connection.threadId);
});

const query=function(sql,params={}){
    return new Promise((resolve,reject)=>{
        connection.query(sql,params,function(error,results){
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        })
    })
}

module.exports=connection;