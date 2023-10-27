var express = require("express");
var router = express.Router();
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  console.log("/members/new/duplicateId 호출됨 " + req);

  const paramId = req.body.id;
  console.log("받은 데이터 : ", paramId);

  // 커넥션 풀에서 커넥션 가져오기
  db.getConnection((err, conn) => {
    // db 연결 실패 시
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
      "select user_id from user where user_id = ?",
      [paramId],
      (err, result) => {
        conn.release();
        console.log("실행된 SQL: " + exec.sql);
        // sql문 실행 실패
        if (err) {
          console.log("SQL 실행 시 오류 발생");
          console.dir(err);
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>SQL 실행 실패</h2>");
          res.end();
          res.status(404).send("중복!! Sorry, we cannot find that!");
          return;
        }
        var json = {};
        // sql문 실행 성공
        if (result) {
          if (result.length != 0) {
            //중복 id 존재
            json.code = 400;
          } else {
            //중복 id 없음 -> 정상!!
            json.code = 200;
          }
          console.log(json);
          res.send(json);
          res.end();
          return;
        }
      }
    );
  });
});

module.exports = router;
