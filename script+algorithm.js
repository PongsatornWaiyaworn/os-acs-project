let processes = []; //ex. [{p1, 0, 5, 1}, {p2, 1, 8, 0}] >> {name, arrivalTime, burstTime, priority}
let result_FCFS = []; //ex. [{p1, 0, 5, 5, 5, 0}, {p2, 1, 8,13, 12, 4}] >> {name, arrivalTime, burstTime, completionTime, turnAroundTime, waitingTime}
let timeline_FCFS = []; //ex. [{p1, 0, 5}, {p2, 5, 13}] >> {name, start, end}
let efficiency_FCFS = {}; //ex. {CPUutilization: 100, Throughput: 0.15384615384615385, avgTurnAroundTime: 8.5, avgWaitingTime: 2}
let result_RR = [];
let timeline_RR = []; //ex. [{p1, 0, 4}, {p2, 4, 8}, {p1, 8, 9}, {p2, 8, 12}] >> สมมุติ quantumtime = 4,  {name, start, end}
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
let result_P = [];
let timeline_P = [];
let efficiency_P = {};
let quantumtime = Number(document.querySelector('#quantum-time').value);
let contextSwitch = Number(document.querySelector("#switch-time").value);
let tbody = document.getElementById('process-table-body'); 
let countAddProcess = 2; 

/*--------------------------------------------------ส่วนinput--------------------------------------------------*/

function deleteProcess(element) {
    const row = element.closest('tr');
    if (row) {
        row.remove();
    }
}

function addProcess() {
    const processId = `P${countAddProcess}`;
    const row = document.createElement('tr');
    row.innerHTML = `
    <td class="process-id">${processId}</td>
    <td class="arrival-time"><input type="number" min="0" step="1" value="0"></td>
    <td class="burst-time"><input type="number" min="1" step="1" value="1"></td>
    <td class="priority"><input type="number" min="1" step="1" value="1"></td>
    <td class="delete-process"><a class="material-symbols-outlined" onclick="deleteProcess(this)">delete</a></td>
    `;
    countAddProcess++;
    tbody.appendChild(row);
}

function resetProcess() {
    tbody.innerHTML = `
    <td class="process-id">p1</td>
    <td class="arrival-time"><input type="number" min="0" step="1" value="0"></td>
    <td class="burst-time"><input type="number" min="1" step="1" value="1"></td>
    <td class="priority"><input type="number" min="1" step="1" value="1"></td>
    <td class="delete-process"></td>
    `;
    countAddProcess = 2;
};

function randomProcess() {
    const numRandom = Number(document.querySelector('.head-input input').value);
    let arrival, burst, priority, processId;
    
    for(let i = 0; i < numRandom; i++) {
        arrival = Math.floor(Math.random() * Math.floor(numRandom * 1.5));
        burst = Math.floor(Math.random() * 50) + 1;
        priority = Math.floor(Math.random() * 5) + 1;
        processId = `P${countAddProcess}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
        <td class="process-id">${processId}</td>
        <td class="arrival-time"><input type="number" min="0" step="1" value="${arrival}"></td>
        <td class="burst-time"><input type="number" min="1" step="1" value="${burst}"></td>
        <td class="priority"><input type="number" min="1" step="1" value="${priority}"></td>
        <td class="delete-process"><a class="material-symbols-outlined" onclick="deleteProcess(this)">delete</a></td>
        `;
        
        tbody.appendChild(row); 
        countAddProcess++;
    }
}

function calculate() {
    const names = document.querySelectorAll('tbody .process-id');
    const arrivals = document.querySelectorAll('tbody .arrival-time input');
    const bursts = document.querySelectorAll('tbody .burst-time input');
    const priorities = document.querySelectorAll('tbody .priority input');
    quantumtime = Number(document.querySelector('#quantum-time').value);
    contextSwitch = Number(document.querySelector("#switch-time").value);
    
    if (names.length === arrivals.length && arrivals.length === bursts.length && bursts.length === priorities.length) {
        processes.length = 0;
        for (let i = 0; i < names.length; i++) {
            processes.push({
                name: names[i].textContent.trim(),
                arrivalTime: parseInt(arrivals[i].value),
                burstTime: parseInt(bursts[i].value),
                priority: parseInt(priorities[i].value)
            });
        }
    }

    runComparison();
    
}

