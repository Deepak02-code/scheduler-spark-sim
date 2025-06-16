
# Process Scheduler Simulator

A BCA student project that simulates CPU scheduling algorithms like First Come First Serve (FCFS) and Shortest Job First (SJF).

## Project Overview

This project simulates CPU scheduling algorithms through a user-friendly web interface. It's designed as a learning tool for understanding how different scheduling algorithms work in operating systems.

## Features

- Input process details (arrival time, burst time)
- Choose between different scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin
  - Priority scheduling 
- View results in a table format
- Visual Gantt chart representation
- Calculate key metrics: turnaround time, waiting time

## Project Structure

- `index.html` - The main HTML file for the web interface
- `styles.css` - CSS styles for the web interface
- `script.js` - Frontend JavaScript code for the web interface
- `scheduler.py` - Python backend implementation of scheduling algorithms
- `server.py` - Flask server to integrate Python backend with web frontend

## How to Run

### Frontend Only (HTML/CSS/JS)
1. Open `index.html` in any modern web browser
2. Use the interface to input process details and see results

### With Python Backend
1. Install required Python packages:
   ```
   pip install flask flask-cors
   ```
2. Run the Flask server:
   ```
   python server.py
   ```
3. Open `index.html` in a web browser

## Understanding the Code

### Frontend (HTML/CSS/JS)
- The interface allows inputting process details and choosing algorithms
- JavaScript functions handle the user interface and calculations
- Results are displayed in both table and Gantt chart formats

### Backend (Python)
- `scheduler.py` contains the implementations of scheduling algorithms
- Each algorithm is implemented as a separate function
- The code includes detailed comments to aid understanding

## Future Enhancements
- Implement preemptive versions of algorithms
- Add visualization improvements
- Support process priorities and other attributes

## Author
3 MUSKETEERS 
Anjali (group leader)
Deepak (group coder)
Suhani (group helper)

## Acknowledgements
This project was created as a part of the BCA program curriculum to understand Operating System concepts.
