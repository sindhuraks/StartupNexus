describe('Post Liking Functionality Test', () => {
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
            user_name: 'Jane Smith',
            content: 'Existing comment',
            created_at: new Date().toISOString()
          }
        ]
      }
    }).as('getCommentsCount');

    // Visit the dashboard page
    cy.visit('/dashboard')
    cy.wait(['@getSession', '@getAllPosts', '@getLikesCount', '@getCommentsCount'])
  });

  describe('Post Liking', () => {
    it('should like a post when the like button is clicked', () => {
      // Mock the like API response
      cy.intercept('POST', 'http://localhost:8080/v1/startup/like', {
        statusCode: 200,
        body: {
          status: 'success',
          message: 'Post liked successfully'
        }
      }).as('likePost');

      // Mock the updated like count after liking
      cy.intercept('GET', 'http://localhost:8080/v1/startup/likes/1', {
        statusCode: 200,
        body: {
          status: 'success',
          like_count: 6
        }
      }).as('getUpdatedLikesCount');

      // Check initial like count
      cy.get('[class*="likeCount"]').first().should('contain', '5 Like(s)')

      // Click the like button
      cy.get('[class*="likeButton"]').first().click()

      // Wait for the like API call to complete
      cy.wait('@likePost')

      // Verify the like count has increased
      cy.get('[class*="likeCount"]').first().should('contain', '6 Like(s)')
    });
  });
});