/*--------------------------------------------------ส่วนAlgorithm--------------------------------------------------*/

function sortArrivaltime(process){
    // Sort processes โดยเรียงตาม arrival time จากน้อยไปมาก
    return process.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

function sortPriority(process){
    // Sort processes โดยเรียงตาม priority จากน้อยไปมาก
    return process.sort((a, b) => a.priority - b.priority);
}

function CPUutilizationCal(EndCompletionTime) {
    let CPUtime = 0;
    processes.forEach(element => {
        CPUtime += element.burstTime;
    });

    return (CPUtime / EndCompletionTime) * 100.00;
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

function avgResponseTime(result){
    let sum = 0
    result.forEach( element => { sum += element.responseTime } );
    return sum / result.length ;
}

function FCFS() {
    let copy_process = sortArrivaltime(processes).slice();
    let currentTime = 0;
    let lastCompletionTime = 0;
    result_FCFS = [];
    timeline_FCFS = [];
    efficiency_FCFS = {};
    
    copy_process.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let completionTime = startTime + process.burstTime;
        let turnAroundTime = completionTime - process.arrivalTime; 
        let waitingTime = turnAroundTime - process.burstTime; 
        let responseTime = startTime - process.arrivalTime;
        
        result_FCFS.push({ 
            name: process.name, 
            completionTime: completionTime, 
            turnAroundTime: turnAroundTime, 
            waitingTime: waitingTime,
            responseTime: responseTime
        });
        timeline_FCFS.push({ 
            name: process.name, 
            start: startTime, 
            end: completionTime 
        });
        
        currentTime = completionTime + contextSwitch;
        lastCompletionTime = completionTime;
        
    });
    
    efficiency_FCFS = {CPUutilization: CPUutilizationCal(lastCompletionTime), 
        Throughput: ThroughputCal(timeline_FCFS.length, lastCompletionTime), 
        avgTurnAroundTime: avgTurnAroundTime(result_FCFS), 
        avgWaitingTime: avgWaitingTime(result_FCFS)} ;
}
    
function RR() {
    let copy_process = sortArrivaltime(processes).slice();
    let queue = [];
    let currentTime = 0;
    let lastCompletionTime = 0;
    result_RR = [];
    timeline_RR = [];
    efficiency_RR = {};
    
    let remainingBurst = {};
    let firstExecutionTime = {};

    copy_process.forEach(process => {
        remainingBurst[process.name] = process.burstTime;
        firstExecutionTime[process.name] = null; 
    });
    
    queue.push(...copy_process);
    
    while (queue.length > 0) {
        let currentProcess = queue.shift();
        let startTime = currentTime;
        
        if (firstExecutionTime[currentProcess.name] === null) {
            firstExecutionTime[currentProcess.name] = startTime;
        }

        let timeToExecute = Math.min(quantumtime, remainingBurst[currentProcess.name]);
        currentTime += timeToExecute;
        remainingBurst[currentProcess.name] -= timeToExecute;
        
        timeline_RR.push({ name: currentProcess.name, start: startTime, end: currentTime });
        
        if (remainingBurst[currentProcess.name] === 0) { // ถ้า process ทำงานเสร็จ
            let completionTime = currentTime;
            let turnAroundTime = completionTime - currentProcess.arrivalTime;
            let waitingTime = turnAroundTime - currentProcess.burstTime;
            let responseTime = firstExecutionTime[currentProcess.name] - currentProcess.arrivalTime;

            result_RR.push({
                name: currentProcess.name,
                arrivalTime: currentProcess.arrivalTime,
                burstTime: currentProcess.burstTime,
                completionTime: completionTime,
                turnAroundTime: turnAroundTime,
                waitingTime: waitingTime,
                responseTime: responseTime 
            });
            
            lastCompletionTime = completionTime;
        } else if (remainingBurst[currentProcess.name] > 0) { // ถ้ายังไม่เสร็จก็เพิ่มกลับเข้าคิว
            queue.push(currentProcess);
        }

        currentTime += contextSwitch;
    }
    
    efficiency_RR = {
        CPUutilization: CPUutilizationCal(lastCompletionTime),
        Throughput: ThroughputCal(result_RR.length, lastCompletionTime),
        avgTurnAroundTime: avgTurnAroundTime(result_RR),
        avgWaitingTime: avgWaitingTime(result_RR),
        avgResponseTime: avgResponseTime(result_RR)
    };
}    

