// Global variables
let processData = [];
const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'];

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    // Add event listeners
    document.getElementById('generateTable').addEventListener('click', function() {
        console.log("Generate Table button clicked");
        generateProcessTable();
    });
    document.getElementById('calculateBtn').addEventListener('click', calculateScheduling);
    document.getElementById('algorithm').addEventListener('change', function() {
        updateAlgorithmDescription();
        toggleAlgorithmSpecificFields();
    });
    
    // Initialize with default values
    generateProcessTable();
});

// Toggle algorithm-specific fields
function toggleAlgorithmSpecificFields() {
    const algorithm = document.getElementById('algorithm').value;
    
    // Show/hide time quantum for Round Robin
    const timeQuantumSection = document.getElementById('timeQuantumSection');
    if (algorithm === 'rr') {
        timeQuantumSection.style.display = 'block';
    } else {
        timeQuantumSection.style.display = 'none';
    }
    
    // Show/hide priority column
    const priorityHeader = document.getElementById('priorityHeader');
    const resultsPriorityHeader = document.getElementById('resultsPriorityHeader');
    if (algorithm === 'priority') {
        priorityHeader.style.display = 'table-cell';
        resultsPriorityHeader.style.display = 'table-cell';
    } else {
        priorityHeader.style.display = 'none';
        resultsPriorityHeader.style.display = 'none';
    }
    
    // Regenerate table to include/exclude priority column
    generateProcessTable();
}

// Update algorithm description when selection changes
function updateAlgorithmDescription() {
    const algorithm = document.getElementById('algorithm').value;
    let description = '';
    
    if(algorithm === 'fcfs') {
        description = `
            <h5>First Come First Serve (FCFS)</h5>
            <p>The simplest scheduling algorithm that schedules processes in the order they arrive in the ready queue. It is non-preemptive.</p>
            <ul>
                <li>Processes are executed in the order they arrive</li>
                <li>Easy to understand and implement</li>
                <li>Poor in performance as average wait time can be high</li>
            </ul>
        `;
    } else if(algorithm === 'sjf') {
        description = `
            <h5>Shortest Job First (SJF)</h5>
            <p>A scheduling algorithm that selects the process with the smallest burst time to execute next. It is non-preemptive in this implementation.</p>
            <ul>
                <li>Processes are executed based on burst time, from shortest to longest</li>
                <li>Provides minimum average waiting time among all algorithms</li>
                <li>Starvation possible for processes with longer burst times</li>
            </ul>
        `;
    } else if(algorithm === 'rr') {
        description = `
            <h5>Round Robin (RR)</h5>
            <p>A preemptive scheduling algorithm where each process gets a fixed time slice (time quantum) to execute.</p>
            <ul>
                <li>Each process gets equal priority and fair share of CPU time</li>
                <li>Good response time for interactive systems</li>
                <li>Performance depends heavily on the time quantum value</li>
            </ul>
        `;
    } else if(algorithm === 'priority') {
        description = `
            <h5>Priority Scheduling</h5>
            <p>A scheduling algorithm that assigns priority to each process. Process with highest priority (lowest number) is executed first.</p>
            <ul>
                <li>Processes are executed based on their priority values</li>
                <li>Lower priority number indicates higher priority</li>
                <li>Starvation possible for low priority processes</li>
            </ul>
        `;
    }
    
    document.getElementById('algorithmDescription').innerHTML = description;
}

// Generate the process input table
function generateProcessTable() {
    console.log("Generating process table");
    const count = parseInt(document.getElementById('processCount').value) || 3;
    const algorithm = document.getElementById('algorithm').value;
    const tbody = document.getElementById('processTable').getElementsByTagName('tbody')[0];
    
    console.log("Process count:", count);
    console.log("Table body element:", tbody);
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const row = tbody.insertRow();
        
        // Process ID cell
        const cell1 = row.insertCell(0);
        cell1.textContent = `P${i+1}`;
        
        // Arrival time input cell
        const cell2 = row.insertCell(1);
        const arrivalInput = document.createElement('input');
        arrivalInput.type = 'number';
        arrivalInput.className = 'form-control arrival-time';
        arrivalInput.min = '0';
        arrivalInput.value = i;
        cell2.appendChild(arrivalInput);
        
        // Burst time input cell
        const cell3 = row.insertCell(2);
        const burstInput = document.createElement('input');
        burstInput.type = 'number';
        burstInput.className = 'form-control burst-time';
        burstInput.min = '1';
        burstInput.value = Math.floor(Math.random() * 10) + 1;
        cell3.appendChild(burstInput);
        
        // Priority input cell (only for priority scheduling)
        if (algorithm === 'priority') {
            const cell4 = row.insertCell(3);
            const priorityInput = document.createElement('input');
            priorityInput.type = 'number';
            priorityInput.className = 'form-control priority';
            priorityInput.min = '1';
            priorityInput.value = Math.floor(Math.random() * 5) + 1;
            cell4.appendChild(priorityInput);
        }
    }
    
    console.log("Table generation complete");
}

