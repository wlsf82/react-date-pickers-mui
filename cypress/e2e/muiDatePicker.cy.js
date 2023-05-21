describe('Date picker - Material UI', () => {
  const today = new Date()
  const todaysDay = today.getDate()
  // Arrange (steps that are equal to all tests)
  beforeEach(() => {
    // Visits the url of the web page under test
    cy.visit('/date-picker')
    // From the 'Basic date picker' label,
    // get the next element,
    // and give it an alias of `basicDatePicker`
    cy.contains('label', 'Basic date picker')
      .next()
      .as('basicDatePicker')
    // From the `basicDatePicker`,
    // find the calendar button by its aria-label,
    // and give it an alias of `calendarButton`
    cy.get('@basicDatePicker')
      .find('button[aria-label="Choose date"]')
      .as('calendarButton')
    // Get the `calendarButton`,
    // and click on it
    cy.get('@calendarButton')
      .click()
    // Get the opened date picker dialog by its role,
    // and give it an alias of `datePickerDialog`
    cy.get('div[role="dialog"]')
      .as('datePickerDialog')
    // From the `datePickerDialog`,
    // find the calendar by its role
    // and give it an alias of `calendar`
    cy.get('@datePickerDialog')
      .find('div[role="grid"]')
      .as('calendar')
  })

  it('shows the opened date picker dialog and closes it', () => {
    // Assert
    cy.get('@datePickerDialog')
      .its('length')
      .should('be.equal', 1)
    cy.get('@datePickerDialog')
      .should('be.visible')
    // Act
    cy.get('@calendarButton')
      .click()
    // Assert
    cy.get('@datePickerDialog')
      .should('not.exist')
  })

  it('picks the current date', () => {
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(todaysDay)
      .should('be.visible')
      .as('today')
    cy.get('@today').click()
    // Assert
    cy.assertPickedDateIsEqualTo(today)
  })

  it('picks a date in the past (yesterday)', () => {
    // Arrange
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdaysDay = yesterday.getDate()
    // In case today is the 1st day of the month,
    // navigate to the previous month first
    if (todaysDay === 1) {
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowLeftIcon"]')
        .click()
    }
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(yesterdaysDay)
      .should('be.visible')
      .as('yesterday')
    cy.get('@yesterday').click()
    // Assert
    cy.assertPickedDateIsEqualTo(yesterday)
  })

  it('picks a date in the future (tomorrow)', () => {
    // Arrange
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowsDay = tomorrow.getDate()
    // In case tomorrow is the 1st day of next month,
    // navigate to the next month first
    if (tomorrowsDay === 1) {
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowRightIcon"]')
        .click()
    }
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(tomorrowsDay)
      .should('be.visible')
      .as('tomorrow')
    cy.get('@tomorrow').click()
    // Assert
    cy.assertPickedDateIsEqualTo(tomorrow)
  })
})
