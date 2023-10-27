var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  //const id = req.body.id;
  const token = req.body.token;
  const date = req.body.date;
  const yearMonth = date.substring(0, 8) + "__"; //연월   2023-02-13
  var json = {};

  try {
    var check = jwt.verify(token, "secretKey");
    if (check) {
      console.log("token 검증", check.user_id);
    }
  } catch {
    console.log("token 검증 오류");
  }

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
      "delete from diary where diary_writer_id = ? AND diary_write_date = ?;",
      [check.user_id, date],
      (err, result) => {
        conn.release();
        console.log("실행된 SQL: " + exec.sql);
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
          // sql 성공 시
          /*
          res. 메소드 모음
          - res.writeHead: response 객체의 메소드에서 헤더 정보를 응담에 작성해서 내보내기
          - res.write(''): Header 정보 다음 Body 내용 작성
          - res.end(): 응답종료(내보내기 완료)
          +) res.status
          */
          //오류가 없을 경우
          console.log("쿼리문 성공");
          console.dir(result);
          //res.send(result);
          //res.end();

          const exec = conn.query(
            "select diary_write_date, diary_summary from diary where diary_writer_id = ? and diary_write_date like ?;",
            [check.user_id, yearMonth],
            (err, result) => {
              // sql 오류 시
              if (err) {
                console.log("SQL 실행 시, 오류 발생");
                console.dir(err);
                res.writeHead("200", {
                  "content-Type": "text/html; charset=utf8",
                });
                res.write("<h2>SQL 실행 실패;</h2>");
                res.status(404).send("오류");
                res.end();
                return;
              } else {
                var dataList = [];
                for (var data of result) {
                  dataList.push(new Date(data.diary_write_date));
                }
                var summaryList = [];
                for (var data of result) {
                  summaryList.push(data.diary_summary);
                }
                json.dataList = dataList;
                json.summaryList = summaryList;

                // sql 성공 시
                res.send(json);
                res.end();
              }
            }
          );
        }
      }
    );
  });
});

module.exports = router;
