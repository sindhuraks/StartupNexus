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