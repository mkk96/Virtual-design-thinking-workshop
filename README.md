# Virtual Design Thinking Workshop

A Flask web app for running a five-stage design thinking workshop online, with team spaces, sticky notes, live chat, a shared whiteboard and an auto-generated PDF report.

![Python](https://img.shields.io/badge/Python-3-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socketdotio&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)

## Overview

Design thinking is a collaborative, iterative process in which the findings from one stage feed the next. In person, a workshop typically ran over two or three consecutive days. When COVID-19 ruled out offline sessions, the idea behind this project was to move the whole workshop online and let it be split into shorter, more manageable sessions without losing the structure.

The app walks teams through the five classic stages, **Empathize → Define → Ideate → Prototype → Test**, and gives each team its own space:

- A **host** sees every registered user in a lobby, assigns participants to teams and starts the workshop.
- **Participants** wait in the lobby until the host has created teams, then work only inside their own team's space.
- **Stakeholders** can follow the teams' progress.
- In each stage, team members add **sticky notes** and talk in a **live chat**; notes and chat history are stored in SQLite.
- In the Prototype stage, teams sketch on an embedded online **whiteboard** or **upload an image**.
- On submission, the app builds a **PDF report** of the team's notes and uploaded images and sends it to the browser as a download.

## Features

- User registration and login (Participant or Stakeholder role on sign-up; the Host role is set in the database)
- Lobby showing all registered users; the host assigns each participant to one of four teams
- Team view listing members per team, with a link into the team's workshop space
- Sticky notes per stage (create, edit, delete) saved through small REST endpoints (`/add`, `/read`, `/delete`)
- Real-time chat over Socket.IO, persisted per team
- Prototype stage with an embedded [WBO](https://wbo.ophir.dev/) whiteboard and image upload
- PDF report (FPDF) with the team number, Empathize, Define, Ideate and Test notes, and uploaded images

## Tech stack

- **Backend:** Python, Flask, Flask-SocketIO, Flask-RESTful, Flask-SQLAlchemy, FPDF
- **Database:** SQLite (`register.db` for users and teams, `stickyNotes.db` for notes, chat and images)
- **Frontend:** HTML, CSS, JavaScript, Bootstrap, jQuery, Socket.IO client
- **Whiteboard:** WBO (embedded in an iframe)

## Project structure

```
Virtual-design-thinking-workshop/
├── app.py                 # Flask app: auth, lobby/teams, stage pages, REST + Socket.IO handlers, PDF report
├── register.db            # SQLite: REGISTRATION_INFO and teams tables
├── stickyNotes.db         # SQLite: sticky, chat and photo tables (created by SQLAlchemy if missing)
├── templates/
│   ├── login.html, register.html
│   ├── welcome.html       # lobby / team assignment
│   ├── teams.html
│   └── empathize.html, define.html, ideate.html, prototype.html, test.html
└── static/
    ├── scripts/           # sticky-note + chat logic per stage, lobby/team rendering
    ├── styles/
    └── img/
```

## Getting started

### Prerequisites

- Python 3
- pip

### Install and run

```bash
git clone https://github.com/mkk96/Virtual-design-thinking-workshop.git
cd Virtual-design-thinking-workshop

pip install flask Flask-SQLAlchemy Flask-SocketIO Flask-RESTful fpdf
python app.py
```

The server starts through Socket.IO on port **8000**. Open <http://127.0.0.1:8000/>.

The front-end scripts call the backend at `http://127.0.0.1:8000` directly, so run it locally on that port (or update those URLs in `static/scripts/` and the forms in `templates/` before deploying elsewhere).

## Usage

The app tracks logged-in users across browser sessions, so to try it locally you need several users signed in from separate sessions (for example, a normal window, an incognito window and a second browser).

1. **Register** each user from the login page, choosing *Participant* or *Stakeholder*.
2. **Log in as the host.** The host role is stored as `PARTICIPANT = 2` in the `REGISTRATION_INFO` table of `register.db`; it is not offered on the registration form, so set it in the database for the account that should run the workshop.
3. In the lobby, the host assigns each participant to **Team 1-4** and clicks **Create Team**.
4. From **Teams**, the host starts the meeting; participants then open their team's space.
5. Teams move through **Empathize, Define and Ideate**, adding sticky notes and chatting.
6. In **Prototype**, teams use the whiteboard or upload an image of their prototype.
7. In **Test**, teams record feedback and press **Submit** to download `report.pdf`.

### Flow diagrams

![Workshop flow](https://i.ibb.co/Fb4GD9t/image.png)

![Workshop flow, continued](https://i.ibb.co/GnvHvnm/image.png)

## Notes and limitations

This is a prototype built for a course setting, not a production service:

- Passwords are stored in plain text and SQL queries are built with string formatting.
- Workshop state (teams created, meeting started, current team) lives in server-side global variables, so the app is meant for a single workshop on a single server process.

## Further reading

- [Design thinking workshop framework (Netmind)](https://netmind.net/en/design-thinking-in-an-hour-workshop-framework/)
- [Design thinking workshop: a step-by-step guide (Medium)](https://medium.com/windmill-smart-solutions/design-thinking-workshop-step-by-step-guide-428171c2adee)
- [How to run a virtual design thinking workshop (Miro)](https://miro.com/blog/how-to-run-a-virtual-design-thinking-workshop/)
- [Reference article (Google Drive)](https://drive.google.com/file/d/0B5tEq_Jf3-6oOVk0SWkzM2xmOTg/view?resourcekey=0-gBtx2H9ne8GQnRafv83JMg)

## Context

Built at IIIT Hyderabad (2021).

---

Made by [Mukul Kumar](https://mkk96.github.io) · [GitHub](https://github.com/mkk96) · [LinkedIn](https://www.linkedin.com/in/mukul-kumar-60322616b/)
