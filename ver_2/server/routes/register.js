var express = require("express");
var router = express.Router();
const db = require("../../server/config/db.js");
const crypto = require("crypto");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  console.log("/members/new 호출됨 " + req);

  const paramId = req.body.id;
  const paramPassword = req.body.password;
  const paramPasswordCheck = req.body.confirmPassword;
  console.log("받은 데이터 : ", paramId, paramPassword, paramPasswordCheck);

  //패스워드 암호화
  var salt = Math.round(new Date().valueOf() * Math.random()) + "";
  var hashPassword = crypto
    .createHash("sha512")
    .update(paramPassword + salt)
    .digest("hex");

  // 커넥션 풀에서 커넥션 가져오기
  db.getConnection((err, conn) => {
    // 1. sql 연결 문제 -> db 커넥션 문제 발생할 시 실행되는 함수
    // sql 연결 실패 시
    if (err) {
      console.log("Mysql 연결 실패");
      conn.release(); //커넥션 풀에 커넥션 반환 -> 연결 해제
      res.writeHead("404", { "content-Type": "text/html; charset=utf8" });
      res.write("<h2>DB 서버 연결 실패</h2>");
      res.end();
      return;
    }

    // sql 연결 성공 시
    console.log("데이터베이스 conn");
    // sql qeury문 삽입 -> ?에 순서대로 대괄호 안의 내용이 삽입됨
    const exec = conn.query(
      "insert into USER (USER_ID, USER_PASSWORD, salt) values (?, ?, ?);",
      [paramId, hashPassword, salt],
      //sql query 실행 실패, 혹은 성공할 경우에 대한 코드
      (err, result) => {
        conn.release();
        console.log("실행된 SQL: " + exec.sql);

        // 2. id 중복 문제 => 중복 확인 버튼 클릭 시 중복 여부 확인으로 변경해야댐
        if (err) {
          console.log("SQL 실행 시 오류 발생; 아이디 중복 문제");
          console.dir(err);
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>SQL 실행 실패; 아이디 중복 문제</h2>");
          res.end();
          res.status(404).send("중복!! Sorry, we cannot find that!");
          return;
        }

        if (result) {
          //3. pw 불일치 문제 => RegisterPage.jsx에서 처리했음
          if (paramPassword != paramPasswordCheck) {
            res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
            res.write("<h2>비밀번호 불일치</h2>");
            res.end();
            return;
            ``;
          }
          console.dir(result);
          console.log("INSERT 성공");
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>사용자 추가 성공</h2>");
          res.end();
        } else {
          console.log("INSERT 실패");
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>사용자 추가 실패</h2>");
          res.end();
        }
      }
    );
  });
});

module.exports = router;
