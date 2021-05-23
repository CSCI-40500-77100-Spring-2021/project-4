import unittest

loader = unittest.TestLoader()

tests = loader.discover("frontend/tests")

testRunner = unittest.runner.TextTestRunner(verbosity=2)
testRunner.run(tests)
