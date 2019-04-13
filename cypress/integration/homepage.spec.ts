it('loads', () => {
  cy.visit('http://localhost:4200');
  cy.get('app-root h1').contains('Welcome to overtime-frontend!');
});
