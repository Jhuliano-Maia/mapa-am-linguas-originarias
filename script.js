// A view inicial é apenas um ponto de partida. O map.fitBounds ajustará o zoom depois.
const map = L.map("map").setView([-3.107, -60.021], 5);

// Adiciona a camada base do OpenStreetMap (o "fundo" do mapa)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Função para mostrar o painel de informações
function showInfoPanel(properties) {
  document.getElementById("info-panel").style.display = "block";

  const contentDiv = document.getElementById("info-content");

  const htmlContent = `
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
    <p><strong>Família Linguística:</strong> ${properties.familia_linguistica || "N/A"}</p>
    <p><strong>Tronco Linguístico:</strong> ${properties.tronco_linguistico || "N/A"}</p>
    <p><strong>Quantidade de Falantes:</strong> ${properties.quantidade_de_falantes || "N/A"}</p>
    <p><strong>Total de Falantes:</strong> ${properties.quantidade_total_de_falantes || "N/A"}</p>
    <p><strong>Vitalidade:</strong> ${properties.vitalidade || "N/A"}</p>
    <p><strong>Sinônimo:</strong> ${properties.sinonimo || "N/A"}</p>
    <p><strong>Código ISO:</strong> ${properties.codigo_iso || "N/A"}</p>
    <p><strong>Áreas Etnográficas:</strong> ${properties.areas_etnograficas || "N/A"}</p>
    <p><strong>Núcleo:</strong> ${properties.nucleo || "N/A"}</p>
  `;

  contentDiv.innerHTML = htmlContent;
}

// Carrega o arquivo GeoJSON com os dados das aldeias
fetch("aldeias_pontos_site.geojson")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao carregar o GeoJSON.");
    }
    return response.json();
  })
  .then((data) => {
    // Cluster
    const markers = L.markerClusterGroup();

    // GeoJSON layer
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

    const searchControl = new L.Control.Search({
      layer: geoJsonLayer,
      propertyName: "nome_aldei",
      initial: false,
      zoom: 14,
      marker: false,
    });

    map.addControl(searchControl);
  })
  .catch((error) => {
    console.error("Erro:", error);
    alert("Não foi possível carregar os dados.");
  });