function MQWF() {
    let timeq = quantumtime; 
    let queues = [];
    let uniquePriorities = new Set();
    result_MQWF = [];
    timeline_MQWF = [];
    efficiency_MQWF = {};
    
    processes.forEach(process => {
        uniquePriorities.add(process.priority);
    });
    
    let maxPriority = Math.max(...uniquePriorities);
    uniquePriorities.forEach(priority => { //สร้างคิวโดยที่มีค่าของ priority มากสุดทำ FCFS นอกนั้นทำ RR โดยมี quantum time เพิ่มขึ้นทีละ 2n
        if (priority !== maxPriority) {
            queues.push({ priority: priority, quantum: timeq, processes: [] });
            timeq *= 2;
        } else {
            queues.push({ priority: priority, quantum: 0, processes: [] });
        }
    });
    
    queues = sortPriority(queues);
    
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
    let firstExecutionTime = {};
    
    copy_process.forEach(process => {
        remainingBurst[process.name] = process.burstTime;
        firstExecutionTime[process.name] = null; // กำหนดค่าเริ่มต้นเป็น null
    });
    
    while (queues.some(queue => queue.processes.length > 0)) {
        let foundProcess = false;
        
        for (let i = 0; i < queues.length; i++) {
            let queue = queues[i];
            
            if (queue.processes.length > 0) {
                foundProcess = true;
                let currentProcess = queue.processes.shift();
                let startTime = currentTime;
                
                if (firstExecutionTime[currentProcess.name] === null) {
                    firstExecutionTime[currentProcess.name] = startTime;
                }

                let timeToExecute = queue.quantum > 0 
                ? Math.min(queue.quantum, remainingBurst[currentProcess.name])
                : remainingBurst[currentProcess.name]; //ถ้า quantum เป็น 0 ก็จะให้ timeToExecute เป็น remainingBurst ที่เหลือ (เป็นการทำ FCFS)
                
                currentTime += timeToExecute;
                remainingBurst[currentProcess.name] -= timeToExecute;
                
                timeline_MQWF.push({ name: currentProcess.name, start: startTime, end: currentTime });
                
                if (remainingBurst[currentProcess.name] === 0) {
                    let completionTime = currentTime;
                    let turnAroundTime = completionTime - currentProcess.arrivalTime;
                    let waitingTime = turnAroundTime - currentProcess.burstTime;
                    let responseTime = firstExecutionTime[currentProcess.name] - currentProcess.arrivalTime;

                    result_MQWF.push({
                        name: currentProcess.name,
                        arrivalTime: currentProcess.arrivalTime,
                        burstTime: currentProcess.burstTime,
                        completionTime: completionTime,
                        turnAroundTime: turnAroundTime,
                        waitingTime: waitingTime,
                        responseTime: responseTime 
                    });
                    
                    lastCompletionTime = completionTime;
                } else {
                    // process ยังไม่เสร็จ จะถูกย้ายไปคิวต่อไป(ถ้าไม่ใช่คิวสุดท้าย)
                    if (i + 1 < queues.length) {
                        queues[i + 1].processes.push(currentProcess);
                    }
                }
                
                break;
            }
        }
        
        if (!foundProcess) {
            // ถ้าไม่มี process ในคิวใด ๆ ให้ currentTime เลื่อนไปยัง arrivalTime ของ process ต่อไป
            currentTime = Math.max(currentTime, copy_process[0]?.arrivalTime || currentTime);
        }

        currentTime += contextSwitch;

    }
    
    efficiency_MQWF = {
        CPUutilization: CPUutilizationCal(lastCompletionTime),
        Throughput: ThroughputCal(result_MQWF.length, lastCompletionTime),
        avgTurnAroundTime: avgTurnAroundTime(result_MQWF),
        avgWaitingTime: avgWaitingTime(result_MQWF),
        avgResponseTime: avgResponseTime(result_MQWF) 
    };
}

