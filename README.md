Welcome to the lucid dream app's code!

This is written with node.js it uses MVC backend structure.

The basic structure is:
  server.js is the main server that has all of the set up.
  The files in the views folder create the different web pages. They're writte in ejs, and many change depending on the users progress.
  The files in the routes folder (accounts.js, index.js, sleep.js, survey.js) connect all the views together. They put URLs and instructions for how each will be used. They each have GET calls and POST calls for most of the different views. 
  The file in the models folder is the user model. It contains all the information that will be stored for an individual user, much of which will be stored on the database.
  
  The website is deployed on HEROKU using the eco Dyno plan being payed for by my Github student credits. 
