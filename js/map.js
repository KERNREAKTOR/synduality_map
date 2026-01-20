// ----------------------------------------
// TILE CONFIG
// ----------------------------------------
const TILE_SIZE = 1024;
const TILE_ROWS = 12;   // r0..r11
const TILE_COLS = 9;    // c0..c8

const MAP_WIDTH = TILE_COLS * TILE_SIZE;   // 9216
const MAP_HEIGHT = TILE_ROWS * TILE_SIZE;  // 12288

// ----------------------------------------
// MAP INITIALISIEREN
// ----------------------------------------
// CRS: 0,0 ist oben links und es gibt nur eine Ebene
const CRS_Fixed = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(1, 0, 1, 0)
});

const map = L.map("map", {
    crs: CRS_Fixed,
    minZoom: -4,
    maxZoom: 2,
    zoomControl: false,
    scrollWheelZoom: true,
    wheelPxPerZoomLevel: 200  // kleinere Sprünge beim Scrollen
});

// ----------------------------------------
// BOUNDS (WICHTIG!)
// ----------------------------------------
const bounds = [
    [0, 0],
    [MAP_HEIGHT, MAP_WIDTH]
];

map.setMaxBounds(bounds);
// map.fitBounds(bounds); // komplette Karte am Anfang sichtbar
map.setView([MAP_HEIGHT / 2, MAP_WIDTH / 2], -2); // Zoom 0

// ----------------------------------------
// TILELAYER mit NICHT-NEGATIVEN KOORDINATEN
// ----------------------------------------
const tileLayer = L.gridLayer({
    tileSize: TILE_SIZE,
    noWrap: true,
    maxNativeZoom: 0, // wir haben NUR Zoomlevel 0
    minNativeZoom: 0,
    maxZoom: 4,        // User darf reinzoomen
    minZoom: -4,       // User darf rauszoomen
    zoomOffset: 0,
    keepBuffer: 10
});

tileLayer.createTile = function (coords) {
    const img = document.createElement("img");

    // Tile-Koordinaten auf Level 0 normalisieren
    const r = coords.y;
    const c = coords.x;

    // VERSUCH 1: Deine 0..11 / 0..8 Tiles direkt
    if (r >= 0 && r < TILE_ROWS && c >= 0 && c < TILE_COLS) {
        img.src = `tiles/tile_r${r}_c${c}.png`;
    } else {
        img.src = "";
    }

    return img;
};

tileLayer.addTo(map);

// ---------------------------------------------
// CUSTOM ZOOM SLIDER (Feinzoom bis 0.1)
// ---------------------------------------------
const sliderControl = L.control({ position: 'topleft' });

sliderControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'leaflet-bar zoom-slider');
    div.style.padding = "10px";
    div.style.background = "white";
    div.style.width = "40px";

    // Slider HTML
    div.innerHTML = `
        <input id="zoomSlider" 
               type="range" 
               min="${map.getMinZoom()}" 
               max="${map.getMaxZoom()}" 
               step="0.1" 
               value="${map.getZoom()}"
               style="width: 100%; transform: rotate(-90deg); margin-top: 60px;">
    `;

    // Event Listener
    setTimeout(() => {
        const slider = document.getElementById("zoomSlider");
        slider.addEventListener("input", () => {
            const z = Number(slider.value);
            map.setZoom(z);
        });

        // Map → Slider synchronisieren
        map.on("zoom", () => {
            slider.value = map.getZoom();
        });
    }, 50);

    return div;
};

sliderControl.addTo(map);