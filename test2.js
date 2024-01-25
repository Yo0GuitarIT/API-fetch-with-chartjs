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

function extact(element, style) {
  return style === "Time" ? element[style].slice(0, -3) : element[style];
}

function getData(info, style) {
  return info.data.map((element) => extact(element, style));
}

function getChartData(data, type, yID) {
  return Object.values(data).map((item) => ({
    type: type,
    label: item.name,
    data: item
      .getDataWithTime()
      .map((element) => ({ x: element[1], y: element[0] })),
    yAxisID: yID,
  }));
}

function getOptionConfig() {
  return {
    scales: {
      x: {
        type: "time",
        time: {
          parser: "yyyy-MM-dd HH:mm", 
          unit: "minute",
          displayFormats: {
            minute: "yyyy-MM-dd HH:mm", 
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
}

function randerChart(barData, lineData) {
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    data: {
      datasets: [
        ...getChartData(barData, "bar", "y1"),
        ...getChartData(lineData, "line", "y2"),
      ],
    },
    options: getOptionConfig(),
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

  class completeData {
    constructor(name, info) {
      this.name = name;
      this.info = info;
    }
    getDataWithTime() {
      const data = getData(this.info, "Data");
      const time = getData(this.info, "Time");
      const dataWithTime = data.map((element, index) => [element, time[index]]);

      return dataWithTime;
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

  randerChart(barData, lineData);
};
