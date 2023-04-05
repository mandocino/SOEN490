import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

class TestSignupverify():
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

    def test_signupverify(self):
        self.driver.get("http://"+hostname+":3000/register")
        self.driver.set_window_size(1294, 1392)
        
        self.driver.find_element(By.NAME, "email").click()
        self.driver.find_element(By.NAME, "email").send_keys("test@gmail.com")
        
        self.driver.find_element(By.NAME, "first_name").click()
        self.driver.find_element(By.NAME, "first_name").send_keys("test")
        
        self.driver.find_element(By.NAME, "last_name").click()
        self.driver.find_element(By.NAME, "last_name").send_keys("test")
        
        self.driver.find_element(By.NAME, "password").click()
        self.driver.find_element(By.NAME, "password").send_keys("test123")
        
        self.driver.find_element(By.NAME, "cpassword").click()
        self.driver.find_element(By.NAME, "cpassword").send_keys("test1234")
        
        self.driver.find_element(By.ID, "login-button").click()
        
        time.sleep(2)  # Give time for error messages to appear
        
        # Check if the input values are correctly filled
        assert self.driver.find_element(By.NAME, "email").get_attribute("value") == "test@gmail.com"
        assert self.driver.find_element(By.NAME, "first_name").get_attribute("value") == "test"
        assert self.driver.find_element(By.NAME, "last_name").get_attribute("value") == "test"
        assert self.driver.find_element(By.NAME, "password").get_attribute("value") == "test123"
        assert self.driver.find_element(By.NAME, "cpassword").get_attribute("value") == "test1234"
        
        # Check if an error message is displayed when the password and confirm password fields have mismatched values
        mismatch_error = self.driver.find_element(By.ID, "password-no-match")
        assert mismatch_error.text != ""
