
let processes = []; //ex. [{p1, 0, 5, 1}, {p2, 1, 8, 0}] >> {name, arrivalTime, burstTime, priority}
let result_FCFS = []; //ex. [{p1, 0, 5, 5, 5, 0}, {p2, 1, 8,13, 12, 4}] >> {name, arrivalTime, burstTime, completionTime, turnAroundTime, waitingTime}
let timeline_FCFS = []; //ex. [{p1, 0, 5}, {p2, 5, 13}] >> {name, start, end}
let efficiency_FCFS = {}; //ex. {CPUutilization: 100, Throughput: 0.15384615384615385, avgTurnAroundTime: 8.5, avgWaitingTime: 2}
let result_RR = [];
let timeline_RR = []; //ex. [{p1, 0, 4}, {p2, 4, 8}, {p1, 8, 9}, {p2, 8, 12}] >> สมมุติ timequantum = 4,  {name, start, end}
let efficiency_RR = {};
let result_SJF = [];
let timeline_SJF = [];
let efficiency_SJF = {};
let result_SRTF = [];
let timeline_SRTF = [];
let efficiency_SRTF = {};
let result_HRRN = [];
let timeline_HRRN = [];
let efficiency_HRRN = {};
let result_MQWF = [];
let timeline_MQWF = [];
let efficiency_MQWF = {};
let timequantum = 1;

// ตัวอย่างที่คิดว่าจะใช้กับข้อมูล 
/*

    processes.push({ name: processName, arrivalTime: arrivalTime, burstTime: burstTime, priority: priority });

*/

function sortArrivaltime(process){
    // Sort processes โดยเรียงตาม arrival time จากน้อยไปมาก
    return process.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

function sortPriority(process){
    // Sort processes โดยเรียงตาม priority จากน้อยไปมาก
    return process.sort((a, b) => a.priority - b.priority);
}

function CPUutilizationCal(timeline, EndCompletionTime){
    let CPUtime = 0;
    timeline.forEach(element => { CPUtime += (element.end - element.start); });
    return (CPUtime / EndCompletionTime) * 100 ;
}

function ThroughputCal(NumProcess, EndCompletionTime){
    return NumProcess / EndCompletionTime;
}

function avgTurnAroundTime(result){
    let sum = 0
    result.forEach( element => { sum += element.turnAroundTime } );
    return sum / result.length ;
}

function avgWaitingTime(result){
    let sum = 0
    result.forEach( element => { sum += element.waitingTime } );
    return sum / result.length ;
}

function FCFS() {
    let copy_process = sortArrivaltime(processes).slice();
    let currentTime = 0;
    let lastCompletionTime = 0;
 
    copy_process.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let completionTime = startTime + process.burstTime; 
        let turnAroundTime = completionTime - process.arrivalTime; 
        let waitingTime = turnAroundTime - process.burstTime; 
        
        result_FCFS.push({ 
            name: process.name, 
            completionTime: completionTime, 
            turnAroundTime: turnAroundTime, 
            waitingTime: waitingTime 
        });
        timeline_FCFS.push({ 
            name: process.name, 
            start: startTime, end: 
            completionTime 
        });
        
        currentTime = completionTime;
        lastCompletionTime = completionTime;
    });

    efficiency_FCFS = {CPUutilization: CPUutilizationCal(timeline_FCFS, lastCompletionTime), 
        Throughput: ThroughputCal(timeline_FCFS.length, lastCompletionTime), 
        avgTurnAroundTime: avgTurnAroundTime(result_FCFS), 
        avgWaitingTime: avgWaitingTime(result_FCFS)} ;
}