// Collect data from the process table
function getProcessData() {
    const table = document.getElementById('processTable');
    const rows = table.getElementsByTagName('tbody')[0].rows;
    const algorithm = document.getElementById('algorithm').value;
    const processes = [];
    
    for (let i = 0; i < rows.length; i++) {
        const pid = rows[i].cells[0].textContent;
        const arrivalTime = parseInt(rows[i].querySelector('.arrival-time').value);
        const burstTime = parseInt(rows[i].querySelector('.burst-time').value);
        
        const process = {
            pid: pid,
            arrival: arrivalTime,
            burst: burstTime
        };
        
        // Add priority for priority scheduling
        if (algorithm === 'priority') {
            const priority = parseInt(rows[i].querySelector('.priority').value);
            process.priority = priority;
        }
        
        processes.push(process);
    }
    
    return processes;
}

// Calculate scheduling based on selected algorithm
function calculateScheduling() {
    // Collect process data
    processData = getProcessData();
    
    // Get selected algorithm
    const algorithm = document.getElementById('algorithm').value;
    
    // Check if we have valid process data
    if (processData.length === 0) {
        alert('Please add at least one process.');
        return;
    }
    
    // Choose algorithm to run
    let results;
    if (algorithm === 'fcfs') {
        results = fcfsScheduling(processData);
    } else if (algorithm === 'sjf') {
        results = sjfScheduling(processData);
    } else if (algorithm === 'rr') {
        const timeQuantum = parseInt(document.getElementById('timeQuantum').value) || 2;
        results = roundRobinScheduling(processData, timeQuantum);
    } else if (algorithm === 'priority') {
        results = priorityScheduling(processData);
    }
    
    // Display results
    displayResults(results);
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// First Come First Serve Scheduling Algorithm
function fcfsScheduling(processes) {
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrival - b.arrival);
    
    // Initialize variables
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    const timeline = [];
    const results = [];
    
    // Process each job
    for (const process of processes) {
        // Update current time if needed (if there's a gap)
        if (process.arrival > currentTime) {
            currentTime = process.arrival;
        }
        
        // Calculate completion time
        const startTime = currentTime;
        const completionTime = currentTime + process.burst;
        
        // Calculate turnaround time (completion time - arrival time)
        const turnaroundTime = completionTime - process.arrival;
        
        // Calculate waiting time (turnaround time - burst time)
        const waitingTime = turnaroundTime - process.burst;
        
        // Add to total
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        
        // Add to results
        const result = {
            pid: process.pid,
            arrival: process.arrival,
            burst: process.burst,
            completion: completionTime,
            turnaround: turnaroundTime,
            waiting: waitingTime
        };
        
        if (process.priority !== undefined) {
            result.priority = process.priority;
        }
        
        results.push(result);
        
        // Add to timeline for Gantt chart
        timeline.push({
            pid: process.pid,
            start: startTime,
            end: completionTime
        });
        
        // Update current time
        currentTime = completionTime;
    }
    
    // Calculate averages
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgWaitingTime = totalWaitingTime / processes.length;
    
    return {
        processes: results,
        timeline: timeline,
        avgTAT: avgTurnaroundTime.toFixed(2),
        avgWT: avgWaitingTime.toFixed(2)
    };
}

