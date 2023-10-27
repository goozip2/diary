var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

process.setMaxListeners(0);

router.post("/", (req, res) => {
  //변수 설정
  console.log("/diaries/bookmark 호출됨");
  const token = req.body.token;
  //req로 status, diaryDate 받아온다는 가정하에 개발 -> 북마크 버튼 클릭 시 +1, -1을 통해서 status는 1 또는 0의 값이라고 가정
  const status = req.body.status;
  const diaryDate = req.body.date;

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
    
    // 북마크 된 일기인 경우
    if (status == 1){
        const exec = conn.query(
            "update diary set diary_bookmark = true where diary_writer_id = ? and diary_write_date = ? ;",
              [id, diaryDate],
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
        
                  res.send("bookmark가 적용 되었습니다");
                }
              }
            );

    }
    // 북마크를 취소한 경우
    else{
        const exec = conn.query(
            "update diary set diary_bookmark = false where diary_writer_id = ? and diary_write_date = ? ;",
              [id, diaryDate],
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
        
                  res.send("bookmark가 해제 되었습니다");
                }
              }
            );

    }

    
  });
});

module.exports = router;
