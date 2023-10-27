var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

const crypto = require("crypto");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

process.setMaxListeners(0);

router.post("/", (req, res) => {
  //변수 설정
  console.log("/members/login 호출됨");
  const id = req.body.id;
  const password = req.body.password;

  /*
  var query =
    "select salt, user_password from user where user_id='" + id + "';";
  console.log(">>>입력한 아이디: ", id, ", 비밀번호: ", password);
  */

  var json = {};
  /*
  res에 json 넣어서 send
  json 내부 ex) "code" : 400
  상태 코드 정리
  +) id, pw 공란의 경우엔 front에서 처리 필요 (backend 호출 전에 예외처리해야 함)
  1) 404: db 연결 실패 OR sql문 실행 실패 (시스템적 오류)
  3) 401: DB에 없는 id인 경우 (id 불일치)
  4) 402: id는 맞지만, pw가 틀린 경우 (pw 불일치)
  5) 200: 모두 정상 작동
  */

  db.getConnection((err, conn) => {
    //db 연결 실패 시,
    if (err) {
      console.log("Mysql 연결 실패");
      conn.release(); //커넥션 풀에 커넥션 반환 -> 연결 해제
      res.writeHead("404", { "content-Type": "text/html; charset=utf8" });
      res.write("<h2>DB 서버 연결 실패</h2>");
      json.code = 404;
      res.send(json);
      res.end();
      console.log(json);
      return;
    }
    // db 연결 성공 시
    console.log("데이터베이스 conn");

    const exec = conn.query(
      "select salt, user_password from user where user_id='" + id + "';",
      (err, data) => {
        console.log("실행된 SQL: " + exec.sql);
        // sql 오류 시
        if (err) {
          console.log("SQL 실행 시, 오류 발생");
          console.dir(err);
          res.writeHead("200", {
            "content-Type": "text/html; charset=utf8",
          });
          res.write("<h2>SQL 실행 실패;</h2>");
          //res.status(404);
          json.code = 404;
          res.send(json);
          res.end();
          console.log(json);
          return;
        } else {
          // 결과값이 1보다 작다면(동일한 id 가 없다면)
          if (data.length == 0) {
            console.log(">>>아이디 없어유(DB에 없는 id)");
            //res.send({ msg: "가입된 id가 아닙니다. 회원가입을 진행해주세요." });
            //res.status(401);
            json.code = 401;
            res.send(json);
            console.log(json);
            return;
          } else {
            // 동일한 id 가 있으면 비밀번호 일치 확인
            console.log(">>>아이디 있어유");
            var salt = data[0].salt;
            var password_db = data[0].user_password;
            console.log(data[0].salt);
            console.log(data[0].user_password);
            const hash = crypto
              .createHash("sha512")
              .update(password + salt)
              .digest("hex");
            console.log(hash);
            if (password_db == hash) {
              console.log("로그인 성공");

              var token = jwt.sign(
                {
                  user_id: id, //Private Claim 자리 (키: 데이터)
                },
                "secretKey", //Signature (비밀키가 들어갈 자리)
                {
                  subject: "gyeongInLine jwtToken", //Public Claim 자리 (부가정보 자리)
                  expiresIn: "7d",
                  issuer: "gyeongInLine",
                }
              );

              //var json = {};
              json.id = id;
              json.token = token;

              var now = new Date(); // 현재 날짜 및 시간
              var year = now.getFullYear();
              var month = now.getMonth() + 1; // 월
              var yearmonth =
                year + "-" + ("00" + month.toString()).slice(-2) + "-__";

              console.log("토큰 생성", token);
              console.log(id, yearmonth);

              const exec = conn.query(
                "select diary_write_date, diary_summary from diary where diary_writer_id = ? and DIARY_WRITE_DATE like ?;",
                [id, yearmonth],
                (err, result) => {
                  conn.release();
                  console.log("실행된 SQL: " + exec.sql);
                  // sql 오류 시
                  if (err) {
                    console.log("SQL 실행 시, 오류 발생");
                    console.dir(err);
                    res.writeHead("200", {
                      "content-Type": "text/html; charset=utf8",
                    });
                    res.write("<h2>SQL 실행 실패;</h2>");
                    //res.status(404).send("오류");
                    json.code = 404;
                    res.send(json);
                    res.end();
                    console.log(json);
                    return;
                  } else {
                    // sql 성공 시
                    // 하루에 일기 1개 초과 시
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

                    json.code = 200;
                    console.log(json);

                    res.send(json);
                    res.end();
                  }
                }
              );
            } else {
              console.log(
                ">>>아이디는 있는데, 비밀번호가 틀렸어유(id는 ok, pw 틀림)"
              );
              //res.send({msg: "틀린 비밀번호입니다. 다시 시도해주세요.",});
              json.code = 402;
              res.send(json);
              res.end();
              console.log(json);
              return;
            }
          }
        }
      }
    );
  });
});

module.exports = router;
