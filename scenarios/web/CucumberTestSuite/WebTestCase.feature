@author: rinkesh.jain
Feature: CucumberTestsuite

@CucumberScenario
Scenario Outline: Web test case

  Given get "https://www.gmail.com"
  When clear "email.identifierid"
  And sendkeys "demoqas2019@gmail.com" into "email.identifierid"
  Then verify "email.identifierid" value is "demoqas2019@gmail.com"
  When click on "span.span1111_2"
  And clear "password.qas2019"
  And sendkeys "<Password>" into "password.qas2019"
  Then verify "password.qas2019" value is "<Password>"
  When click on "span.span1111_1_1"


Examples:
    |Password|
    |test|
    |qastest|
    |QAS@2019|