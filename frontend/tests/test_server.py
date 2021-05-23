import unittest
import requests

# This set of tests checks if each page can be rendered by the server.
# If they fail, something might be wrong with the Jinja syntax, the app.py file, or something else.
class testServer(unittest.TestCase):
    def test_home(self):
        try:
            r = requests.get("http://127.0.0.1:5000/")
        except:
            self.fail("Could not open home page")

    def test_registrationb(self):
        try:
            r = requests.get("http://127.0.0.1:5000/registration-b")
        except:
            self.fail("Could not open business registration page")

    def test_registrationu(self):
        try:
            r = requests.get("http://127.0.0.1:5000/registration-u")
        except:
            self.fail("Could not open user registration page")

    def test_cart(self):
        try:
            r = requests.get("http://127.0.0.1:5000/cart")
        except:
            self.fail("Could not open cart page")

    def test_restaurantprofile(self):
        try:
            r = requests.get("http://127.0.0.1:5000/restaurantProfile")
        except:
            self.fail("Could not open restaurant profile page")