function RR() {
    let copy_process = sortArrivaltime(processes).slice();
    let queue = [];
    let currentTime = 0;
    let lastCompletionTime = 0;
    
    let remainingBurst = {};
    copy_process.forEach(process => {
        remainingBurst[process.name] = process.burstTime;
    });
    
    queue.push(...copy_process);
    
    while (queue.length > 0) {
            
        let currentProcess = queue.shift();
        let startTime = currentTime;
        let timeToExecute = Math.min(timequantum, remainingBurst[currentProcess.name]);
        currentTime += timeToExecute;
        remainingBurst[currentProcess.name] -= timeToExecute;
    
        timeline_RR.push({ name: currentProcess.name, start: startTime, end: currentTime });
    
        if (remainingBurst[currentProcess.name] === 0) {
            let completionTime = currentTime;
            let turnAroundTime = completionTime - currentProcess.arrivalTime;
            let waitingTime = turnAroundTime - currentProcess.burstTime;
    
            result_RR.push({
                name: currentProcess.name,
                arrivalTime: currentProcess.arrivalTime,
                burstTime: currentProcess.burstTime,
                completionTime: completionTime,
                turnAroundTime: turnAroundTime,
                waitingTime: waitingTime
            });
    
            lastCompletionTime = completionTime;
        }
    
        if (remainingBurst[currentProcess.name] > 0) {
            queue.push(currentProcess);
        }
    }
    
    efficiency_RR = {
        CPUutilization: CPUutilizationCal(timeline_RR, lastCompletionTime),
        Throughput: ThroughputCal(result_RR.length, lastCompletionTime),
        avgTurnAroundTime: avgTurnAroundTime(result_RR),
        avgWaitingTime: avgWaitingTime(result_RR)
    };
}

function MQWF() {
    let timeq = 4; 
    let queues = [];
    let uniquePriorities = new Set();

    processes.forEach(process => {
        uniquePriorities.add(process.priority);
    });

    let maxPriority = Math.max(...uniquePriorities);

    uniquePriorities.forEach(priority => {
        if (priority !== maxPriority) {
            queues.push({ priority: priority, quantum: timeq, processes: [] });
            timeq *= 2;
        } else {
            queues.push({ priority: priority, quantum: 0, processes: [] });
        }
    });

    queues.sort((a, b) => a.priority - b.priority);

    let currentTime = 0;
    let lastCompletionTime = 0;

    let copy_process = sortArrivaltime(processes).slice();
    copy_process.forEach(process => {
        let targetQueue = queues.find(queue => queue.priority === process.priority);
        if (targetQueue) {
            targetQueue.processes.push(process);
        }
    });

    let remainingBurst = {};
    copy_process.forEach(process => {
        remainingBurst[process.name] = process.burstTime;
    });

    while (queues.some(queue => queue.processes.length > 0)) {
        let foundProcess = false;

        for (let i = 0; i < queues.length; i++) {
            let queue = queues[i];

            if (queue.processes.length > 0) {
                foundProcess = true;
                let currentProcess = queue.processes.shift();
                let startTime = currentTime;

                let timeToExecute = queue.quantum > 0
                    ? Math.min(queue.quantum, remainingBurst[currentProcess.name])
                    : remainingBurst[currentProcess.name];

                currentTime += timeToExecute;
                remainingBurst[currentProcess.name] -= timeToExecute;

                timeline_MQWF.push({ name: currentProcess.name, start: startTime, end: currentTime });

                if (remainingBurst[currentProcess.name] === 0) {
                    let completionTime = currentTime;
                    let turnAroundTime = completionTime - currentProcess.arrivalTime;
                    let waitingTime = turnAroundTime - currentProcess.burstTime;

                    result_MQWF.push({
                        name: currentProcess.name,
                        arrivalTime: currentProcess.arrivalTime,
                        burstTime: currentProcess.burstTime,
                        completionTime: completionTime,
                        turnAroundTime: turnAroundTime,
                        waitingTime: waitingTime
                    });

                    lastCompletionTime = completionTime;
                } else {
                    if (i + 1 < queues.length) {
                        queues[i + 1].processes.push(currentProcess);
                    } else {
                        queues[i].processes.push(currentProcess);
                    }
                }

                break;
            }
        }

        if (!foundProcess) {
            currentTime = Math.max(currentTime, copy_process[0]?.arrivalTime || currentTime);
        }
    }

    efficiency_MQWF = {
        CPUutilization: CPUutilizationCal(timeline_MQWF, lastCompletionTime),
        Throughput: ThroughputCal(result_MQWF.length, lastCompletionTime),
        avgTurnAroundTime: avgTurnAroundTime(result_MQWF),
        avgWaitingTime: avgWaitingTime(result_MQWF)
    };
}