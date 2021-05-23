import unittest
import requests

# This set of tests checks for simple email and password validation.
# Not a complete test! There are just a few test cases.
class testValidation(unittest.TestCase):
    def test_email_no_period(self):
        data = {
            "email": "e@e",
            "password": "HelloW0rld!",
            "first_name" : "John",
            "last_name" : "Doe", 
            "username" : "cs405"
            }
        r = requests.post("http://127.0.0.1:5000/registration-u", data = data)
        if r.status_code == 200:
            self.fail("Allowed a bad email to pass (an email with no periods")
    
    def test_password_no_special_char(self):
        data = {
            "email": "myemail@email.com", 
            "password": "HelloW0rld",
            "first_name" : "John",
            "last_name" : "Doe", 
            "username" : "cs405"
            }
        r = requests.post("http://127.0.0.1:5000/registration-u", data = data)
        if r.status_code == 200:
            self.fail("Allowed a bad password to pass")

    def test_password_short(self):
        data = {
            "email": "myemail@email.com", 
            "password": "Hw1!",
            "first_name" : "John",
            "last_name" : "Doe", 
            "username" : "cs405"
            }
        r = requests.post("http://127.0.0.1:5000/registration-u", data = data)
        if r.status_code == 200:
            self.fail("Allowed a short password to pass")

    def test_password_no_digit(self):
        data = {
            "email": "myemail@email.com", 
            "password": "HelloWorld!",
            "first_name" : "John",
            "last_name" : "Doe", 
            "username" : "cs405"
            }
        r = requests.post("http://127.0.0.1:5000/registration-u", data = data)
        if r.status_code == 200:
            self.fail("Allowed a password with no numbers to pass")
    
    def test_email_pass_good(self):
        data = {
            "email": "myemail@email.com",
            "password": "HelloW0rld!",
            "first_name" : "John",
            "last_name" : "Doe", 
            "username" : "cs405"
            }
        r = requests.post("http://127.0.0.1:5000/registration-u", data = data)
        if r.status_code == 404:
            self.fail("Prevented a good email to pass")
    
    

