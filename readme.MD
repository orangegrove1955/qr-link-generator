# Installation

Run `npm install` in root of folder to install node packages

# Tests

To run tests, after installation, run `npm test`. This should run a set of jest testing suites

# Run application

To run the application, after installation, run `npm start`. This should download a new version of the json data, generate QR codes, and begin an express server on port 3000.

## Making requests

To make requests, I have included `requests.rest`, which will work with the REST Client for VS Code. The authorisation token for the GET request will need to be updated after the first `/login` call to work. Alternatively, follow the below instructions to make requests:

### Getting an auth token

Make a POST request with `content-type: application/json` and a body of the form `{'username': "<some name>"}` to `http://localhost:3000/login`

### Requests to receive data

Make a GET request to `http://localhost:3000/getVisibleTables` with the header `Authorization: Bearer <receivedToken>` using the token you received from the POST request to `/login`

### Viewing Tabular Data

Visit [http://localhost:3000/viewTabularData](http://localhost:3000/viewTabularData) in a browser. This will return a html file that displays the endpoint data in a tabular form. This route is unprotected, and will not require a token

# QR code location

The QR codes will be saved to folder `qrcode_output` with the tableID as the filename

# Notes

A `Notes.MD` file has been included, explaining decisions regarding packages and other aspects of the application
