
# Virtual Design Thinking Workshop

Virtual design thinking is a highly collaborative and iterative process, in which discoveries and findings from one stage inform and impact the next. Pre-pandemic, the live workshop typically ran for two to three consecutive days to facilitate the momentum required to work through each stage.

While the schedule was intense—facilitators often worked during breaks and between sessions to document and pull findings through to the next session—there was no doubt that working through all 5 stages in succession as a cohort was the way to go.

And then, along came COVID-19.

Then offline was not possible so we have to come up with something to go on without disrupting the timeline and we have to make sure quality will be maintained, so we came up with the idea of Virtual Design Thinking Workshop in which we have all five-step but now instead of spent 4-5 days, we can now break up in a smaller session with can be more manageable and more productive.

Our software facilitates the same as usual; we have three types of users Admin or Host, Stakeholder or Owner, and last participant. Here the admin has more power to control the meeting. As in offline mode, admin can go into any team space the same as a stakeholder but participant needs to work only in their space, which provides admin and stakeholder a broad idea of the progress of each team. With the use of in-house chat and sticky notes, we can communicate and store information in a more permanent way with proper logs, and at the end of each meeting, the report will be generated in the form of a pdf which can be shared with others depending on requirements.
## Run Locally

Clone the project

```bash
  git clone https://github.com/Adigoo/Virtual-Design-Thinking-Workshop.git
```

Go to the project directory

```bash
  cd Virtual-Design-Thinking-Workshop
```

Install dependencies

```bash
  pip install flask
  pip install Flask-SQLAlchemy
  pip install Flask-SocketIO
  pip install Flask-RESTful
  pip install fpdf
```

Start the server

```bash
  python app.py
```

## Using the app
This app is designed to be deployed & served to remote clients, and tracks those clients (i.e. logged-in users) across browser sessions. So, to test the app's  capabilities locally, you'll need to create multiple users and log those users into different browser sessions (you could do this using Chrome's incognito mode, something similar, or separate browsers). 

To create the users,

Navigate to https://localhost:8000 and select 'Register'

To login the user,

Navigate to https://localhost:8000 and select 'Login'

## Tech Stack

**Front-End:** HTML, CSS, JavaScript, Bootstrap

**Back-End:** Python, Flask API, JavaScript, Whiteboard API

**Database:** SQLite

## Features

- The host can organize a workshop depending on requirnment.
- The user will register for the workshop.
- Host and user login on the day of the workshop.
- Until the Host starts the workshop the user will be waiting in the lobby area.
- The host creates the team and divides participants into an equal number of members.
- The host starts the workshop.
- The participant will be able to enter their team space.
- Team members will create a sticky note in Empathize step according to their understanding.
- The team will define the major problem in the define step and their solution in the ideate step.
- The team will create a prototype of the solution from the ideate step using either whiteboard or file upload.
- The team will test and take feedback from members and stakeholders.
- After the submission report will be generated
- At end meeting can be end by participants.


## Flow Diagram

![App Screenshot](https://i.ibb.co/Fb4GD9t/image.png)

![App Screenshot](https://i.ibb.co/GnvHvnm/image.png)


## Documentation

[Artical 1](https://drive.google.com/file/d/0B5tEq_Jf3-6oOVk0SWkzM2xmOTg/view?resourcekey=0-gBtx2H9ne8GQnRafv83JMg)

[Artical 2](https://netmind.net/en/design-thinking-in-an-hour-workshop-framework/)

[Artical 3](https://medium.com/windmill-smart-solutions/design-thinking-workshop-step-by-step-guide-428171c2adee)

[Artical 4](https://miro.com/blog/how-to-run-a-virtual-design-thinking-workshop/)

## Authors

- [@Mukul Kumar](http://github.com/mkk96)



## Feedback

If you have any feedback, please reach out to us at mukul1996.mc@gmail.com

