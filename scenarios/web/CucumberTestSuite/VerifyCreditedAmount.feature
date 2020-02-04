@author: nidhi.shah
Feature: web

@CucumberScenario
Scenario: VerifyCreditedAmount

  # Navigate to app URL
  Given get "https://qas.qmetry.com/bank"

  # login
  When clear "text.txtusername"
  And sendkeys "Bob" into "text.txtusername"
  And clear "password.txtpassword"
  And sendkeys "Bob" into "password.txtpassword"
  And click on "button.btnlogin"

  # verify successful login
  And verify "button.button" is present

  # Credit amount
  And clear "number.enteramountforcredit"
  And sendkeys "1000" into "number.enteramountforcredit"
  And click on "button.button11"

  # verify successful transaction
  Then verify "div.div" is present

  # logout
  When click on "button.button"

  # verify successful logout
  Then verify "button.btnlogin" is present