// Shortest Job First Scheduling Algorithm (Non-preemptive)
function sjfScheduling(processes) {
    // Create a copy of processes for manipulation
    const processQueue = [...processes];
    
    // Initialize variables
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    const timeline = [];
    const results = [];
    const completed = [];
    
    // Continue until all processes are processed
    while (processQueue.length > 0) {
        // Find processes that have arrived
        const availableProcesses = processQueue.filter(p => p.arrival <= currentTime);
        
        if (availableProcesses.length === 0) {
            // No process available, advance time to next arrival
            const nextArrival = Math.min(...processQueue.map(p => p.arrival));
            currentTime = nextArrival;
            continue;
        }
        
        // Find the shortest job among the available ones
        availableProcesses.sort((a, b) => a.burst - b.burst);
        const shortestJob = availableProcesses[0];
        
        // Remove from process queue
        const index = processQueue.findIndex(p => p.pid === shortestJob.pid);
        processQueue.splice(index, 1);
        
        // Calculate times
        const startTime = currentTime;
        const completionTime = currentTime + shortestJob.burst;
        const turnaroundTime = completionTime - shortestJob.arrival;
        const waitingTime = turnaroundTime - shortestJob.burst;
        
        // Add to total
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        
        // Add to results
        const result = {
            pid: shortestJob.pid,
            arrival: shortestJob.arrival,
            burst: shortestJob.burst,
            completion: completionTime,
            turnaround: turnaroundTime,
            waiting: waitingTime
        };
        
        if (shortestJob.priority !== undefined) {
            result.priority = shortestJob.priority;
        }
        
        results.push(result);
        
        // Add to timeline for Gantt chart
        timeline.push({
            pid: shortestJob.pid,
            start: startTime,
            end: completionTime
        });
        
        // Update current time
        currentTime = completionTime;
        
        // Add to completed list
        completed.push(shortestJob);
    }
    
    // Calculate averages
    const avgTurnaroundTime = totalTurnaroundTime / completed.length;
    const avgWaitingTime = totalWaitingTime / completed.length;
    
    return {
        processes: results,
        timeline: timeline,
        avgTAT: avgTurnaroundTime.toFixed(2),
        avgWT: avgWaitingTime.toFixed(2)
    };
}

// Round Robin Scheduling Algorithm
function roundRobinScheduling(processes, timeQuantum) {
    // Create process queue with remaining burst times
    const processQueue = [];
    for (const p of processes) {
        processQueue.push({
            pid: p.pid,
            arrival: p.arrival,
            burst: p.burst,
            remaining: p.burst,
            priority: p.priority
        });
    }
    
    // Sort by arrival time
    processQueue.sort((a, b) => a.arrival - b.arrival);
    
    let currentTime = 0;
    const timeline = [];
    const readyQueue = [];
    const completed = [];
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    
    let i = 0; // Index for processQueue
    
    while (readyQueue.length > 0 || i < processQueue.length) {
        // Add all processes that have arrived to ready queue
        while (i < processQueue.length && processQueue[i].arrival <= currentTime) {
            readyQueue.push(processQueue[i]);
            i++;
        }
        
        if (readyQueue.length === 0) {
            // No process in ready queue, jump to next arrival
            if (i < processQueue.length) {
                currentTime = processQueue[i].arrival;
            }
            continue;
        }
        
        // Get the first process from ready queue
        const currentProcess = readyQueue.shift();
        
        // Execute for time quantum or remaining time
        const executionTime = Math.min(timeQuantum, currentProcess.remaining);
        const startTime = currentTime;
        currentTime += executionTime;
        currentProcess.remaining -= executionTime;
        
        // Add to timeline
        timeline.push({
            pid: currentProcess.pid,
            start: startTime,
            end: currentTime
        });
        
        // Add newly arrived processes to ready queue
        while (i < processQueue.length && processQueue[i].arrival <= currentTime) {
            readyQueue.push(processQueue[i]);
            i++;
        }
        
        // Check if process is completed
        if (currentProcess.remaining === 0) {
            // Process completed
            const completionTime = currentTime;
            const turnaroundTime = completionTime - currentProcess.arrival;
            const waitingTime = turnaroundTime - currentProcess.burst;
            
            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;
            
            const result = {
                pid: currentProcess.pid,
                arrival: currentProcess.arrival,
                burst: currentProcess.burst,
                priority: currentProcess.priority,
                completion: completionTime,
                turnaround: turnaroundTime,
                waiting: waitingTime
            };
            
            if (currentProcess.priority !== undefined) {
                result.priority = currentProcess.priority;
            }
            
            completed.push(result);
        } else {
            // Process not completed, add back to ready queue
            readyQueue.push(currentProcess);
        }
    }
    
    // Calculate averages
    const avgTurnaroundTime = totalTurnaroundTime / completed.length;
    const avgWaitingTime = totalWaitingTime / completed.length;
    
    return {
        processes: completed,
        timeline: timeline,
        avgTAT: avgTurnaroundTime.toFixed(2),
        avgWT: avgWaitingTime.toFixed(2)
    };
}

