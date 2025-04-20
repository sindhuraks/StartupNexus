describe('Start a Post Test', () => {

  beforeEach(() => {
    cy.visit('/dashboard')
    
    // Mock the session to simulate logged-in state
    cy.window().then((win) => {
      win.sessionStorage.setItem('next-auth.session-token', 'mock-token')
      
      // Mock user session
      const mockSession = {
        user: {
          name: Cypress.env('GITHUB_USERNAME'), // Using Cypress environment variable for GitHub username
          password: Cypress.env('GITHUB_PASSWORD'), // Using Cypress environment variable for GitHub password
          name: 'Sindhura'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      win.sessionStorage.setItem('next-auth.session', JSON.stringify(mockSession));
    })
    
    // Reload to apply the session
    cy.reload()
    
    // Intercept API calls
    cy.intercept('POST', 'http://localhost:8080/v1/startup/insert', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'Startup post created successfully'
      }
    }).as('createPost')
  });

  it('should open the post modal when clicking "Start a post" button', () => {
    // Click the "Start a post" button
    cy.get('button').contains('Start a post').click()
    
    // Verify the modal is visible
    cy.get('div').should('be.visible')
    cy.get('h3').contains('Create a post').should('be.visible')
  });

  it('should close the modal when clicking the close button', () => {
    // Open the modal
    cy.get('button').contains('Start a post').click()
    
    // Click the close button
    cy.get('button').contains('✖').click()
    
    // Verify the modal is no longer visible
    cy.get('div').contains('postModal').should('not.exist')
  });

  it('should create a new post with all fields filled', () => {
    // Open the modal
    cy.get('button').contains('Start a post').click()
    
    // Fill in the startup details
    cy.get('input[placeholder="Enter the name of your startup"]').type('EcoTech Solutions')
    
    // Select industries
    cy.contains('button', 'AI').click()
    
    // Fill in description
    cy.get('textarea[placeholder="What do you want to talk about?"]')
      .type('We are developing eco-friendly AI solutions to optimize energy consumption in smart buildings.')
    
    // Fill in budget
    cy.get('input[placeholder*="budget"]').type('50000')
    
    // Fill in timeframe
    cy.get('input[placeholder*="timeframe"]').type('8 months')
    
    // Submit the form
    cy.get('button').contains('Post').click({ force: true })
    
    // Wait for the API call to complete
    cy.wait('@createPost').then((interception) => {
      // Verify the request payload
      expect(interception.request.body).to.have.property('startup_name', 'EcoTech Solutions')
      expect(interception.request.body).to.have.property('industry', 'AI')
      expect(interception.request.body).to.have.property('budget', 50000)
      expect(interception.request.body).to.have.property('timeframe', '8 months')
    });
    
    // Verify the modal is closed after successful submission
    cy.get('div').contains('postModal').should('not.exist')
  });
});