// // ลองแสดงผล
// processes = [
//     { name: "P1", arrivalTime: 0, burstTime: 80, priority: 1 },
//     { name: "P2", arrivalTime: 20, burstTime: 60, priority: 2 },
//     { name: "P3", arrivalTime: 40, burstTime: 65, priority: 3 },
//     { name: "P4", arrivalTime: 60, burstTime: 120, priority: 4 }
// ];

// // กำหนด time quantum สำหรับ Round Robin
// timequantum = 50;

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