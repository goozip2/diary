var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

var request = require("request");

//date(String), title(), content, (token) 전달받음
router.post("/", (req, res) => {
  console.log("/members/test/write 호출됨");
  const date = req.body.date;
  const title = req.body.title;
  const content = req.body.content;
  const token = req.body.token;
  const yearMonth = date.substring(0, 8) + "__"; //연월   2023-02-13

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
  json.id = id;

  var query = "select * from diary";
  console.log("date", date);
  console.log("title", title);
  console.log("content", content);

  db.query(
    "INSERT INTO diary (DIARY_WRITER_ID, DIARY_WRITE_DATE, DIARY_TITLE, DIARY_CONTENT) VALUES (?, ?, ?, ?);",
    [check.user_id, date, title, content],
    function (error, results, fields) {
      if (error) throw error;
    }
  );

  // FLASK로 일기 내용 보내기
  const ModelResult = (callback) => {
    const options = {
      method: "POST",
      uri: "http://127.0.0.1:4000/sendmodeltext",
      qs: {
        text: content,
      },
    };
    request(options, function (err, res, body) {
      callback(undefined, {
        result: body,
      });
    });
  };

  ModelResult((err, { result } = {}) => {
    let json = JSON.parse(result); // 플라스크에서 받은 json 값

    //영화, 책 id추출 부분==================
    let emotion = json.emotion; //받은 json에서 감정 한개 받음
    let summary = json.summ;

    //감정, 영화, 책, 요약 업데이트
    //상상기업 (플리 -> 영화, 책으로 수정)
    db.query(
      "SELECT MOVIE_ID, MOVIE_TITLE FROM MOVIE WHERE MOVIE_EMOTION = ? ORDER BY RAND() LIMIT 1;",
      emotion,
      function (error, results1, fields) {
        if (error) throw error;
        console.log("감정: ", emotion);
        console.log("영화id: ", results1[0].MOVIE_ID); // results[0].PLAYLIST_ID 가 랜덤으로 뽑은 플레이리스트 ID
        db.query(
          "SELECT BOOK_ID, BOOK_TITLE FROM BOOK WHERE BOOK_EMOTION = ? ORDER BY RAND() LIMIT 1;",
          emotion,
          function (error, results2, fields) {
            if (error) throw error;
            console.log("감정: ", emotion);
            console.log("책id: ", results2[0].BOOK_ID); // results[0].PLAYLIST_ID 가 랜덤으로 뽑은 플레이리스트 ID
            db.query(
              "UPDATE diary SET DIARY_EMOTION = ?,DIARY_MOVIE = ?, DIARY_BOOK = ?, DIARY_SUMMARY = ? WHERE DIARY_WRITER_ID = ? and DIARY_WRITE_DATE = ?;",
              [emotion, results1[0].MOVIE_ID, results2[0].BOOK_ID, summary, check.user_id, date],
              function (error, results, fields) {
                if (error) throw error;
              }
            );
          }
        );
        
      }
    );

    //키워드에 대한 카테고리 추출===============
    //상상기업 (키워드 관련 코드 삭제함)
  });

  db.query(query, (err, data) => {
    if (!err) {
      console.log("오류X");
      json.data = data;
      console.log(data);
      const exec = db.query(
        "select diary_write_date, diary_summary from diary where diary_writer_id = ? and diary_write_date like ?;",
        [id, yearMonth],
        (err, result) => {
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
    } else {
      console.log("오류");
    }
  });
});
module.exports = router;

/*
[흐름 정리]

home(날짜 선택) (date, token 전달)
-> 일기 없으면(write) (현재)
-> 일기 있으면(diary) ->후에 개발

날짜, token 전달받으면,
token verify해서 user_id 받기
user_id랑 날짜 이용해서 diary 정보 받아옴
1) diary table에 해당 날짜 일기 O
    content 받아와서 뿌려줌
2) diary table에 해당 날짜 일기 X
    빈 페이지
*/
