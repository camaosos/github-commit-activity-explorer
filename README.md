## React App

You can check how to install, start and test your [React App](README_REACT.md)

## Python App

Install requirements

First step is to create a virtual environment and install libraries, in my case I used Conda (verify that Anaconda or Miniconda is previosly installed):

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

When the "Predict" button is pressed in the React app, the Python microservice should be running.

## Assignments
[Pre Assignment answers](PRE_ASSIGNMENT_ANSWERS.md)
[Post Assignment answers](POST_ASSIGNMENT_ANSWERS.md)
