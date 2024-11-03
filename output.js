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
                    SRTF();
                    results.push({ name: "SJF", efficiency: efficiency_SRTF, timeline: timeline_SRTF });
                    break;
                case 'srtf':
                    SRTF();
                    results.push({ name: "SRTF", efficiency: efficiency_SRTF, timeline: timeline_SRTF });
                    break;
                case 'p':
                    
                    results.push({ name: "Priority", efficiency: efficiency_P, timeline: timeline_P });
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
