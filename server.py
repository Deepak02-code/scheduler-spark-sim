
"""
Process Scheduler Simulator API Server
-------------------------------------
This Flask server provides API endpoints to calculate process scheduling results
using different algorithms implemented in scheduler.py.

To run:
1. Install Flask: pip install flask flask-cors
2. Run: python server.py
3. Access the frontend from the browser
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import scheduler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Process Scheduler API Server is running!"

@app.route('/calculate', methods=['POST'])
def calculate():
    # Get data from request
    data = request.json
    processes = data.get('processes', [])
    algorithm = data.get('algorithm', 'fcfs')
    time_quantum = data.get('time_quantum', 2)
    
    # Validate input
    if not processes:
        return jsonify({'error': 'No processes provided'}), 400
    
    # Run appropriate scheduling algorithm
    try:
        if algorithm == 'fcfs':
            result = scheduler.first_come_first_serve(processes)
        elif algorithm == 'sjf':
            result = scheduler.shortest_job_first(processes)
        elif algorithm == 'rr':
            result = scheduler.round_robin(processes, time_quantum)
        elif algorithm == 'priority':
            result = scheduler.priority_scheduling(processes)
        else:
            return jsonify({'error': f'Algorithm {algorithm} not implemented yet'}), 400
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Only run the server if this script is run directly
if __name__ == '__main__':
    app.run(debug=True, port=5000)
    print("Server is running at http://localhost:5000")
