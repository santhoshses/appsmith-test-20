const commonlocators = require("../../../../../locators/commonlocators.json");
const dsl = require("../../../../../fixtures/tableNewDslWithPagination.json");

describe("Table Widget property pane feature validation", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("Verify table column type changes effect on menuButton and iconButton", function () {
    cy.openPropertyPane("tablewidget");
    cy.addColumn("CustomColumn");
    cy.editColumn("customColumn1");

    cy.changeColumnType("Menu Button", false);
    cy.wait(400);
    cy.get(commonlocators.selectedIcon).should("have.text", "(none)");
    cy.getTableDataSelector("1", "5").then((selector) => {
      cy.get(selector + " button span.bp3-icon").should("not.exist");
    });

    cy.changeColumnType("Icon Button", false);
    cy.wait(400);
    cy.get(commonlocators.selectedIcon).should("have.text", "add");
    cy.getTableDataSelector("1", "5").then((selector) => {
      cy.get(selector + " button span.bp3-icon-add").should("exist");
    });

    cy.changeColumnType("Menu Button", false);
    cy.wait(500);
    cy.get(commonlocators.selectedIcon).should("have.text", "(none)");
    cy.getTableDataSelector("1", "5").then((selector) => {
      cy.get(selector + " button span.bp3-icon").should("not.exist");
    });

    cy.closePropertyPane();
  });
});
