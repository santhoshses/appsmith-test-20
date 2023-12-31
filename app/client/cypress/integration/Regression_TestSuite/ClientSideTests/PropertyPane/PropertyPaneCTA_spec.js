const dsl = require("../../../../fixtures/TextTabledsl.json");

describe("Property pane CTA to add an action", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("1. Check if CTA is shown when there is no action", function () {
    cy.openPropertyPane("tablewidget");
    cy.get(".t--propertypane-connect-cta")
      .scrollIntoView()
      .should("be.visible");

    //Check if CTA does not exist when there is an action
    cy.NavigateToAPI_Panel();

    cy.CreateAPI("FirstAPI");
    cy.SearchEntityandOpen("Table1");
    cy.get(".t--propertypane-connect-cta").should("not.exist");
  });
});
