from flask import Flask, render_template, request, abort
import re

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/registration-b")
def businessRegistration():
    return render_template("businessRegistration.html")

@app.route("/registration-u", methods=["GET", "POST"])
def userRegistration():
    if request.method == "GET":
        return render_template("userRegistration.html")
    elif request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        
        #At least 1 @ and 1 period
        email_regex = "[^@]+@[^@]+\.[^@]+"
        print(email)
        if re.search(email_regex, email) == None:
            abort(404)

        #At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
        password_regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}$"
        if re.search(password_regex, password) == None:
            abort(404)
        
        return render_template("userRegistration.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/restaurantProfile")
def profile():
    return render_template("restaurantProfile.html")

if __name__ == '__main__':
    app.run(debug=True)
