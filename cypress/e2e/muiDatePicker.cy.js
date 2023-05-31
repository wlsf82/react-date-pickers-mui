describe('Date picker - Material UI', () => {
  // Arrange
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

  // Wait 2 seconds after every test
  // so the recorded video doesn't get cut
  // Source: https://youtu.be/afy7iS13ctM
  afterEach(() => {
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(2000)
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

  it('picks the current date (today)', () => {
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

  context('Previous and next months', () => {
    // Arrange
    const year = today.getFullYear()
    const month = today.getMonth()
    const months = Object.freeze({
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'Jully',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December',
    })

    it('visits the previous calendar month', () => {
      // Arrange
      const todayOneMonthAgo = today.setMonth(today.getMonth() - 1)
      const dateOneMonthAgo = new Date(todayOneMonthAgo)
      const yearOneMonthAgo = dateOneMonthAgo.getFullYear()
      // Assert
      cy.get('@datePickerDialog')
        .find(`[role="presentation"]:contains(${months[month]} ${year})`)
        .should('be.visible')
      // Act
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowLeftIcon"]')
        .click()
      // Assert
      cy.get('@datePickerDialog')
        .find(`[role="presentation"]:contains(${months[month - 1]} ${yearOneMonthAgo})`)
        .should('be.visible')
    })

    it('visits the next calendar month', () => {
      // Arrange
      const todayOneMonthForward = today.setMonth(today.getMonth() + 1)
      const dateOneMonthForward = new Date(todayOneMonthForward)
      const yearOneMonthForward = dateOneMonthForward.getFullYear()
      // Assert
      cy.get('@datePickerDialog')
        .find(`[role="presentation"]:contains(${months[month]} ${year})`)
        .should('be.visible')
      // Act
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowRightIcon"]')
        .click()
      // Assert
      cy.get('@datePickerDialog')
        .find(`[role="presentation"]:contains(${months[month + 1]} ${yearOneMonthForward})`)
        .should('be.visible')
    })
  })

  context('Year different than the current one', () => {
    it.skip('picks a date in a year different than the current one', () => {
      // @TODO
    })
  })
})
