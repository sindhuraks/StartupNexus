describe('Post Commenting Functionality Test', () => {

  beforeEach(() => {
    // Mock the Next.js session authentication
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      }
    }).as('getSession');

    // Mock the API call for all posts
    cy.intercept('GET', 'http://localhost:8080/v1/startup/all', {
      statusCode: 200,
      body: {
        startups: [
          {
            id: 1,
            startup_name: 'EcoTech Solutions',
            entrepreneur: { name: 'Sindhura Subramanian' },
            created_at: new Date(Date.now() - 10800000).toISOString(),
            industry: 'AI',
            description: 'We are developing eco-friendly AI solutions to optimize energy consumption in smart buildings.',
            budget: 50000,
            timeframe: '8 months'
          }
        ]
      }
    }).as('getAllPosts');

    // Mock initial like counts
    cy.intercept('GET', 'http://localhost:8080/v1/startup/likes/1', {
      statusCode: 200,
      body: {
        status: 'success',
        like_count: 5
      }
    }).as('getLikesCount');

    // Mock initial comment counts
    cy.intercept('GET', 'http://localhost:8080/v1/startup/comments/1', {
      statusCode: 200,
      body: {
        status: 'success',
        comments: [
          {
            id: 1,
            user_name: 'Bhumijaa Balaji',
            content: 'Existing comment',
            created_at: new Date().toISOString()
          }
        ]
      }
    }).as('getCommentsCount');

    // Visit the dashboard page
    cy.visit('/dashboard');
    cy.wait(['@getSession', '@getAllPosts', '@getLikesCount', '@getCommentsCount']);
  });

  describe('Post Commenting', () => {
    it('should open comment input when comment button is clicked', () => {
      // Click the comment button
      cy.get('[class*="commentButton"]').first().click();

      // Verify the comment input is visible
      cy.get('[class*="commentSection"]').should('be.visible');
      cy.get('[class*="commentInput"]').should('be.visible');
    });

    it('should submit a comment when entered in the input field', () => {
      // Mock the comment submission API
      cy.intercept('POST', 'http://localhost:8080/v1/startup/comment', {
        statusCode: 200,
        body: {
          status: 'success',
          message: 'Comment added successfully'
        }
      }).as('submitComment');

      // Mock the updated comments after submission
      cy.intercept('GET', 'http://localhost:8080/v1/startup/comments/1', {
        statusCode: 200,
        body: {
          status: 'success',
          comments: [
            {
              id: 1,
              user_name: 'Jane Smith',
              content: 'Existing comment',
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              user_name: 'Test User',
              content: 'This is my new comment',
              created_at: new Date().toISOString()
            }
          ]
        }
      }).as('getUpdatedComments');

      // Click the comment button to open comment input
      cy.get('[class*="commentButton"]').first().click();

      // Type a comment
      cy.get('[class*="commentInput"]').type('This is my new comment{enter}');

      // Wait for the comment submission API call
      cy.wait('@submitComment');
      cy.wait('@getUpdatedComments');

      // Verify the comment input is cleared after submission
      cy.get('[class*="commentInput"]').should('have.value', '');
    });

    it('should display comments when viewing comments button is clicked', () => {
      // Mock the comments retrieval API
      cy.intercept('GET', 'http://localhost:8080/v1/startup/comments/1', {
        statusCode: 200,
        body: {
          status: 'success',
          comments: [
            {
              id: 1,
              user_name: 'Bhumijaa Balaji',
              content: 'Great startup idea!',
              created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
            },
            {
              id: 2,
              user_name: 'Bob Johnson',
              content: 'I would love to invest in this.',
              created_at: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
            }
          ]
        }
      }).as('getComments');

      // Check initial comment count
      cy.get('[class*="commentCountButton"]').first().should('contain', '1 Comment(s)')

      // Click the comment count button to view comments
      cy.get('[class*="commentCountButton"]').first().click()

      // Wait for the comments API call
      cy.wait('@getComments')

      cy.get('[class*="comment"] strong').first().should('contain', 'Bhumijaa Balaji')
      cy.get('[class*="comment"] p').first().should('contain', 'Great startup idea!')
      cy.get('[class*="comment"] strong').eq(1).should('contain', 'Bob Johnson')
      cy.get('[class*="comment"] p').eq(1).should('contain', 'I would love to invest in this.')
    });

  });
});