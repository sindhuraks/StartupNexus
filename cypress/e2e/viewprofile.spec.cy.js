describe('View Profile Functionality Test', () => {

  beforeEach(() => {
    // Mock the Next.js session authentication
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          name: Cypress.env('GITHUB_USERNAME'), // Using Cypress environment variable for GitHub username
          password: Cypress.env('GITHUB_PASSWORD'), // Using Cypress environment variable for GitHub password
          name: 'Sindhura'
        }
      }
    }).as('getSession');

    // Mock the user posts API call
    cy.intercept('GET', 'http://localhost:8080/v1/startup/user*', {
      statusCode: 200,
      body: {
        status: 'success',
        startups: [
          {
            id: 1,
            startup_name: 'Test Startup',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            startup_name: 'Another Test Startup',
            created_at: new Date().toISOString()
          }
        ]
      }
    }).as('getUserPosts');

    // Visit the dashboard page
    cy.visit('/dashboard')
    cy.wait('@getSession')
  });

  it('should navigate to view profile when clicking the view profile button', () => {
    // Click the profile section to open the dropdown
    cy.get('[class*="profileSection"]').click()
    
    // Verify the dropdown menu is visible
    cy.get('[class*="dropdownMenu"]').should('be.visible')
    
    // Click the View Profile button
    cy.get('[class*="dropdownMenu"] button').contains('View Profile').click()
    
    // Wait for the profile posts to load
    cy.wait('@getUserPosts')
    
    // Verify the profile page is displayed
    cy.get('[class*="pageContainer"]').should('be.visible')
    
    // Verify the user info is displayed
    cy.get('[class*="userInfo"] h1').should('contain', 'Sindhura')
    cy.get('[class*="userInfo"] p').contains('Full Stack Developer').should('be.visible')
    cy.get('[class*="userInfo"] p').contains('San Francisco, CA').should('be.visible')
    cy.get('[class*="userInfo"] p').contains('284 connections').should('be.visible')
    
    // Verify the about section is displayed
    cy.get('[class*="section"] h2').contains('About').should('be.visible')
    cy.get('[class*="section"] p').contains('Passionate about building').should('be.visible')
    
    // Verify the Recent Activity section is displayed with the user's posts
    cy.get('[class*="section"] h2').contains('Recent Activity').should('be.visible')
    
    // Verify the Experience section is displayed
    cy.get('[class*="section"] h2').contains('Experience').should('be.visible')
    cy.get('[class*="section"] p').contains('Google - Software Engineer').should('be.visible')
    cy.get('[class*="section"] p').contains('Meta - Backend Developer').should('be.visible')
  });
});