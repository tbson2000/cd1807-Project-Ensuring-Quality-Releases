# #!/usr/bin/env python
import logging
import time
import sys

from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By

file_handler = logging.FileHandler(
    filename='/tmp/uitest-{}.log'.format(int(time.time())))
stdout_handler = logging.StreamHandler(stream=sys.stdout)

logging.basicConfig(
    format='[%(asctime)s] %(levelname)s - %(message)s',
    handlers=[file_handler, stdout_handler],
    level=logging.INFO)


def config_driver():
    logging.info('Configure Chrome Driver ...')
    options = ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    return webdriver.Chrome(options=options)


def test_login(username='standard_user', password='secret_sauce'):
    # Start the browser and login with standard_user
    logging.info("Testing Logging In with user %s and password %s", username, password)
    DRIVER.get('https://www.saucedemo.com/')

    DRIVER.find_element(by=By.ID, value='user-name').send_keys(username)
    DRIVER.find_element(by=By.ID, value='password').send_keys(password)
    DRIVER.find_element(by=By.ID, value='login-button').click()

    assert 'https://www.saucedemo.com/inventory.html' == DRIVER.current_url
    logging.info("Testing Logging In Passed")


def test_add_to_cart_button(username='standard_user', password='secret_sauce'):
    logging.info("Testing Add to Cart Buttons")

    DRIVER.get('https://www.saucedemo.com/inventory.html')
    logging.info("Getting add cart buttons")
    inventory = DRIVER.find_elements(By.CLASS_NAME, "inventory_item")

    for item in inventory:
        item_name = item.find_element(By.CLASS_NAME, "inventory_item_name").text
        logging.info("Click Add to cart on item: %s", item_name)
        item.find_element(By.CSS_SELECTOR, "button").click()

        logging.info("Check if button on %s is REMOVE", item_name)
        assert item.find_element(By.CSS_SELECTOR, "button").accessible_name == "REMOVE"

    logging.info("Clicking on Cart button")
    DRIVER.find_element(By.CLASS_NAME, "shopping_cart_link").click()

    logging.info("Check if browser is redirected to https://www.saucedemo.com/cart.html")
    assert DRIVER.current_url == 'https://www.saucedemo.com/cart.html'

    cart_inventory = DRIVER.find_elements(By.CLASS_NAME, "cart_item")
    logging.info("Get items in carts: {}".format(",".join(item.find_element(By.CLASS_NAME, "inventory_item_name").text for item in cart_inventory)))

    logging.info("Removing item from cart")
    for item in cart_inventory:
        logging.info("Removing %s", item.find_element(By.CLASS_NAME, "inventory_item_name").text)
        item.find_element(By.CSS_SELECTOR, "button").click()

    logging.info("Check if all items is removed from cart")
    assert not DRIVER.find_elements(By.CLASS_NAME, "cart_item")

    logging.info("ALL TEST PASSED!")


DRIVER = config_driver()
try:
    test_login()
    test_add_to_cart_button()
finally:
    DRIVER.close()