/*-----------------------------------------------ส่วน output---------------------------------------*/

function runComparison() {
    //เก็บค่าการเลือก algorithm
    const selectedAlgorithms = [...document.querySelectorAll('input[name="algorithms"]:checked')].map(input => input.value);

    //เรียกใช้ตามที่เลือก
    const results = selectedAlgorithms.map(algorithm => {
        switch (algorithm) {
            case "FCFS":
                FCFS();
                return { name: "FCFS", efficiency: efficiency_FCFS, timeline: timeline_FCFS };
            case "RR":
                RR();
                return { name: "RR", efficiency: efficiency_RR, timeline: timeline_RR };
            case "MQWF":
                MQWF();
                return { name: "MQWF", efficiency: efficiency_MQWF, timeline: timeline_MQWF };
            default:
                return null;
        }
    });

    //เรียกฟังก์ชันแสดงการเปรียบเทียบ
    displayGanttCharts(results);
    displayComparisonChart(results);
}

function displayGanttCharts(results) {
    const container = document.getElementById('ganttCharts');
    container.innerHTML = '';

    Object.keys(results).forEach(algo => {
        const algoTimeline = results[algo];

        const ganttDiv = document.createElement('div');
        ganttDiv.innerHTML = `<h3>${algo} Gantt Chart</h3>`;

        const chart = document.createElement('div');
        chart.classList.add('gantt-chart-bar');

        algoTimeline.forEach(process => {
            const processDiv = document.createElement('div');
            processDiv.style.width = `${process.end - process.start}px`;
            processDiv.textContent = `${process.name} (${process.start}-${process.end})`;
            chart.appendChild(processDiv);
        });

        ganttDiv.appendChild(chart);
        container.appendChild(ganttDiv);
    });
}

function displayComparisonChart(results) {
    const labels = Object.keys(results);
    const cpuUtilizations = labels.map(algo => results[algo].CPUutilization);
    const avgTurnaroundTimes = labels.map(algo => results[algo].avgTurnAroundTime);
    const avgWaitingTimes = labels.map(algo => results[algo].avgWaitingTime);
    const avgResponseTimes = labels.may(algo => results[algo].avgResponseTime);

    const data = {
        labels: labels,
        datasets: [
            { 
                label: 'CPU Utilization (%)',
                data: cpuUtilizations, 
                backgroundColor: 'rgba(75, 192, 192, 0.6)' 
            },
            { 
                label: 'Average Turnaround Time', 
                data: avgTurnaroundTimes, 
                backgroundColor: 'rgba(255, 159, 64, 0.6)' 
            },
            { 
                label: 'Average Waiting Time', 
                data: avgWaitingTimes, 
                backgroundColor: 'rgba(153, 102, 255, 0.6)' 
            },
            { 
                label: 'Average Response Time', 
                data: avgResponseTimes, 
                backgroundColor: 'rgba(54, 162, 235, 0.6)' 
            }
        ]
    };

    new Chart(document.getElementById('comparisonChart'), {
        type: 'bar',
        data: data,
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}