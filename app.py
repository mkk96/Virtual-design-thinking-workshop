from flask import Flask, render_template,request, flash,session,jsonify,url_for,send_file
import os
import sqlite3
from werkzeug.utils import redirect
from flask_sqlalchemy import SQLAlchemy
import json
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_restful import Api, Resource
from fpdf import FPDF
app = Flask(__name__)
team_created=0
started_meeting=0
team_find=0
app.secret_key=os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stickyNotes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)
class sticky( db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    team = db.Column(db.Integer,primary_key=True,  nullable=False)
    user = db.Column(db.String(80),primary_key=True,  nullable=False)
    stage=db.Column(db.String(80), primary_key=True, nullable=False)
    data=db.Column(db.String(256),primary_key=True,  nullable=False)

class chat( db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    team = db.Column(db.Integer,primary_key=True,  nullable=False)
    user = db.Column(db.String(80),primary_key=True,  nullable=False)
    chat=db.Column(db.String(500), primary_key=True, nullable=False)

class photo( db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team = db.Column(db.Integer,  nullable=False)
    #upload = db.Column(db.LargeBinary,  nullable=False)
    pic=db.Column(db.Text,nullable=False)

class PDF(FPDF):
    def header(self):
        # Select Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Framed title
        self.cell(30, 10, 'Title', 1, 0, 'C')
        # Line break
        self.ln(20)


pdf = FPDF()
pdf.add_page()
pdf.set_line_width(0.5)
phases = ["Empathize", "Define", "Ideate", "Prototype", "Test"]

@app.route("/")
def hello():
  return render_template('login.html')

@app.route('/home')
def home():
  if 'username' in session:
    conn = sqlite3.connect('register.db')
    c=conn.cursor()
    c.execute("""select * from REGISTRATION_INFO""")
    items=c.fetchall()
    itemsInJson={}
    itemsInJson.update({"data":items})
    c.execute("""SELECT * FROM REGISTRATION_INFO where `USERNAME` like '{}' """.format(session['username'])) 
    users= c.fetchall()
    conn.close()
    if(team_created!=0 and users[0][2]==2):
      return render_template("welcome.html",result=itemsInJson,flag=1)
    else:
      return render_template("welcome.html",result=itemsInJson,flag=users[0][2])
  else:
    return redirect('/')

@app.route("/welcomeAfterTeam", methods=['GET', 'POST'])
def welcomeAfterTeam():
    global team_created
    team_created=1
    conn = sqlite3.connect('register.db')
    c=conn.cursor()
    c.execute("""DELETE FROM teams where 1=1""")
    c.execute("""select * from REGISTRATION_INFO""")
    items=c.fetchall()
    itemsInJson={}
    itemsInJson.update({"data":items})
    if request.method=="POST":
        for user in items:
          if user[2]==0:
              query="INSERT INTO teams VALUES (?,?,?,?,?)"
              tuple=(user[0],user[4],user[5],request.form[user[0]],user[2])
              c.execute(query, tuple)
    conn.commit()
    conn.close
    return render_template("welcome.html",result=itemsInJson,flag=0)

@app.route('/teams',methods=['GET', 'POST'])
def teams():
    if request.method == 'POST':
        global started_meeting
        started_meeting=1
    conn = sqlite3.connect('register.db')
    c=conn.cursor()
    c.execute("""select * from teams""")
    items=c.fetchall()
    c.execute("""SELECT * FROM teams where `USERNAME` like '{}' """.format(session['username'])) 
    users= c.fetchall()
    c.execute("""SELECT * FROM REGISTRATION_INFO where `USERNAME` like '{}' """.format(session['username'])) 
    admin= c.fetchall()
    itemsInJson={}
    itemsInJson.update({"data":items})
    conn.close
    if len(users)>0:
      return render_template("teams.html",result=itemsInJson,flag=users[0][3],mFlag=started_meeting,aFlag=admin[0][2])
    return render_template("teams.html",result=itemsInJson,flag=0,mFlag=started_meeting,aFlag=admin[0][2])

@app.route('/register')
def regi():
  return render_template('register.html')

@app.route('/add_user', methods=['POST'])
def add_user():
    conn = sqlite3.connect('register.db')
    cursor= conn.cursor()
    name= request.form.get('username')
    fname = request.form.get('Fname')
    lname = request.form.get('Lname')
    email= request.form.get('email')
    password= request.form.get('password')
    part = request.form.get('bool')
    cursor.execute("""SELECT * FROM REGISTRATION_INFO where `USERNAME` like '{}' """.format(name)) 
    users= cursor.fetchall()
    if(len(users))>0:
      flash ("USERANAME ALREADY EXIST")
      return render_template('register.html')
    cursor.execute("""INSERT INTO `REGISTRATION_INFO` (`USERNAME`, `PASSWORD`, `PARTICIPANT`, `EMAIL`, `FIRST_NAME`, `LAST_NAME`) VALUES ('{}', '{}', '{}', '{}','{}','{}')""".format(name,password,part,email,fname,lname))
    conn.commit()
    conn.close()
    flash ("User Registered Successfully")
    return render_template('login.html')

@app.route('/login_validate', methods=['POST'])
def login_validate():
    conn = sqlite3.connect('register.db')
    cursor= conn.cursor()
    uname = request.form.get('username')
    password = request.form.get('password')
    cursor.execute("""SELECT * FROM REGISTRATION_INFO where `USERNAME` like '{}' and `PASSWORD` like '{}' """.format(uname,password)) 
    users= cursor.fetchall()
    conn.close()
    if(len(users))==1:
      session['username']= users[0][0]
      global user_id
      return redirect('/home')
    else:
      if 'username' in session:
        session.pop('username')
      flash("WRONG CREDENTIALS")
      return render_template('login.html')

@app.route("/empathize",methods=['GET', 'POST'])
def empathize():
  conn = sqlite3.connect('register.db')
  cursor= conn.cursor()
  cursor.execute("""SELECT team FROM teams where `USERNAME` like '{}' """.format(session['username'])) 
  teams= cursor.fetchall()
  if(len(teams)>0):
    global team_find
    team_find=teams[0][0]
  print(team_find)
  conn.close()
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  return render_template('empathize.html',result=List)

@app.route("/define",methods=['GET', 'POST'])
def define():
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  return render_template('define.html',result=List)

@app.route("/ideate",methods=['GET', 'POST'])
def ideate():
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  return render_template('ideate.html',result=List)

@app.route("/prototype",methods=['GET', 'POST'])
def prototype():
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  img=photo.query.filter_by(team=team_find).first()

  return render_template('prototype.html',result=List)

@app.route("/test",methods=['GET', 'POST'])
def test():
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  return render_template('test.html',result=List)
  
class add(Resource):
    def post(self):
        posted_data = (request.get_data()).decode('utf-8')
        sticky_json = json.loads(posted_data)
        for item in sticky_json['note']:
            check = sticky.query.filter_by(id=item['id']).first()
            if check is None and item['content']!="":
                obj = sticky(id=item['id'], team=team_find, user=session['username'],stage=sticky_json['stage'],data=item['content'])
                db.session.add(obj)
                db.session.commit()
            elif item['content']!="":
                check.data=item['content']
                db.session.commit()
                
class delete(Resource):
    def post(self):
        posted_data = (request.get_data()).decode('utf-8')
        check = sticky.query.filter_by(id=posted_data).first()
        db.session.delete(check)
        db.session.flush()
        db.session.commit()

class read(Resource):
    def post(self):
        posted_data = (request.get_data()).decode('utf-8')
        data = sticky.query.filter_by(stage=posted_data)
        retMap = []
        if data is None:
            return ""
        for item in data:
            if item.team==team_find:
              retMap.append({"id":item.id,"content":item.data})
        return jsonify(retMap)

socketio = SocketIO(app, manage_session=False,cors_allowed_origins="*")
@socketio.on('text')
def text(message):
  data = chat.query.filter(chat.team.like(team_find,0))
  string=session["username"]+": "+message['msg']
  if data is not None and message['msg']!="":
    length=data.count()+1
    obj = chat(id=length, team=team_find, user=session['username'],chat=string)
    db.session.add(obj)
    db.session.commit()
  elif message['msg']!="":
    obj = chat(id=1, team=team_find, user=session['username'],chat=string)
    db.session.add(obj)
    db.session.commit()
  emit('message', {'msg': string},broadcast=True)

@app.route("/upload",methods=['POST'])
def upload():
  data=request.files['pic']
  img =photo(team=team_find,pic=data.read())
  db.session.add(img)
  db.session.commit()
  data = chat.query.filter_by(team=team_find).all()
  List=[]
  for item in data:
    List.append({"id":item.id,"chat":item.chat})
  List={
    "data":List
  }
  return render_template('prototype.html',result=List)

@app.route("/submit", methods=['GET', 'POST'])
def submit():
    data = sticky.query.filter_by(team=team_find).all()
    images = photo.query.filter_by(team=team_find).all()
    empathize = []
    ideate = []
    define = []
    test=[]
    for item in data:
      if item.stage == "empathize":
          empathize.append(item.data)
      if item.stage == "ideate":
          ideate.append(item.data)
      if item.stage == "define":
          define.append(item.data)
      if item.stage == "test":
          test.append(item.data)
    x="Team: "+str(team_find)
    pdf.set_font("Arial", size=20)
    pdf.cell(200,10,txt=x,ln=1,align='C')
    pdf.set_font("Arial", size=20)
    pdf.cell(200, 10, txt=phases[0], ln=1, align='L')
    pdf.set_font("Arial", size=15)
    for i in range(0, len(empathize)):
        pdf.multi_cell(200, 10, txt=empathize[i], align='L')

    pdf.set_font("Arial", size=20)
    pdf.cell(200, 10, txt=phases[1], ln=1, align='L')
    pdf.set_font("Arial", size=15)
    for i in range(0, len(define)):
        pdf.multi_cell(200, 10, txt=define[i], align='L')

    pdf.set_font("Arial", size=20)
    pdf.cell(200, 10, txt=phases[2], ln=1, align='L')
    pdf.set_font("Arial", size=15)
    for i in range(0, len(ideate)):
        pdf.multi_cell(200, 10, txt=ideate[i], align='L')

    img_index=0
    pdf.cell(200,10,txt="Uploaded Images",ln=1,align='L')
    for item in images:
      myImg = item.pic
      fileName="encode"+str(img_index)+".png"
      with open(fileName, "wb") as file:
        file.write(myImg)
     
      pdf.image(fileName, x=None, y=None, w=200, h=100, type='png')
      img_index+=1

    pdf.set_font("Arial", size=20)
    pdf.cell(200, 10, txt=phases[4], ln=1, align='L')
    pdf.set_font("Arial", size=15)
    for i in range(0, len(test)):
        pdf.multi_cell(200, 10, txt=test[i], align='L')

    pdf.output("report.pdf")
    pdf.close()

    sticky_msgs = chat.query.filter_by(team=team_find).all()
    List = []
    for item in sticky_msgs:
        List.append({"id": item.id, "chat": item.chat})
    List = {
        "data": List
    }
    path = "report.pdf"
    return send_file(path, as_attachment=True)

@app.route("/download", methods=['GET', 'POST'])
def download():
  return render_template('login.html')

api.add_resource(add, '/add')
api.add_resource(delete, '/delete')
api.add_resource(read, '/read')
if __name__ == "__main__":
    db.create_all()
    #app.run(port=8000, debug=True)
    socketio.run(app,port='8000')