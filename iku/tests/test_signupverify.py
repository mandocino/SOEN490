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
from webdriver_manager.chrome import ChromeDriverManager

class TestSignupverify():
  def setup_method(self, method):
    self.driver = webdriver.Chrome(ChromeDriverManager().install())
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_signupverify(self):
    self.driver.get("http://localhost:3000/")
    self.driver.set_window_size(1294, 1392)
    self.driver.find_element(By.CSS_SELECTOR, ".flex > .flex > .flex:nth-child(2) > .transition > .transition").click()
    self.driver.find_element(By.ID, "login-button").click()
    elements = self.driver.find_elements(By.ID, "empty-email")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.ID, "empty-first-name")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.ID, "empty-last-name")
    assert len(elements) > 0
    elements = self.driver.find_elements(By.CSS_SELECTOR, "#password-poor > p")
    assert len(elements) > 0
    self.driver.find_element(By.NAME, "email").click()
    self.driver.find_element(By.NAME, "email").send_keys("test@gmail.com")
    self.driver.find_element(By.NAME, "first_name").click()
    self.driver.find_element(By.NAME, "first_name").send_keys("test")
    self.driver.find_element(By.NAME, "last_name").send_keys("test")
    self.driver.find_element(By.NAME, "password").send_keys("test123")
    self.driver.find_element(By.NAME, "cpassword").send_keys("test1234")
  
