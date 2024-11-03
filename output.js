// // ลองแสดงผล
// processes = [
//     { name: "P1", arrivalTime: 0, burstTime: 80, priority: 1 },
//     { name: "P2", arrivalTime: 20, burstTime: 60, priority: 2 },
//     { name: "P3", arrivalTime: 40, burstTime: 65, priority: 3 },
//     { name: "P4", arrivalTime: 60, burstTime: 120, priority: 4 }
// ];

// // กำหนด time quantum สำหรับ Round Robin
// quantumtime = 50;

// // เรียกฟังก์ชันของแต่ละอัลกอริทึมที่ต้องการทดสอบ
// FCFS();
// RR();
// MQWF();

// // ทดสอบการแสดงผลด้วยข้อมูลที่คำนวณได้
// console.log("FCFS Results:", result_FCFS, efficiency_FCFS, timeline_FCFS);
// console.log("RR Results:", result_RR, efficiency_RR, timeline_RR);
// console.log("MQWF Results:", result_MQWF, efficiency_MQWF, timeline_MQWF);

// // สมมติว่ามีฟังก์ชันเพื่อแสดงผลกราฟและ Gantt Chart
// displayGanttCharts([
//     { name: "FCFS", timeline: timeline_FCFS },
//     { name: "RR", timeline: timeline_RR },
//     { name: "MQWF", timeline: timeline_MQWF }
// ]);
// displayComparisonChart([
//     { name: "FCFS", efficiency: efficiency_FCFS },
//     { name: "RR", efficiency: efficiency_RR },
//     { name: "MQWF", efficiency: efficiency_MQWF }
// ]);



function runComparison() {
    const checkboxes = document.querySelectorAll('.select-algorithm input[type="checkbox"]');
    const selectedAlgorithms = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    let results = [];

    if (selectedAlgorithms.length > 0) {
        selectedAlgorithms.forEach(algorithm => {
            switch (algorithm) {
                case 'fcfs':
                    FCFS();
                    results.push({ name: "FCFS", efficiency: efficiency_FCFS, timeline: timeline_FCFS });
                    break;
                case 'rr':
                    RR();
                    results.push({ name: "RR", efficiency: efficiency_RR, timeline: timeline_RR });
                    break;
                case 'sjf':
                    SJF();
                    results.push({ name: "SJF", efficiency: efficiency_SJF, timeline: timeline_SJF });
                    break;
                case 'srtf':
                    SRTF();
                    results.push({ name: "SRTF", efficiency: efficiency_SRTF, timeline: timeline_SRTF });
                    break;
                case 'p':
                    P();
                    results.push({ name: "P", efficiency: efficiency_P, timeline: timeline_P });
                    break;
                case 'hrrn':
                    HRRN();
                    results.push({ name: "HRRN", efficiency: efficiency_HRRN, timeline: timeline_HRRN });
                    break;
                case 'mqwf':
                    MQWF();
                    results.push({ name: "MQWF", efficiency: efficiency_MQWF, timeline: timeline_MQWF });
                    break;
                default:
                    break;
            }
        });

        document.getElementById('ganttCharts').style.visibility = 'visible';
        document.getElementById('comparisonChart').parentNode.style.visibility = 'visible'
        
        // แสดงผลลัพธ์ที่เลือก
        displayGanttCharts(results);
        displayComparisonChart(results);

    } else {
        alert("กรุณาเลือก Algorithm ด้วยนะ!!!");
    }
}

function displayGanttCharts(results) {
    const ganttContainer = document.getElementById('ganttCharts');
    ganttContainer.innerHTML = '';

    results.forEach(result => {
        // สร้างส่วนหัวสำหรับ Gantt Chart ของแต่ละอัลกอริทึม
        const chartDiv = document.createElement('div');
        chartDiv.classList.add('ganttChart');
        chartDiv.innerHTML = `<h3>${result.name} Gantt Chart</h3>`;
        
        // สร้างแถบของแต่ละกระบวนการ
        result.timeline.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('ganttTask');
            taskDiv.style.width = `${(task.end - task.start) * 2}px`;
            taskDiv.style.backgroundColor = getTaskColor(task.name); 
            taskDiv.innerText = `${task.name} (${task.start}-${task.end})`; 
            chartDiv.appendChild(taskDiv);
        });
        
        ganttContainer.appendChild(chartDiv);
    });
}

//เปลี่ยนสี
function getTaskColor(name) {
    const colors = {
        "P1": "#000000",  
        "P2": "#000000",  
        "P3": "#000000",  
        "P4": "#000000", 
    };
    return colors[name] || "#9E9E9E"; 
}


function displayComparisonChart(results) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const labels = results.map(result => result.name);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, //ชื่อ algorithm ที่เลือก
            datasets: [
                {
                    label: 'CPU Utilization (%)',
                    data: results.map(result => result.efficiency.CPUutilization),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Average Turnaround Time',
                    data: results.map(result => result.efficiency.avgTurnAroundTime),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)'
                },
                {
                    label: 'Average Waiting Time',
                    data: results.map(result => result.efficiency.avgWaitingTime),
                    backgroundColor: 'rgba(255, 159, 64, 0.6)'
                }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}