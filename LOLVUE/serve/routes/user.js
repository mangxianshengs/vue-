var router = require('koa-router')();
var conn = require('./../db/db');
/* GET users listing. */
router.get('/', function (ctx) {
  ctx.body = 'this is users routes';
});
//对数据库操作
const query = function (sql, params={}) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  })
}
//用户信息
router.post('/infor',async function (ctx) {
  var sqlStr = 'SELECT * FROM userlist WHERE id=?';
  let id =ctx.cookies.get('userId');
  let result=await query(sqlStr,id);
  if(id!=-1){
    if(result[0]){
      ctx.body={
        status:0,
        msg:'app中请求user信息成功',
        username:result[0].username
      }
    }
    else{
      ctx.body={
        status:10008,
        msg:'请用先进行登录'
      }
    }
  }
});
router.post("/register", async function (ctx) {
  var sqlselect = "SELECT * FROM userlist WHERE username=?"
  let username = ctx.request.body.username;
  let ishaving = await query(sqlselect, username);
  if (ishaving[0]) {
    ctx.body = {
      status: 10009,
      msg: '用户已经被注册'
    }
    return;
  }
  else {
    var param = {
      username: ctx.request.body.username,
      password: ctx.request.body.password,
      amount:0
    };
    let sql = "INSERT INTO userlist SET ?";
    let doc = await query(sql, param);
    if (doc) {
      ctx.body = {
        status: 3,
        msg: '注册成功'
      }
    }
    else {
      ctx.body = {
        status: 10009,
        msg: '注册失败'
      }
    }
  }
});
router.post("/login", async function (ctx) {
  var sqlselect = "SELECT * FROM userlist WHERE username=?";
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let ishaving = await query(sqlselect, username);

  if (!ishaving[0]) {
    ctx.body = {
      status: 10008,
      msg: '账户不存在请先进行注册'
    }
    return;
  } else if (password != ishaving[0].password) {
    ctx.body = {
      status: 10008,
      msg: '账户密码不正确请重新输入'
    }
    return;
  }else{
    ctx.body={
      status:2,
      msg:'登陆成功',
      data:{
        id:ishaving[0].id,
        username:ishaving[0].username,
        amount:ishaving[0].amount
      }
    }
  }
});
//加入购物车
router.post("/addcart", async function (ctx) {
  let userid=ctx.request.body.userid;
  let goodsid=ctx.request.body.id;
  var goodslist="SELECT * FROM goodslist";
  let goodsArray=await query(goodslist);
  var startSeclect="SELECT * FROM cartlist WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
  let ishaving=await query(startSeclect);
  console.log(ishaving);
  var updateUser="UPDATE userlist SET amount =? ";
  var selectCart="SELECT amount FROM userlist WHERE id='"+userid+"'";
  let amount=await query(selectCart);
  console.log(amount);
  var insertCart="INSERT INTO cartlist(userid, goodsid, checked, amount,totalprice) VALUES (?, ?, ?, ?,?)";
  let params=[userid,goodsid,"true",1,goodsArray[goodsid-1].price];
  await query(updateUser,++(amount[0].amount));
  if(ishaving[0]){
    var updateCartAmount="UPDATE cartlist SET amount='"+(ishaving[0].amount+1)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    var updateCartMoney="UPDATE cartlist SET totalprice='"+(++ishaving[0].amount*goodsArray[goodsid-1].price)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    await query(updateCartAmount);
    await query(updateCartMoney);
    ctx.body={
      status:0,
      msg:"购物车添加成功",
      amount:amount[0].amount
    };
  }
  else{
    await query(insertCart,params);
    ctx.body={
      status:96,
      msg:"购物车商品插入成功",
      amount:amount[0].amount
    };
  }
});
router.post("/cart", async function (ctx) {
  var sqlselect = "SELECT * FROM cartlist WHERE userid=?"
  let userid = ctx.request.body.id;
  let ishaving = await query(sqlselect, userid);
  if (ishaving) {
    ctx.body = {
      status: 0,
      msg: '用户购物车数量加载成功',
      cartlist:ishaving
    }
  } else {
    ctx.body = {
      status: 96,
      msg: '用户购物车数量加载失败',
      cartlist:[]
    }
  }
});
//购物车总金额
router.post("/totalmoney", async function (ctx) {
  var sqlselect = "SELECT * FROM cartlist WHERE userid=?"
  var goodsselect="SELECT * FROM goodslist";
  let userid = ctx.request.body.id;
  let ishaving = await query(sqlselect, userid);
  let goods=await query(goodsselect);
  let money=0;
  ishaving.forEach(element => {
    if(element.checked=='true'){
      money+=element.amount*goods[element.goodsid-1].price;
    }
  });
  if (ishaving[0]) {
    ctx.body = {
      status: 0,
      msg: '用户购物车总金额加载成功',
      money:money
    }
  } else {
    ctx.body = {
      status: 96,
      msg: '购物车中还没有选择商品',
      money:0
    }
  }
});
//购物车操作
router.post("/cartchange", async function (ctx) {
  let userid=ctx.request.body.userid;
  let goodsid=ctx.request.body.goodsid;
  let sign=ctx.request.body.single;
  var selectCartList="SELECT * FROM cartlist WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
  var goodslist="SELECT price FROM goodslist WHERE id='"+goodsid+"'";
  let goods=await query(goodslist);
  var updateUser="UPDATE userlist SET amount =? ";
  var selectCart="SELECT * FROM userlist WHERE id='"+userid+"'";
  let amount=await query(selectCart);
  let cartArray=await query(selectCartList);
  if(sign=="+"){
    var updateCartAmount="UPDATE cartlist SET amount='"+(cartArray[0].amount+1)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    var updateCartPrice="UPDATE cartlist SET totalprice='"+(cartArray[0].totalprice+goods[0].price)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    query(updateUser,++amount[0].amount);
    query(updateCartAmount);
    query(updateCartPrice);
  }
  else if(sign=='-'){
    var updateCartAmount="UPDATE cartlist SET amount='"+(cartArray[0].amount-1)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    var updateCartPrice="UPDATE cartlist SET totalprice='"+(cartArray[0].totalprice-goods[0].price)+"'  WHERE userid = '"+userid+"' AND goodsid='"+goodsid+"'";
    query(updateCartAmount);
    query(updateUser,--amount[0].amount);
    query(updateCartPrice);
  }
  ctx.body={
    status:0,
    msg:'操作购物车成功',
    amount:amount[0].amount
  }
});
router.post("/cartcheck", async function (ctx) {
  let userId=ctx.request.body.userId;
  let goodsid=ctx.request.body.goodsId;
  let condition=ctx.request.body.checked;
  var updateCart="UPDATE cartlist SET checked=? WHERE userid='"+userId+"' AND goodsid='"+goodsid+"'";
  let checked='';
  if(condition=='true'){
    checked='false';
  }else{
    checked='true';
  }
  let cartChecked=await query(updateCart,checked);
  if(cartChecked){
    ctx.body={
      status:0,
      msg:'商品选中状态修改成功'
    }
  }
  else{
    ctx.body={
      status:20000,
      msg:'商品选中状态修改失败'
    }
  }
});
//删除购物车商品
router.post("/cartdelete", async function (ctx) {
  let userId=ctx.request.body.userId;
  let goodsid=ctx.request.body.goodsId;
  let num=ctx.request.body.amount;
  var selectCart="SELECT amount FROM userlist WHERE id = '"+userId+"'";
  var deleteCart="DELETE FROM cartlist where userid = '"+userId+"' AND goodsid='"+goodsid+"'";
  var updateUser="UPDATE userlist SET amount=? WHERE id='"+userId+"'";
  let amount=await query(selectCart);
  let number=amount[0].amount-num;
  console.log(number);
  query(updateUser,number); 
  let success=query(deleteCart);
  if(success){
    ctx.body={
      status:0,
      msg:'购物车商品删除成功',
      amount:number
    }
  }
  else{
    ctx.body={
      status:20000,
      msg:'购物车商品删除失败'
    }
  }
});
module.exports = router;