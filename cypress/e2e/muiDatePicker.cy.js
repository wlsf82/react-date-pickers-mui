describe('Date picker - Material UI', () => {
  // Arrange (steps that are equal to all tests)
  beforeEach(() => {
    // Visits the url of the page under test
    cy.visit('/date-picker')
    // From the 'Basic date picker' label,
    // get the next element,
    // and give it an alias of `basicDatePicker`
    cy.contains('label', 'Basic date picker')
      .next()
      .as('basicDatePicker')
    // From the `basicDatePicker`,
    // find the calendar button by its aria-label,
    // and click on it
    cy.get('@basicDatePicker')
      .find('button[aria-label="Choose date"]')
      .click()
    // Get the opened date picker dialog,
    // and give it an alias of `datePickerDialog`
    cy.get('div[role="dialog"]')
      .as('datePickerDialog')
    // From the `datePickerDialog`,
    // find the current date button by is aria-current,
    // and give it an alias of today
    cy.get('@datePickerDialog')
      .find('button[aria-current="date"]')
      .as('today')
    // From the `today` button,
    // get the previous element,
    // and give it an alias of yesterday
    cy.get('@today')
      .prev()
      .as('yesterday')
    // From the `today` button,
    // get the next element,
    // and give it an alias of tomorrow
    cy.get('@today')
      .next()
      .as('tomorrow')
  })

  it('shows the opened date picker dialog and closes it', () => {
    // Assert
    cy.get('@datePickerDialog')
      .its('length')
      .should('be.equal', 1)
    cy.get('@datePickerDialog')
      .should('be.visible')
    // Act
    cy.get('@basicDatePicker')
      .click()
    // Assert
    cy.get('@datePickerDialog')
      .should('not.exist')
  })

  it('picks the current date', () => {
    // Arrange
    const today = new Date()
    // Act
    cy.get('@today').click()
    // Assert
    cy.assertPickedDateIsEqualTo(today)
  })

  it('picks a date in the past', () => {
    // Arrange
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    // Act
    cy.get('@yesterday').click()
    // Assert
    cy.assertPickedDateIsEqualTo(yesterday)
  })

  it('picks a date in the future', () => {
    // Arrange
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    // Act
    cy.get('@tomorrow').click()
    // Assert
    cy.assertPickedDateIsEqualTo(tomorrow)
  })
})
