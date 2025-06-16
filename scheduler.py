
"""
Process Scheduler Simulator Backend
-----------------------------------
This Python file contains the implementation of various CPU scheduling algorithms 
for the Process Scheduler Simulator project.

Author: 3 MUSKETEERS
"""

def first_come_first_serve(processes):
    """
    First Come First Serve (FCFS) scheduling algorithm.
    
    Args:
        processes: List of dictionaries containing process details with keys:
                  'pid', 'arrival', 'burst'
    
    Returns:
        Dictionary containing results of scheduling
    """
    # Sort processes by arrival time
    sorted_processes = sorted(processes, key=lambda x: x['arrival'])
    
    current_time = 0
    total_turnaround_time = 0
    total_waiting_time = 0
    timeline = []
    results = []
    
    # Process each job
    for process in sorted_processes:
        # Update current time if needed (if there's a gap)
        if process['arrival'] > current_time:
            current_time = process['arrival']
        
        # Calculate times
        start_time = current_time
        completion_time = current_time + process['burst']
        turnaround_time = completion_time - process['arrival']
        waiting_time = turnaround_time - process['burst']
        
        # Add to totals
        total_turnaround_time += turnaround_time
        total_waiting_time += waiting_time
        
        # Add to results
        results.append({
            'pid': process['pid'],
            'arrival': process['arrival'],
            'burst': process['burst'],
            'completion': completion_time,
            'turnaround': turnaround_time,
            'waiting': waiting_time
        })
        
        # Add to timeline for Gantt chart
        timeline.append({
            'pid': process['pid'],
            'start': start_time,
            'end': completion_time
        })
        
        # Update current time
        current_time = completion_time
    
    # Calculate averages
    avg_turnaround_time = total_turnaround_time / len(processes)
    avg_waiting_time = total_waiting_time / len(processes)
    
    return {
        'processes': results,
        'timeline': timeline,
        'avg_tat': round(avg_turnaround_time, 2),
        'avg_wt': round(avg_waiting_time, 2)
    }

def shortest_job_first(processes):
    """
    Shortest Job First (SJF) scheduling algorithm (non-preemptive).
    
    Args:
        processes: List of dictionaries containing process details with keys:
                  'pid', 'arrival', 'burst'
    
    Returns:
        Dictionary containing results of scheduling
    """
    # Create a copy of processes for manipulation
    process_queue = processes.copy()
    
    current_time = 0
    total_turnaround_time = 0
    total_waiting_time = 0
    timeline = []
    results = []
    completed = []
    
    # Continue until all processes are processed
    while process_queue:
        # Find processes that have arrived
        available_processes = [p for p in process_queue if p['arrival'] <= current_time]
        
        if not available_processes:
            # No process available, advance time to next arrival
            next_arrival = min([p['arrival'] for p in process_queue])
            current_time = next_arrival
            continue
        
        # Find the shortest job among the available ones
        shortest_job = min(available_processes, key=lambda x: x['burst'])
        
        # Remove from process queue
        process_queue.remove(shortest_job)
        
        # Calculate times
        start_time = current_time
        completion_time = current_time + shortest_job['burst']
        turnaround_time = completion_time - shortest_job['arrival']
        waiting_time = turnaround_time - shortest_job['burst']
        
        # Add to totals
        total_turnaround_time += turnaround_time
        total_waiting_time += waiting_time
        
        # Add to results
        results.append({
            'pid': shortest_job['pid'],
            'arrival': shortest_job['arrival'],
            'burst': shortest_job['burst'],
            'completion': completion_time,
            'turnaround': turnaround_time,
            'waiting': waiting_time
        })
        
        # Add to timeline for Gantt chart
        timeline.append({
            'pid': shortest_job['pid'],
            'start': start_time,
            'end': completion_time
        })
        
        # Update current time
        current_time = completion_time
        
        # Add to completed list
        completed.append(shortest_job)
    
    # Calculate averages
    avg_turnaround_time = total_turnaround_time / len(completed)
    avg_waiting_time = total_waiting_time / len(completed)
    
    return {
        'processes': results,
        'timeline': timeline,
        'avg_tat': round(avg_turnaround_time, 2),
        'avg_wt': round(avg_waiting_time, 2)
    }

