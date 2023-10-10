#### Describe the major design/build decisions and why you made them. 

- Use React (previously called ReactJS) + Typescript: At first, it was a "forced" decision because the GitHub repositories plugin for Algolia Autocomplete is written in Typescript. However, pure Javascript, similar to Python, has the problem of the lack of typing of its variables, giving too much freedom to the developer which can be dangerous when debugging the code. Typescript comes to the rescue in that regard, similar to how Pydantic is used in Python.

- Using Algolia Autocomplete and its Github Repositories custom plugin: We should never reinvent the wheel. And for the Repository Autocomplete task, the wheel was already invented. Afterwards, this plugin was dismembered and converted to a typical Autocomplete instance, so the main app React state can be used when rendering.

#### How long did the assignment take (in hours)? Please break down your answer into buckets (e.g. "Learning Framework", "Coding", "Debugging").

- Implement the main app in ReactJS with Typescript (1 h)
- Graph Github Repo Participation data for the last 52 weeks in ChartJS, ReactJS, and Octokit (2 h)
- Implementing Algolia Autocomplete with GitHub Repositories custom plugin and adding a list of selected repos (2 h)
- Creating a Python microservice using Facebook Prophet, PyGitHub, and FastAPI, calling it from the React App (1 h)
- Documentation (1 h)

Total: 7 h

#### If you could go back and give yourself advice at the beginning of the project, what would it be?
- Use Typescript from the beginning.
- Do documentation first, then code. At least the Preassignment answers.
- I would begin with the ML task first.

#### Did you learn anything new?
- The UseEffect hook.
- Using push/slice is forbidden inside onClick functions. Use concat/filter instead.
- Algolia Autocomplete: A difficult library full of features, but useful for this task.

#### Do you feel that this assignment allowed you to showcase your abilities effectively?

This is a front-end focused assignment for a Machine Learning position, so it may fail when it comes to showcasing Python skills. Python is the main programming language for Data Science and Machine Learning developers. What is usually done in the industry is to deploy Python ML microservices that are called by front-end and back-end code.
That is exactly what I did in this assignment because there is no such thing as a Facebook Prophet library in Javascript.

#### Are there any significant web development-related skills that you possess that were not demonstrated in this exercise? If so, what are they?

- I know in advance that the development of machine learning microservices with best practices in Python, as well as MLOps, is not web development as such, but due to the nature of the test I find it necessary to mention it.
- Continuous integration and continuous deployment.
- DevOps with Docker and Kubernetes.
- Testing.