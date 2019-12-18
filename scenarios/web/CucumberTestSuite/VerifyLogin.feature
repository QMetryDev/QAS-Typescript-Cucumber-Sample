@author: nidhi.shah
Feature: web

@CucumberScenario
Scenario Outline: VerifyLogin

  # Navigate to app URL
  Given get "https://qas.qmetry.com/bank/"

  # Login
  When clear "text.txtusername"
  And sendkeys "<username>" into "text.txtusername"
  And clear "password.txtpassword"
  And sendkeys "<password>" into "password.txtpassword"
  And click on "button.btnlogin"

  # Verify login is successful
  Then verify "button.button" is visible


Examples:
    |username|password|
    |Bob|Bob|
    |Sarah|Sarah|