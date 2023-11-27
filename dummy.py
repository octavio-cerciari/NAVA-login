import subprocess
from flask import Flask, request, jsonify, render_template, session

app = Flask(__name__)

# Global variables to store user inputs
username = ""
repository = ""
destination = ""
branch = ""
project = ""

@app.route('/', methods=['GET', 'POST'])
def index():
    if session.get('current_step') == 'project':
        bot_response = "Please enter the project name:"
    elif session.get('current_step') == 'branch':
        bot_response = "Please select a branch to checkout:"
    elif session.get('current_step') == 'destination':
        bot_response = "Please enter the destination path:"
    elif session.get('current_step') == 'repository':
        bot_response = "Please enter the repository name:"
    elif session.get('current_step') == 'username':
        bot_response = "Please enter your username:"
    else:
        bot_response = "Welcome! Please enter a command or select an option:<br/><button type='button' class='option-button' name='clone' onclick='sendOption(\"Clone Repository\")'>Clone Repository</button>"

    return render_template('index.html', bot_response=bot_response)

@app.route('/process', methods=['POST'])
def process():
    global username, repository, destination, branch, project

    user_input = request.form['user_input']

    perform_clone = False  # Initialize perform_clone variable
    perform_checkout = False  # Initialize perform_checkout variable

    if request.form.get('clone'):
        session['current_step'] = 'username'
        bot_response = "Please enter your username:"
    elif session.get('current_step') == 'username':
        username = user_input
        session['current_step'] = 'repository'
        bot_response = "Please enter the repository name:"
    elif session.get('current_step') == 'repository':
        repository = user_input
        session['current_step'] = 'destination'
        bot_response = "Please enter the destination path:"
    elif session.get('current_step') == 'destination':
        destination = user_input
        session['current_step'] = 'project'
        bot_response = "Please enter the project name:"
    elif session.get('current_step') == 'project':
        project = user_input
        session['current_step'] = 'branch'
        bot_response = "Fetching branches..."
        branches = fetch_branches(project)  # Call the function to fetch the branches
        return jsonify({'bot_response': bot_response, 'branches': branches})
    elif session.get('current_step') == 'branch':
        branch = user_input
        session['current_step'] = None
        perform_clone = True
        bot_response = "Cloning repository..."
    else:
        bot_response = "Invalid command. Please try again."

    if perform_clone:
        url = f"https://bitbucket.mycompany.com/{username}/{repository}.git"
        password = "<password>"  # Replace with the actual password

        try:
            # Store the credentials in the credentials manager
            process = subprocess.Popen(["git", "credential", "approve"], stdin=subprocess.PIPE)
            process.stdin.write(f"url={url}\nusername={username}\npassword={password}\n".encode())
            process.stdin.close()
            process.wait()

            # Clone the repository
            subprocess.run(["git", "clone", url, destination])

            # Set perform_checkout to True to initiate the checkout process
            perform_checkout = True
            bot_response = "Repository cloned successfully."
        except subprocess.CalledProcessError as e:
            bot_response = f"Error cloning repository: {e}"

        # Reset the global variables for the next interaction
        username = ""
        repository = ""
        destination = ""
        branch = ""
        project = ""

    if perform_checkout:
        try:
            # Checkout the specified branch
            subprocess.run(["git", "-C", destination, "checkout", branch])
            bot_response = "Repository cloned successfully and checked out to the selected branch."
        except subprocess.CalledProcessError as e:
            bot_response = f"Error checking out branch: {e}"

    return jsonify({'bot_response': bot_response})

def fetch_branches(project):
    repo_path = f"{destination}/{project}"
    process = subprocess.Popen(["git", "-C", repo_path, "branch", "--list", "--remote"], stdout=subprocess.PIPE)
    output, _ = process.communicate()
    branches = [branch.strip() for branch in output.decode().split("\n") if branch.strip()]
    return branches

if __name__ == '__main__':
    app.secret_key = 'your_secret_key'
    app.run()
