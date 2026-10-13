describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://pci.ucr.ac.cr");

    cy.get('[name="keys"]').click();
    cy.get('[name="keys"]').type("maestria");
    cy.get("#edit-submit").click();
    cy.get(
      '#block-pci-content a[href="https://pci.ucr.ac.cr/vida-estudiantil/trabajos-finales-de-graduacion/marco-de-trabajo-de-aprendizaje-reforzado-basado-en"]',
    ).click();
    cy.get(".page-title > span").should("contain.text", "Marco");
  });
});
