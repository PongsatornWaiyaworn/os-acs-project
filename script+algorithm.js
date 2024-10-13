
let processes = []; //ex. [{p1, 0, 5, 1}, {p2, 1, 8, 0}] >> {name, arrivalTime, burstTime, priority}
let result_FCFS = []; //ex. [{p1, 0, 5, 5, 5, 0}, {p2, 1, 8,13, 12, 4}] >> {name, arrivalTime, burstTime, completionTime, turnAroundTime, waitingTime}
let timeline_FCFS = []; //ex. [{p1, 0, 5}, {p2, 5, 13}] >> {name, start, end}
let efficiency_FCFS = {}; //ex. {CPUutilization: 100, Throughput: 0.15384615384615385, avgTurnAroundTime: 8.5, avgAroundTime: 2}
let result_RR = [];
let timeline_RR = []; //ex. [{p1, 0, 4}, {p2, 4, 8}, {p1, 8, 9}, {p2, 8, 12}] >> สมมุติ timequantum = 4
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
function addProcess() {
    let processName = document.getElementById("processName").value;
    let arrivalTime = parseInt(document.getElementById("arrivalTime").value);
    let burstTime = parseInt(document.getElementById("burstTime").value);
    let priority = parseInt(document.getElementById("priority").value);

    processes.push({ name: processName, arrivalTime: arrivalTime, burstTime: burstTime, priority: priority });
}
*/

function sorting(){
    // Sort processes โดยเรียงตาม arrival time จาก น้อย ไป มาก
    return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

function FCFS() {

    let copy_process = sorting();
    
    let currentTime = 0;

    copy_process.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let completionTime = startTime + process.burstTime;
        let turnAroundTime = completionTime - process.arrivalTime;
        let waitingTime = turnAroundTime - process.burstTime;
        
        result_FCFS.push({ name: process.name, completionTime: completionTime, turnAroundTime: turnAroundTime, waitingTime: waitingTime });
        timeline_FCFS.push({ name: process.name, start: startTime, end: completionTime });
        
        currentTime = completionTime;
    });
}
