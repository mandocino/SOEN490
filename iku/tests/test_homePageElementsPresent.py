# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.service import Service


from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class TestHomePageElementsPresent():
  def setup_method(self, method):
    self.driver = webdriver.Chrome(ChromeDriverManager().install())
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_homePageElementsPresent(self):
    self.driver.get("http://localhost:3000/")
    elements = self.driver.find_elements(By.CSS_SELECTOR, ".lg\\3Apx-6")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.CSS_SELECTOR, "#mobile-menu-2 .flex:nth-child(2) > .transition > .transition")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.CSS_SELECTOR, ".flex > .flex > .flex:nth-child(1) > .transition > .transition")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.CSS_SELECTOR, ".flex > .flex > .flex:nth-child(2) > .transition > .transition")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.ID, "footer")
    assert len(elements) > 0
  
