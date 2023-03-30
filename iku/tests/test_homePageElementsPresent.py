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
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class TestHomePageElementsPresent():
    def setup_method(self, method):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)
        self.vars = {}

    def teardown_method(self, method):
        self.driver.quit()

    def test_homePageElementsPresent(self):
        self.driver.get("http://localhost:3000/")
        
        # Search for an element unique to the SearchBar component
        elements = self.driver.find_elements(By.CSS_SELECTOR, "input[type='search']")
        assert len(elements) > 0
        
        # Search for an element unique to the Guide component
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".shadow-lg .text-4xl.font-bold")
        assert len(elements) > 0
        
        # Search for an element unique to the Description component
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".shadow-lg .max-w-prose")
        assert len(elements) > 0