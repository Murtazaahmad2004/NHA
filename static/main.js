function toggleSidebar() {
  document.body.classList.toggle("collapsed");
}

let attendanceChartInstance = null;

function loadChart(endpoint, canvasId, chartType = "bar") {
    fetch(`/chart-data/${endpoint}`)
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById(canvasId).getContext("2d");

            // Destroy previous chart if exists
            if (attendanceChartInstance) {
                attendanceChartInstance.destroy();
                attendanceChartInstance = null;
            }

            // Create new chart
            attendanceChartInstance = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: data.labels,      // early_in
                    datasets: data.datasets   // early_out values
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true },
                        x: { title: { display: true, text: "Early In" } },
                        y: { title: { display: true, text: "Early Out" } }
                    }
                }
            });
        })
        .catch(err => console.error("Error loading chart:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    loadChart("form", "attendenceChart", "bar");
});