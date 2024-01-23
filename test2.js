URL1 = "https://run.mocky.io/v3/cf8ff54a-40af-4907-91df-3a24bfb75c5f";
URL2 = "https://run.mocky.io/v3/827936fd-d288-4ec0-8c05-865878ef4409";
URL3 = "https://run.mocky.io/v3/18edb8c1-99c9-4f8c-9150-6a5508edbde1";
URL4 = "https://run.mocky.io/v3/82b0ad83-4b4c-4fe7-a89d-8b88eb5c263b";
URL5 =
  "https://run.mocky.io/v3/b27275e1-f9d5-4a0c-94a8-aa84408bffd0?mocky-delay=1500ms";

async function fetchAllData(...urls) {
  try {
    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const fetchData = await Promise.all(
      responses.map((response) => response.json())
    );
    return fetchData;
  } catch (error) {
    console.log(error);
  }
}

function extractData(item, style) {
  return style === "Time" ? item.split(" ")[1] : item;
}

function getData(info, style) {
  return info.data.map((element) => extractData(element[style], style));
}

function randerChart(timeData, barData, lineData) {
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    data: {
      datasets: [
        ...Object.values(barData).map((item) => ({
          type: "bar",
          label: item.name,
          data: item.infoData(),
          yAxisID: "y1",
        })),
        ...Object.values(lineData).map((item) => ({
          type: "line",
          label: item.name,
          data: item.infoData(),
          yAxisID: "y2",
        })),
      ],
      labels: timeData,
    },
    options: {
      scales: {
        y1: {
          type: "linear",
          display: true,
          position: "left",
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

window.onload = async function () {
  const [info1, info2, info3, info4, info5] = await fetchAllData(
    URL1,
    URL2,
    URL3,
    URL4,
    URL5
  );

  const timeData = getData(info1, "Time");

  class completeData {
    constructor(name, info) {
      this.name = name;
      this.info = info;
    }
    infoData() {
      return getData(this.info, "Data");
    }
  }

  const barData = {
    firstData: new completeData(info1.name, info1),
    secondData: new completeData(info2.name, info2),
    thirdData: new completeData(info3.name, info3),
  };

  const lineData = {
    fourthData: new completeData(info4.name, info4),
    fifthData: new completeData(info5.name, info5),
  };

  randerChart(timeData, barData, lineData);
};
