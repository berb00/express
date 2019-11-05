var router = express.Router();

/* POST login page. */
router.post('/login', function(req, res, next) {
  //获取请求传递过来的数据
  var currentData = req.body;
  console.log(currentData);
  //模拟数据库查询判断，设置返回数据str
  if(currentData.username == "guan" && currentData.password == "0818"){
      var str = {"result":{"username": currentData.username ,"password": currentData.password },"code":1};
  } else{
      var str = {"result":{},"code":0};
  }
  res.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});//可以解决跨域的请求
str = JSON.stringify(str);
  //打印要返回的数据str
  console.log("resData:  " + str);
  res.end(str);
});

module.exports = router;