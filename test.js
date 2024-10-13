let processes = [{name: 'p1', arrivalTime: 0, burstTime: 5,  priority: 1}, {name: 'p2', arrivalTime: 1, burstTime: 8,  priority: 0}];
let result_FCFS = [];
let timeline_FCFS = [];
let timequantum = 1;
let efficiency_FCFS = {};

function addProcess() {
    let processName = document.getElementById("processName").value;
    let arrivalTime = parseInt(document.getElementById("arrivalTime").value);
    let burstTime = parseInt(document.getElementById("burstTime").value);
    let priority = parseInt(document.getElementById("priority").value);

    processes.push({ name: processName, arrivalTime: arrivalTime, burstTime: burstTime, priority: priority });
}

function sortting() {
    return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

function createTable(resultData) {
    let result = `<h3>FCFS Scheduling Result</h3>
                  <table>
                    <tr>
                        <th>Process</th>
                        <th>Arrival Time</th>
                        <th>Burst Time</th>
                        <th>Start Time</th>
                        <th>Completion Time</th>
                        <th>Turn Around Time</th>
                        <th>Waiting Time</th>
                    </tr>`;
    
    resultData.forEach(process => {
        result += 
            `<tr>
                <td>${process.name}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${process.startTime}</td>
                <td>${process.completionTime}</td>
                <td>${process.turnAroundTime}</td>
                <td>${process.waitingTime}</td>
            </tr>`;
    });

    result += `</table>`;
    document.getElementById("result").innerHTML = result;
}

function createEfficiencyTable(efficiency) {
    let efficiencyResult = `<h3>FCFS Efficiency</h3>
                            <table>
                              <tr>
                                  <th>CPU Utilization</th>
                                  <th>Throughput</th>
                                  <th>Average Turnaround Time</th>
                                  <th>Average Waiting Time</th>
                              </tr>
                              <tr>
                                  <td>${efficiency.CPUutilization.toFixed(2)}%</td>
                                  <td>${efficiency.Throughput.toFixed(4)}</td>
                                  <td>${efficiency.avgTurnAroundTime.toFixed(2)}</td>
                                  <td>${efficiency.avgWaitingTime.toFixed(2)}</td>
                              </tr>
                            </table>`;
    
    document.getElementById("efficiency").innerHTML = efficiencyResult;
}

function CPUutilizationCal(timeline, EndCompletionTime) {
    let CPUtime = 0;
    timeline.forEach(element => {
        CPUtime += (element.end - element.start);
    });
    return (CPUtime / EndCompletionTime) * 100;
}

function ThroughputCal(NumProcess, EndCompletionTime) {
    return NumProcess / EndCompletionTime;
}

function avgTurnAroundTime(result) {
    let sum = 0;
    result.forEach(element => {
        sum += element.turnAroundTime;
    });
    return sum / result.length;
}

function avgWaitingTime(result) {
    let sum = 0;
    result.forEach(element => {
        sum += element.waitingTime;
    });
    return sum / result.length;
}

function FCFS() {
    let copy_process = sortting();
    let currentTime = 0;
    let lastCompletionTime = 0; // เก็บค่าการเสร็จสิ้นของ process สุดท้าย

    copy_process.forEach(process => {
        let startTime = Math.max(currentTime, process.arrivalTime);
        let completionTime = startTime + process.burstTime;
        let turnAroundTime = completionTime - process.arrivalTime;
        let waitingTime = turnAroundTime - process.burstTime;

        result_FCFS.push({ 
            name: process.name, 
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            startTime: startTime,
            completionTime: completionTime, 
            turnAroundTime: turnAroundTime, 
            waitingTime: waitingTime 
        });

        timeline_FCFS.push({ name: process.name, start: startTime, end: completionTime });

        currentTime = completionTime;
        lastCompletionTime = completionTime; // เก็บค่า completionTime ของ process ล่าสุด
    });

    // คำนวณประสิทธิภาพ (efficiency)
    efficiency_FCFS = {
        CPUutilization: CPUutilizationCal(timeline_FCFS, lastCompletionTime),
        Throughput: ThroughputCal(result_FCFS.length, lastCompletionTime),
        avgTurnAroundTime: avgTurnAroundTime(result_FCFS),
        avgWaitingTime: avgWaitingTime(result_FCFS)
    };

    createTable(result_FCFS);
    createEfficiencyTable(efficiency_FCFS);
}
