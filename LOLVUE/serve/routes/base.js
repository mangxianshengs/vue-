var router = require('koa-router')();
var util=require('./../utils/utils');
var query = require('./../db/query');

router.get('/', function (ctx) {
    ctx.body = 'this is base routes';
});

//首页第二行左面的图片文字信息
router.get('/homeswiper',async function (ctx) {
    var sqlStr = 'SELECT * FROM vediolist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=util.handleSuc(0,result,'列表图请求成功');
    }else{
        ctx.body=util.handleFail(10,'','列表图请求失败');
    }
});
//首页第二行右面
router.get('/indexcon',async function (ctx) {
    let id=ctx.request.query.id;
    var sqlStr = "SELECT * FROM indexcontlist WHERE id='"+id+"'";
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'新闻列表请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','列表图请求失败');
    }
});
//首页第三行图片
router.get('/heropict',async function (ctx) {
    var sqlStr = 'SELECT * FROM herolist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'英雄介绍图请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','英雄介绍图请求失败');
    }
});
//首页中间图片介绍行
router.get('/twoyear',async function (ctx) {
    var sqlStr = 'SELECT * FROM twoyearlist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'首页年度介绍图请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','首页年度介绍图请求失败');
    }
});
//display首页创作馆展览
router.get('/museumlist',async function (ctx) {
    var sqlStr = 'SELECT * FROM museumlist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'展览馆介绍图请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','展览馆介绍图请求失败');
    }
});
//商店商品促销信息
router.get('/timeonly',async function (ctx) {
    var sqlStr = 'SELECT * FROM onlytimelist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'限时商品信息请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','限时商品信息请求失败');
    }
});
//周边商城
router.get('/groundlist',async function (ctx) {
    var sqlStr = 'SELECT * FROM groundshoplist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'周边商城信息请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','周边商城信息请求失败');
    }
});
//商品列表
router.get('/goodslist',async function (ctx) {
    var sqlStr = 'SELECT * FROM goodslist';
    let result = await query.query(sqlStr);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result,'周边商城信息请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','周边商城信息请求失败');
    }
});
//单个商品显示
router.get('/goodscont',async function (ctx) {
    var sqlStr = 'SELECT * FROM goodslist WHERE id=?';
    let id=ctx.request.query.id;
    let result = await query.query(sqlStr,id);
    if(result){
        ctx.body=ctx.body=util.handleSuc(0,result[0],'单个商品信息请求成功');
    }else{
        ctx.body=ctx.body=util.handleFail(10,'','单个商品信息请求失败');
    }
});

module.exports = router;