// Priority Scheduling Algorithm
function priorityScheduling(processes) {
    // Create a copy of processes for manipulation
    const processQueue = [...processes];
    
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    const timeline = [];
    const results = [];
    const completed = [];
    
    // Continue until all processes are processed
    while (processQueue.length > 0) {
        // Find processes that have arrived
        const availableProcesses = processQueue.filter(p => p.arrival <= currentTime);
        
        if (availableProcesses.length === 0) {
            // No process available, advance time to next arrival
            const nextArrival = Math.min(...processQueue.map(p => p.arrival));
            currentTime = nextArrival;
            continue;
        }
        
        // Find the highest priority process (lowest priority number)
        availableProcesses.sort((a, b) => a.priority - b.priority);
        const highestPriority = availableProcesses[0];
        
        // Remove from process queue
        const index = processQueue.findIndex(p => p.pid === highestPriority.pid);
        processQueue.splice(index, 1);
        
        // Calculate times
        const startTime = currentTime;
        const completionTime = currentTime + highestPriority.burst;
        const turnaroundTime = completionTime - highestPriority.arrival;
        const waitingTime = turnaroundTime - highestPriority.burst;
        
        // Add to total
        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += waitingTime;
        
        // Add to results
        results.push({
            pid: highestPriority.pid,
            arrival: highestPriority.arrival,
            burst: highestPriority.burst,
            priority: highestPriority.priority,
            completion: completionTime,
            turnaround: turnaroundTime,
            waiting: waitingTime
        });
        
        // Add to timeline for Gantt chart
        timeline.push({
            pid: highestPriority.pid,
            start: startTime,
            end: completionTime
        });
        
        // Update current time
        currentTime = completionTime;
        
        // Add to completed list
        completed.push(highestPriority);
    }
    
    // Calculate averages
    const avgTurnaroundTime = totalTurnaroundTime / completed.length;
    const avgWaitingTime = totalWaitingTime / completed.length;
    
    return {
        processes: results,
        timeline: timeline,
        avgTAT: avgTurnaroundTime.toFixed(2),
        avgWT: avgWaitingTime.toFixed(2)
    };
}

// Display the results in the UI
function displayResults(results) {
    // Fill the results table
    const tbody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const algorithm = document.getElementById('algorithm').value;
    tbody.innerHTML = '';
    
    for (const process of results.processes) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = process.pid;
        row.insertCell(1).textContent = process.arrival;
        row.insertCell(2).textContent = process.burst;
        
        // Add priority column if it's priority scheduling
        if (algorithm === 'priority') {
            row.insertCell(3).textContent = process.priority;
            row.insertCell(4).textContent = process.completion;
            row.insertCell(5).textContent = process.turnaround;
            row.insertCell(6).textContent = process.waiting;
        } else {
            row.insertCell(3).textContent = process.completion;
            row.insertCell(4).textContent = process.turnaround;
            row.insertCell(5).textContent = process.waiting;
        }
    }
    
    // Display average times
    document.getElementById('avgTAT').textContent = results.avgTAT;
    document.getElementById('avgWT').textContent = results.avgWT;
    
    // Draw Gantt chart
    drawGanttChart(results.timeline);
}

// Draw the Gantt chart
function drawGanttChart(timeline) {
    const ganttDiv = document.getElementById('ganttChart');
    ganttDiv.innerHTML = '';
    
    // Find the maximum time to scale the chart
    const maxTime = Math.max(...timeline.map(item => item.end));
    
    // Create Gantt blocks
    for (let i = 0; i < timeline.length; i++) {
        const block = document.createElement('div');
        block.className = 'gantt-block';
        
        // Calculate width based on duration
        const duration = timeline[i].end - timeline[i].start;
        const widthPercentage = (duration / maxTime) * 100;
        block.style.width = Math.max(widthPercentage * 5, 30) + 'px'; // Minimum width for visibility
        
        // Assign color and content
        const colorIndex = parseInt(timeline[i].pid.replace('P', '')) % colors.length;
        block.style.backgroundColor = colors[colorIndex];
        block.innerHTML = timeline[i].pid;
        
        // Add time labels
        const startLabel = document.createElement('div');
        startLabel.className = 'gantt-label';
        startLabel.textContent = timeline[i].start;
        block.appendChild(startLabel);
        
        // Add end time label to the last block
        if (i === timeline.length - 1) {
            const endBlock = document.createElement('div');
            endBlock.className = 'gantt-block';
            endBlock.style.width = '5px';
            endBlock.style.backgroundColor = 'transparent';
            
            const endLabel = document.createElement('div');
            endLabel.className = 'gantt-label';
            endLabel.textContent = timeline[i].end;
            endBlock.appendChild(endLabel);
            
            ganttDiv.appendChild(block);
            ganttDiv.appendChild(endBlock);
        } else {
            ganttDiv.appendChild(block);
        }
    }
}
