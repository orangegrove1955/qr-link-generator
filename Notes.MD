# Packages

- I have used the [qrcode](https://www.npmjs.com/package/qrcode) npm package, as it seems to have the most flexibility in code generation

- I have used [express](https://expressjs.com/) to create the endpoints, as it is the package I have most familiarity with, as well as being a powerful and flexible framework for web applications

- I have used [axios](https://www.npmjs.com/package/axios) to simplify external https requests. It was chosen over others for familiarity, as well as being a lightweight promised based package

- I have used [dotenv](https://www.npmjs.com/package/dotenv) to extract access token values from the code, to store them securely in environment variables in production

- I have used [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to sign and verify JSON web tokens (JWTs) to allow authorisation for express routes

- I have used [jest](https://jestjs.io/) as the testing framework, as it is what I have the most familiarity with, as well as being a powerful, all inclusive testing framework. It was only installed as a dev dependency, as we won't need it in production deployments

- I have used [supertest](https://www.npmjs.com/package/supertest) to support express API endpoint testing

# Development notes

- I have chosen to use async/await rather than promise chaining to increase readability, except in situations where it is not possible (i.e. top level calls )

- The express application has been split into two parts (server and app) since supertest requires an app object, rather than listening on a port

- The express application uses JWT as authorisation tokens to protect routes. As noted in the comments in the file, due to the requirement of "basic authentication", all users are considered valid, but if this were to be used in production, I would use a third party service for authentication (e.g. Auth0, Okta, Firebase, etc.) to provide the strongest security

- The generator runs only once, directly before starting the server, but ideally this would be set up on a schedule or hook to regularly update the endpoint's data

- The endpoint data is filtered and placed into a file before the server starts, to eliminate the need for filtering the tables data each time the API is called
