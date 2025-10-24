// Coordenadas aproximadas para o centro do Amazonas
const centroAmazonas = [-3.107, -60.021];
const nivelZoom = 6;

// Inicializa o mapa do Leaflet
const map = L.map("map").setView(centroAmazonas, nivelZoom);

// Adiciona a camada base do OpenStreetMap (o "fundo" do mapa)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Função para mostrar o painel de informações
function showInfoPanel(properties) {
  // Torna o painel visível
  document.getElementById("info-panel").style.display = "block";

  // Seleciona o elemento onde o conteúdo será inserido
  const contentDiv = document.getElementById("info-content");

  // Cria o conteúdo HTML com base nas propriedades do ponto
  const htmlContent = `
        <h2>${properties.nome_aldei || "Informações do Ponto"}</h2>
        <p><strong>Município:</strong> ${properties.nommunic || "N/A"}</p>
        <p><strong>Coordenacão Regional:</strong> ${
          properties.nome_cr || "N/A"
        }</p>
        <p><strong>Data de Cadastro:</strong> ${
          properties.data_cadas || "N/A"
        }</p>
        <p><strong>Código da Aldeia:</strong> ${
          properties.cod_aldeia || "N/A"
        }</p>
        <p><strong>Latitude:</strong> ${properties.coord_lat || "N/A"}</p>
        <p><strong>Longitude:</strong> ${properties.coord_long || "N/A"}</p>
    `;

  // Insere o conteúdo no painel
  contentDiv.innerHTML = htmlContent;
}

// Carrega o arquivo GeoJSON com os dados das aldeias
fetch("aldeias_pontos_site.geojson")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Erro ao carregar o arquivo GeoJSON. Verifique o nome e a localização."
      );
    }
    return response.json();
  })
  .then((data) => {
    // Cria a camada de pontos do GeoJSON
    const geoJsonLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        // Adiciona um evento de clique em cada ponto
        layer.on("click", function (e) {
          showInfoPanel(feature.properties);
        });
      },
    }).addTo(map);

    // Centraliza o mapa na área de todos os pontos
    map.fitBounds(geoJsonLayer.getBounds());
  })
  .catch((error) => {
    console.error("Erro:", error);
    alert(
      "Não foi possível carregar os dados. Verifique o console do navegador."
    );
  });
