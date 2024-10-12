let processes = []; //ex. [{p1, 0, 5, 1}, {p2, 1, 8, 0}]
let result_FCFS = []; //ex. [{p1, 5, 5, 0}, {p2, 13, 12, 4}]
let result_RR = [];
let result_SJF = [];
let result_SRTF = [];
let result_HRRN = [];
let result_MQWF = [];
let timequantum = 1;

// ตัวอย่างที่คิดว่าจะใช้กับข้อมูล
function addProcess() {
    let processName = document.getElementById("processName").value;
    let arrivalTime = parseInt(document.getElementById("arrivalTime").value);
    let burstTime = parseInt(document.getElementById("burstTime").value);
    let priority = parseInt(document.getElementById("priority").value);

    processes.push({ name: processName, arrivalTime: arrivalTime, burstTime: burstTime, priority: priority });
}

//-----------------------------------------

function sortting(){
    // Sort processes โดยเรียงตาม arrival time จาก น้อย ไป มาก
    return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

function FCFS() {

    let copy_process = sortting();
    
    let currentTime = 0;

    copy_process.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let completionTime = startTime + process.burstTime;
        let turnAroundTime = completionTime - process.arrivalTime;
        let waitingTime = turnAroundTime - process.burstTime;
        
        result_FCFS.push({ name: process.name, completionTime: completionTime, turnAroundTime: turnAroundTime, waitingTime: waitingTime });

        currentTime = completionTime;
    }); 
}
