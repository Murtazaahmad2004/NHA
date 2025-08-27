function toggleSidebar() {
  document.body.classList.toggle("collapsed");
}

document.addEventListener('DOMContentLoaded', function () {

    const chartData = {
        '2024': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            present: [20, 18, 22, 19, 21, 20],
            leave: [2, 4, 1, 3, 2, 2]
        },
        '2023': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            present: [18, 17, 20, 18, 19, 21],
            leave: [4, 5, 2, 3, 3, 1]
        },
        '2022': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            present: [19, 20, 21, 18, 22, 20],
            leave: [3, 2, 1, 4, 2, 3]
        }
    };

    const ctx = document.getElementById('attendanceChart').getContext('2d');
    const ratioCtx = document.getElementById('ratioChart').getContext('2d');

    let attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData['2024'].labels,
            datasets: [
                {
                    label: 'Present Days',
                    data: chartData['2024'].present,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Leave Days',
                    data: chartData['2024'].leave,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            },
            onClick: function(evt) {
                const points = attendanceChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const index = points[0].index;
                    const year = document.getElementById('yearSelect').value;
                    showLast3MonthsRatio(year, index);
                }
            }
        }
    });

    let ratioChart = new Chart(ratioCtx, {
        type: 'line',
        data: {
            labels: ['Present', 'Leave'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        },
        options: { responsive: true }
    });

    const yearSelect = document.getElementById('yearSelect');
    yearSelect.addEventListener('change', function () {
        const year = this.value;
        attendanceChart.data.labels = chartData[year].labels;
        attendanceChart.data.datasets[0].data = chartData[year].present;
        attendanceChart.data.datasets[1].data = chartData[year].leave;
        attendanceChart.update();

        // Reset ratio chart
        ratioChart.data.datasets[0].data = [0, 0];
        ratioChart.update();
    });

    function showLast3MonthsRatio(year, clickedIndex) {
        // Calculate last 3 months indexes
        const start = Math.max(0, clickedIndex - 2);
        const end = clickedIndex + 1;

        const presentSum = chartData[year].present.slice(start, end).reduce((a,b)=>a+b,0);
        const leaveSum = chartData[year].leave.slice(start, end).reduce((a,b)=>a+b,0);

        ratioChart.data.datasets[0].data = [presentSum, leaveSum];
        ratioChart.update();
    }
});
