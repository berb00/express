var express = require('express');
var router = express.Router();

var utility = require('utility');
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/md5', function(req, res, next) {
  var q = req.query.q || 'berb00';
  var md5Value = utility.md5(q);

  res.send(md5Value);
});

router.get('/spider', function(req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        });
      });

      res.send(items);
    });
});

module.exports = router;
