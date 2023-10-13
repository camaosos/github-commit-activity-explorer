## React App

Install Node.js and run

npx create-react-app github-commit-activity-explorer --template typescript

You can check how to install, start and test your [React App](README_REACT.md)

## Python App

Install requirements

First step is to create a virtual environment and install libraries, in my case I used Conda (verify if Anaconda or Miniconda is previosly installed):

```
conda create -n prophet_env python=3.8
conda activate prophet_env
pip install -r requirements.txt
```

Run the API

```
uvicorn prophet_app:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to view it in the browser.

## For both

Press your GitHub profile picture and then Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token. Copy the token to a secure place.

Create a file called ".env" (it is not included in the repo for obvious reasons) and add the following line:

```
REACT_APP_AUTH_TOKEN="<token>"
```
This token will work for both Octokit and PyGitHub.

When the "Predict" button is pressed in the React app, the Python microservice should be running.

## Assignments
- [Pre Assignment answers](PRE_ASSIGNMENT_ANSWERS.md)
- [Post Assignment answers](POST_ASSIGNMENT_ANSWERS.md)
