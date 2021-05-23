import unittest
import app

# This set of tests checks if each page can be rendered by the server.
# If they fail, something might be wrong with the Jinja syntax, the app.py file, or something else.
class testServer(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
    
    def tearDown(self):
        pass

    def test_home(self):
        with self.app as c:
            try:
                r = self.app.get("/")
            except:
                self.fail("Could not open home page")

    def test_registrationb(self):
        with self.app as c:
            try:
                r = self.app.get("/registration-b")
            except:
                self.fail("Could not open business registration page")

    def test_registrationu(self):
        with self.app as c:
            try:
                r = self.app.get("/registration-u")
            except:
                self.fail("Could not open user registration page")

    def test_cart(self):
        with self.app as c:
            try:
                r = self.app.get("/cart")
            except:
                self.fail("Could not open cart page")

    def test_restaurantprofile(self):
        with self.app as c:
            try:
                r = self.app.get("/restaurantProfile")
            except:
                self.fail("Could not open restaurant profile page")