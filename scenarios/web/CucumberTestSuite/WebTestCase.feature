@author: rinkesh.jain
Feature: CucumberTestsuite

@CucumberScenario
Scenario Outline: Web test case

  Given get "https://www.gmail.com"
  When clear "email.identifierid_1"
  And sendkeys "demoqas2019@gmail.com" into "email.identifierid_1"
  And click on "div.div2111_1"
  Then verify "email.identifierid_1" value is "demoqas2019@gmail.com"
  When click on "span.span1111_2"
  And clear "password.qas2019_1"
  And sendkeys "<Password>" into "password.qas2019_1"
  And click on "div.div111_1"
  Then verify "password.qas2019_1" value is "<Password>"
  When click on "span.span1111_1_1"


Examples:
    |Password|
    |test|
    |qastest|
    |QAS@2019|