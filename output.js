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
        const chartDiv = document.createElement('div');
        chartDiv.classList.add('ganttChart');
        chartDiv.innerHTML = `<h5>${result.name} Gantt Chart</h5>`;

        const totalTime = result.timeline[result.timeline.length - 1].end;
        
        const timelineDiv = document.createElement('div');
        timelineDiv.classList.add('timeline');

        // เพิ่มเฉพาะเวลาเริ่มต้นที่ 0 ที่จุดเริ่มต้นของแถบ Gantt
        const startMarker = document.createElement('span');
        startMarker.classList.add('timeMarker');
        startMarker.style.left = `0%`;
        startMarker.innerText = result.timeline[0].start;
        timelineDiv.appendChild(startMarker);

        result.timeline.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('ganttTask');
            
            const taskDuration = task.end - task.start;
            taskDiv.style.width = `${(taskDuration / totalTime) * 100}%`;
            taskDiv.innerHTML = `${task.name} <span class="end-time">${task.end}</span>`;
            
            timelineDiv.appendChild(taskDiv);
        });

        chartDiv.appendChild(timelineDiv);
        ganttContainer.appendChild(chartDiv);
    });
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
                    backgroundColor: '#595959'
                },
                {
                    label: 'Average Waiting Time',
                    data: results.map(result => result.efficiency.avgWaitingTime),
                    backgroundColor: '#999999'
                },
                {
                    label: 'Average Turnaround Time',
                    data: results.map(result => result.efficiency.avgTurnAroundTime),
                    backgroundColor: '#242424'
                },
                {
                    label: 'Average Response Time',
                    data: results.map(result => result.efficiency.avgResponseTime),
                    backgroundColor: '#000000'
                }                
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}