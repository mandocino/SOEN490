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
from selenium.webdriver.chrome.options import Options


class TestDashboardElementsPresent():
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

    def test_dashboardElementsPresenet(self):
        self.driver.get("http://localhost:3000/dashboard")
        self.driver.set_window_size(1294, 1392)
        
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".text-4xl")
        assert len(elements) > 0
        
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".w-96")
        assert len(elements) > 0
        
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".rounded-3xl")
        assert len(elements) > 0
        
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".grow")
        assert len(elements) > 0
        
        elements = self.driver.find_elements(By.CSS_SELECTOR, ".text-transparent")
        assert len(elements) > 0