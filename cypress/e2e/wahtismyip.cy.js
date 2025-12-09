describe('WhatIsMyIP Website Tests', () => {
  before(() => {
    // Visit the website once before all tests
    cy.visit('/tw/')
  })

  it('should successfully load the WhatIsMyIP homepage', () => {
    // Verify page title
    cy.title().should('not.be.empty')
  })

  it('should display page content', () => {
    // Confirm page has actual content loaded
    cy.get('body').should('be.visible')
    cy.get('body').should('not.be.empty')
  })

  it('should contain IP-related text', () => {
    // Verify page contains IP-related information
    cy.get('body').should('contain', 'IP')
  })

  it('should load page elements correctly', () => {
    // Confirm page has basic HTML structure
    cy.get('html').should('exist')
    cy.get('head').should('exist')
    cy.get('body').should('exist')
  })
})