def round_robin(processes, time_quantum=2):
    """
    Round Robin scheduling algorithm.
    
    Args:
        processes: List of dictionaries containing process details with keys:
                  'pid', 'arrival', 'burst'
        time_quantum: Time slice for each process
    
    Returns:
        Dictionary containing results of scheduling
    """
    # Create process queue with remaining burst times
    process_queue = []
    for p in processes:
        process_queue.append({
            'pid': p['pid'],
            'arrival': p['arrival'],
            'burst': p['burst'],
            'remaining': p['burst']
        })
    
    # Sort by arrival time
    process_queue.sort(key=lambda x: x['arrival'])
    
    current_time = 0
    timeline = []
    ready_queue = []
    completed = []
    total_turnaround_time = 0
    total_waiting_time = 0
    
    i = 0  # Index for process_queue
    
    while ready_queue or i < len(process_queue):
        # Add all processes that have arrived to ready queue
        while i < len(process_queue) and process_queue[i]['arrival'] <= current_time:
            ready_queue.append(process_queue[i])
            i += 1
        
        if not ready_queue:
            # No process in ready queue, jump to next arrival
            if i < len(process_queue):
                current_time = process_queue[i]['arrival']
            continue
        
        # Get the first process from ready queue
        current_process = ready_queue.pop(0)
        
        # Execute for time quantum or remaining time
        execution_time = min(time_quantum, current_process['remaining'])
        start_time = current_time
        current_time += execution_time
        current_process['remaining'] -= execution_time
        
        # Add to timeline
        timeline.append({
            'pid': current_process['pid'],
            'start': start_time,
            'end': current_time
        })
        
        # Add newly arrived processes to ready queue
        while i < len(process_queue) and process_queue[i]['arrival'] <= current_time:
            ready_queue.append(process_queue[i])
            i += 1
        
        # Check if process is completed
        if current_process['remaining'] == 0:
            # Process completed
            completion_time = current_time
            turnaround_time = completion_time - current_process['arrival']
            waiting_time = turnaround_time - current_process['burst']
            
            total_turnaround_time += turnaround_time
            total_waiting_time += waiting_time
            
            completed.append({
                'pid': current_process['pid'],
                'arrival': current_process['arrival'],
                'burst': current_process['burst'],
                'completion': completion_time,
                'turnaround': turnaround_time,
                'waiting': waiting_time
            })
        else:
            # Process not completed, add back to ready queue
            ready_queue.append(current_process)
    
    # Calculate averages
    avg_turnaround_time = total_turnaround_time / len(completed)
    avg_waiting_time = total_waiting_time / len(completed)
    
    return {
        'processes': completed,
        'timeline': timeline,
        'avg_tat': round(avg_turnaround_time, 2),
        'avg_wt': round(avg_waiting_time, 2)
    }

