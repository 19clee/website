import subprocess
import os

# Define the directory and command
directory = r'C:\Users\andre\OneDrive\Desktop\website logger'
command = ['node', 'ip_logger.js']

# Function to open CMD and run the command
def run_command():
    try:
        # Change the working directory
        os.chdir(directory)
        
        # Open CMD and run the command
        process = subprocess.Popen(command, cwd=directory)
        process.wait()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_command()
