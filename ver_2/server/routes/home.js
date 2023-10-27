var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

process.setMaxListeners(0);

router.post("/", (req, res) => {
  //변수 설정
  console.log("/members/home 호출됨");
  const token = req.body.token;
  //req로 date 받아온다는 가정하에 개발
  const date = req.body.date;
  const yearMonth = date.substring(0, 8) + "__"; //연월   2023-02-13
  console.log("토큰확인입니다:" + token);

  try {
    var check = jwt.verify(token, "secretKey");
    if (check) {
      console.log("token 검증", check.user_id);
    }
  } catch {
    console.log("token 검증 오류");
  }

  const id = check.user_id;

  var json = {};
  json.token = token;

  db.getConnection((err, conn) => {
    //db 연결 실패 시,
    if (err) {
      console.log("Mysql 연결 실패");
      conn.release(); //커넥션 풀에 커넥션 반환 -> 연결 해제
      res.writeHead("404", { "content-Type": "text/html; charset=utf8" });
      res.write("<h2>DB 서버 연결 실패</h2>");
      res.end();
      return;
    }
    // db 연결 성공 시
    console.log("데이터베이스 conn");

    const exec = conn.query(
      "select diary_write_date, diary_summary from diary where diary_writer_id = ? and diary_write_date like ?;",
      [id, yearMonth],
      (err, result) => {
        conn.release();
        // sql 오류 시
        if (err) {
          console.log("SQL 실행 시, 오류 발생");
          console.dir(err);
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>SQL 실행 실패;</h2>");
          res.status(404).send("오류");
          res.end();
          return;
        } else {

          var dataList = [];
          for (var data of result){
            dataList.push(new Date(data.diary_write_date));
          };
          var summaryList = [];
          for (var data of result){
            summaryList.push(data.diary_summary);
          };
          json.dataList = dataList;
          json.summaryList = summaryList;
          
          // sql 성공 시
          res.send(json);
        }
      }
    );
  });
});

module.exports = router;
