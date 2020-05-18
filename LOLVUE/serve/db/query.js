var conn = require('./db');
module.exports = {
    query:function(sql,params={}){
        return new Promise((resolve,reject)=>{
            conn.query(sql,function(error,results){
                if(error){
                    reject(error);
                }else{
                    resolve(results);
                }
            })
        })
    }
}
