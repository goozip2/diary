from flask import Flask, render_template, request, jsonify
from model import summary_model, emo_model, keyword_model
import numpy as np
# import json

app = Flask(__name__)

# Node.js로부터 일기 받아와서 내용 바꾸고 넘기기
@app.route("/sendmodeltext", methods=['POST'])
def writetest():
    raw_text = request.args['text']
    if (len(raw_text)<40):
        raw_text = raw_text + raw_text
    oneLine_text = text_oneLine(raw_text)
    summ = summary_model(oneLine_text)
    emotion = emo_model(summ)
    key_list = keyword_model(raw_text)
    return jsonify({
        'emotion': emotion, 
        'summ': summ,
        'key_list': key_list
    })

# @app.route("/write")
# def write_diary():
#     return render_template('write.html')

# @app.route("/diary")
# def search_diary(summ, key_list):
#     return render_template('diary.html', summary = summ, kwd = key_list)

def text_oneLine(text):
    applied_text = text.replace("\n", "")
    applied_text = text.replace("\t", "")
    return applied_text

if __name__ == "__main__":
    app.run(host='0.0.0.0',port='4000', threaded = True)