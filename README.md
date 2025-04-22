# StartupNexus
**Startup Nexus** is a collaborative platform designed to bridge the gap between aspiring entrepreneurs, experienced industry professionals, and potential investors. It acts as a virtual ecosystem where ideas transform into successful ventures through features like idea incubation, mentorship matchmaking, global networking, investor pitch opportunities, educational resources, and progress tracking tools. By fostering collaboration and providing the tools needed for growth, Startup Nexus empowers users to bring their visions to life.

## Backend 
- Varun Aiyaswamy Kannan
- Hamsavahan Harikrishnan 

## Frontend
- Bhumijaa Balaji
- Sindhura Kumbakonam Subramanian 

## TechStack
### Frontend
- React
- Nextjs
- HTML, CSS, Javascript
- Jest
- Cypress

### Backend

## Installation
Steps to get the development environment running:
- Clone/download the repository.
- Navigate to StartupNexus directory. Run the `npm install` command. This will download all the dependencies listed in package.json file(You need to install depedencies only once).
- Run `npm run dev` to start the Nextjs project and navigate to http://localhost:3000/.
- Navigate to cmd/api directory and run `go run *.go` (ignore the test files) to start the server on port 8080.

### Backend Live Reloading (Optional - Recommended for Development)
We recommend using the air package for live-reloading during Go backend development. This tool automatically rebuilds and restarts your Go server whenever you modify your code, providing a smoother development experience.
- Installing air
- Install air globally using Go:
```sh
go install github.com/cosmtrek/air@latest
```
Make sure $GOPATH/bin is in your system's PATH.
- Running the Backend Server With air
1. Navigate to the cmd/api directory:
```sh
cd cmd/api
```
- To start the server with live reload, run:
```sh
air
``` 
By default, air will detect any changes and restart your server automatically on port 8080.


## Running unit tests
To execute unit tests via `Jest`.
- Navigate to `src/app/` and run `npm run test page.test.js`.
- Navigate to `src/app/dashboard` and run `npm run test dashboard.test.js`.
- Navigate to `src/app/view-profile` and run `npm run test view-profile.test.js`.
- Navigate to `src/app/message` and run `npm run test message.test.js`.
- Navigate to `src/app/network` and run `npm run test network.test.js`.

Before running the tests, make sure you are already running the application using the steps mentioned in `Installation` section.

## Running end-to-end tests
To execute unit tests via `Cypress`.
- Navigate to StartupNexus directory and run `npx cypress open`. Choose a browser of your choice and click on each spec file to execute the tests.

Before running the tests, make sure you are already running the application using the steps mentioned in `Installation` section.


## Running Backend Tests
To ensure code quality and correctness, you should run the automated Go test cases provided for the backend.
Running All Tests
- Navigate to the backend directory containing your .go test files, typically cmd/api:
```bash
cd cmd/api
```
Then, run:
```bash
go test ./...
```
- This will recursively run all Go tests in the current directory and its subdirectories.
Running Specific Test Files
To run tests in a particular file (for example, handler_test.go):

```bash
go test handler_test.go
```
Or, to run tests only for the current package:
```bash
go test
```