def priority_scheduling(processes):
    """
    Priority scheduling algorithm (non-preemptive).
    Assumes lower priority number = higher priority.
    
    Args:
        processes: List of dictionaries containing process details with keys:
                  'pid', 'arrival', 'burst', 'priority'
    
    Returns:
        Dictionary containing results of scheduling
    """
    # Create a copy of processes for manipulation
    process_queue = processes.copy()
    
    current_time = 0
    total_turnaround_time = 0
    total_waiting_time = 0
    timeline = []
    results = []
    completed = []
    
    # Continue until all processes are processed
    while process_queue:
        # Find processes that have arrived
        available_processes = [p for p in process_queue if p['arrival'] <= current_time]
        
        if not available_processes:
            # No process available, advance time to next arrival
            next_arrival = min([p['arrival'] for p in process_queue])
            current_time = next_arrival
            continue
        
        # Find the highest priority process (lowest priority number)
        highest_priority = min(available_processes, key=lambda x: x['priority'])
        
        # Remove from process queue
        process_queue.remove(highest_priority)
        
        # Calculate times
        start_time = current_time
        completion_time = current_time + highest_priority['burst']
        turnaround_time = completion_time - highest_priority['arrival']
        waiting_time = turnaround_time - highest_priority['burst']
        
        # Add to totals
        total_turnaround_time += turnaround_time
        total_waiting_time += waiting_time
        
        # Add to results
        results.append({
            'pid': highest_priority['pid'],
            'arrival': highest_priority['arrival'],
            'burst': highest_priority['burst'],
            'priority': highest_priority['priority'],
            'completion': completion_time,
            'turnaround': turnaround_time,
            'waiting': waiting_time
        })
        
        # Add to timeline for Gantt chart
        timeline.append({
            'pid': highest_priority['pid'],
            'start': start_time,
            'end': completion_time
        })
        
        # Update current time
        current_time = completion_time
        
        # Add to completed list
        completed.append(highest_priority)
    
    # Calculate averages
    avg_turnaround_time = total_turnaround_time / len(completed)
    avg_waiting_time = total_waiting_time / len(completed)
    
    return {
        'processes': results,
        'timeline': timeline,
        'avg_tat': round(avg_turnaround_time, 2),
        'avg_wt': round(avg_waiting_time, 2)
    }

# Simple example usage
if __name__ == "__main__":
    # Example processes
    test_processes = [
        {'pid': 'P1', 'arrival': 0, 'burst': 6},
        {'pid': 'P2', 'arrival': 1, 'burst': 4},
        {'pid': 'P3', 'arrival': 2, 'burst': 2}
    ]
    
    # Example processes with priority
    test_processes_priority = [
        {'pid': 'P1', 'arrival': 0, 'burst': 6, 'priority': 2},
        {'pid': 'P2', 'arrival': 1, 'burst': 4, 'priority': 1},
        {'pid': 'P3', 'arrival': 2, 'burst': 2, 'priority': 3}
    ]
    
    print("FCFS Scheduling:")
    fcfs_result = first_come_first_serve(test_processes)
    for p in fcfs_result['processes']:
        print(f"Process {p['pid']}: Completion Time={p['completion']}, Turnaround Time={p['turnaround']}, Waiting Time={p['waiting']}")
    print(f"Average Turnaround Time: {fcfs_result['avg_tat']}")
    print(f"Average Waiting Time: {fcfs_result['avg_wt']}")
    
    print("\nSJF Scheduling:")
    sjf_result = shortest_job_first(test_processes)
    for p in sjf_result['processes']:
        print(f"Process {p['pid']}: Completion Time={p['completion']}, Turnaround Time={p['turnaround']}, Waiting Time={p['waiting']}")
    print(f"Average Turnaround Time: {sjf_result['avg_tat']}")
    print(f"Average Waiting Time: {sjf_result['avg_wt']}")
    
    print("\nRound Robin Scheduling:")
    rr_result = round_robin(test_processes, 2)
    for p in rr_result['processes']:
        print(f"Process {p['pid']}: Completion Time={p['completion']}, Turnaround Time={p['turnaround']}, Waiting Time={p['waiting']}")
    print(f"Average Turnaround Time: {rr_result['avg_tat']}")
    print(f"Average Waiting Time: {rr_result['avg_wt']}")
    
    print("\nPriority Scheduling:")
    priority_result = priority_scheduling(test_processes_priority)
    for p in priority_result['processes']:
        print(f"Process {p['pid']}: Completion Time={p['completion']}, Turnaround Time={p['turnaround']}, Waiting Time={p['waiting']}")
    print(f"Average Turnaround Time: {priority_result['avg_tat']}")
    print(f"Average Waiting Time: {priority_result['avg_wt']}")
