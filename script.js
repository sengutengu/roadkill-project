async function fetchCSVData(url) {
  /* Takes Google Sheets URL and returns an object.
     Object.data is an array of objects, 
     in which each object is a line on the spreadsheet. */
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch CSV");
    return Papa.parse(await response.text(), { header: true });
  } catch (error) {
    console.error(error);
    return { data: [] }; // Return empty object in case of error
  }
}

async function initializeMap() {
  var map = L.map("map").setView([42.34, -71.17], 14);
  L.tileLayer(
    "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
  ).addTo(map);
  return map;
}

async function addMarkersToMap(map, roadkillData) {
  roadkillData.data.forEach((entry) => {
    if (entry.observer == "LK") {
      if (entry.species == "Sciurus carolinensis") {
        L.circleMarker([parseFloat(entry.y), parseFloat(entry.x)], {
          color: "red",
          fillColor: "yellow",
          fillOpacity: 1,
          radius: 10,
          weight: 1,
        }).addTo(map);
      } else if (entry.species == "Rattus norvegicus") {
        L.circleMarker([parseFloat(entry.y), parseFloat(entry.x)], {
          color: "black",
          fillColor: "#000",
          fillOpacity: 0.2,
          radius: 10,
          weight: 1,
        }).addTo(map);
      } else if (entry.species == "Sylvilagus floridanus") {
        L.circleMarker([parseFloat(entry.y), parseFloat(entry.x)], {
          color: "green",
          fillColor: "green",
          fillOpacity: 0.2,
          radius: 10,
          weight: 1,
        }).addTo(map);
      } else if (entry.species == "Mus musculus") {
        L.circleMarker([parseFloat(entry.y), parseFloat(entry.x)], {
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.2,
          radius: 10,
          weight: 1,
        }).addTo(map);
      } else {
        L.circleMarker([parseFloat(entry.y), parseFloat(entry.x)], {
          color: "red",
          fillColor: "red",
          fillOpacity: 0.2,
          radius: 10,
          weight: 1,
        }).addTo(map);
      }
    }
  });
  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML +=
      '<i style="background: yellow; border-color: red; border-style: solid; border-width: 1px"></i><span>Squirrel</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>Rabbit</span><br>';
    div.innerHTML += '<i style="background: black"></i><span>Rat</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>Mouse</span><br>';
    div.innerHTML +=
      '<i style="background: red"></i><span>Unidentifiable</span><br>';
    return div;
  };

  legend.addTo(map);
}

document.addEventListener("DOMContentLoaded", async function () {
  const dataUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhZdR7-Gw5H5l0HIqeOLE8_RgEnc-3294AgLB7md5UPIakYJO1EUbZpeQrzcBnToeZCEC_jQeX2cXU/pub?output=csv";
  const roadkillData = await fetchCSVData(dataUrl);
  var map = await initializeMap();
  await addMarkersToMap(map, roadkillData);
});
