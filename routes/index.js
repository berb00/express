var express = require('express');
var router = express.Router();

var url = require('url');
var utility = require('utility');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var cnodeUrl = 'https://cnodejs.org/';

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

// superagent.get(cnodeUrl)
//   .end(function (err, res) {
//     if (err) {
//       return console.error(err);
//     }
//     var topicUrls = [];
//     var $ = cheerio.load(res.text);
//     // 获取首页所有的链接
//     $('#topic_list .topic_title').each(function (idx, element) {
//       var $element = $(element);
//       // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
//       // 我们用 url.resolve 来自动推断出完整 url，变成
//       // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
//       // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
//       var href = url.resolve(cnodeUrl, $element.attr('href'));
//       topicUrls.push(href);
//     });

//     var ep = new eventproxy();

//     ep.after('topic_html', topicUrls.length, function (topics) {
//       topics = topics.map(function (topicPair) {
//         var topicUrl = topicPair[0];
//         var topicHtml = topicPair[1];
//         var $ = cheerio.load(topicHtml);
//         return ({
//           title: $('.topic_full_title').text().trim(),
//           href: topicUrl,
//           comment1: $('.reply_content').eq(0).text().trim(),
//         });
//       });

//       console.log('final:');
//       console.log(topics);
//     });

//     topicUrls.forEach(function (topicUrl) {
//       superagent.get(topicUrl)
//         .end(function (err, res) {
//           console.log('fetch ' + topicUrl + ' successful');
//           ep.emit('topic_html', [topicUrl, res.text]);
//         });
//     });
//   });

module.exports = router;
