const map = L.map("map").setView([-3.107, -60.021], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function showInfoPanel(properties) {
  document.getElementById("info-panel").style.display = "block";

  const contentDiv = document.getElementById("info-content");

  contentDiv.innerHTML = `
    <h2>${properties.nome_aldei || "Informações do Ponto"}</h2>
    <p><strong>Município:</strong> ${properties.nommunic || "N/A"}</p>
    <p><strong>UF:</strong> ${properties.nomuf || "N/A"}</p>
    <p><strong>Coordenação Regional:</strong> ${properties.nome_cr || "N/A"}</p>
    <p><strong>Data de Cadastro:</strong> ${properties.data_cadas || "N/A"}</p>
    <p><strong>Código da Aldeia:</strong> ${properties.cod_aldeia || "N/A"}</p>
    <p><strong>Código TI:</strong> ${properties.cod_ti || "N/A"}</p>
    <p><strong>Código Município:</strong> ${properties.cod_munici || "N/A"}</p>
    <p><strong>Latitude:</strong> ${properties.coord_lat || "N/A"}</p>
    <p><strong>Longitude:</strong> ${properties.coord_long || "N/A"}</p>
    <hr>
    <h3>Dados Linguísticos</h3>
    <p><strong>Língua:</strong> ${properties.lingua || "N/A"}</p>
    <p><strong>Família:</strong> ${properties.familia_linguistica || "N/A"}</p>
    <p><strong>Tronco:</strong> ${properties.tronco_linguistico || "N/A"}</p>
    <p><strong>Falantes:</strong> ${properties.quantidade_de_falantes || "N/A"}</p>
    <p><strong>ISO:</strong> ${properties.codigo_iso || "N/A"}</p>
  `;
}

fetch("aldeias_pontos_site.geojson")
  .then((response) => {
    if (!response.ok) throw new Error("Erro ao carregar GeoJSON");
    return response.json();
  })
  .then((data) => {
    const markers = L.markerClusterGroup();

    const geoJsonLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.on("click", function () {
          showInfoPanel(feature.properties);
        });
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });
      },
    });

    markers.addLayer(geoJsonLayer);
    map.addLayer(markers);

    map.fitBounds(markers.getBounds());

    const searchControl = L.control({ position: "topleft" });

    searchControl.onAdd = function () {
      const div = L.DomUtil.create("div", "search-box");
      div.innerHTML = `<input id="searchBox" type="text" placeholder="Buscar aldeia..." />`;
      return div;
    };

    searchControl.addTo(map);

    setTimeout(() => {
      const input = document.getElementById("searchBox");

      // Função que realiza a busca
      function search() {
        const value = input.value.toLowerCase();

        markers.eachLayer((cluster) => {
          cluster.eachLayer((layer) => {
            const nome = layer.feature?.properties?.nome_aldei?.toLowerCase();

            if (nome && nome.includes(value)) {
              layer.setStyle({ fillColor: "red", radius: 7 });
            } else {
              layer.setStyle({ fillColor: "#ff7800", radius: 5 });
            }
          });
        });
      }

      // Chama a função de busca ao digitar
      input.addEventListener("keyup", search);

      // Chama a função de busca ao pressionar Enter
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          search();
        }
      });
    }, 300);
  })
  .catch(() => {
    alert("Não foi possível carregar os dados.");
  });
