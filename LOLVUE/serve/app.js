/**
 * 宇
 * 模仿英雄联盟官网后台应用
 */
const Koa=require('koa');
const Router=require('koa-router');
const logger=require('koa-logger');
const json=require('koa-json');
const static=require('koa-static');
const views=require('koa-views');
const bodyparser=require('koa-bodyparser');
const conn=require('./db/db');
const base=require('./routes/base');
const user=require('./routes/user');
//创建Koa实例
const app=new Koa();


const router=new Router({
    //加前缀
    prefix:'/api',
})

app.use(logger());
app.use(json());
//静态服务中间键
app.use(static(__dirname+'/public'));
app.use(views(__dirname+'/views'),{
    //ejs可以传参数
    extension:'ejs'
});
app.use(bodyparser());

router.get('/test',(ctx,next)=>{
    ctx.body={
        name:'u',
        age:30
    };
})

router.get('/html',async (ctx)=>{
    await ctx.render('index.ejs',{
        name:'Jack'
    });
})

router.use('/base',base.routes(),base.allowedMethods());
router.use('/user',user.routes(),user.allowedMethods());
app.use(router.routes());

app.listen(3000);

app.on('error',(err,ctx)=>{
    console.error('serve error',err);
});

console.log('app started on port 3000....');