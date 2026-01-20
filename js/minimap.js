// ---------------------------------------------
// Minimap Container (nur Rechteck, keine Tiles)
// ---------------------------------------------
const miniMap = L.map("minimap", {
    crs: CRS_Fixed,           // gleiche CRS wie Hauptkarte
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    inertia: false
});

// Minimap zeigt die komplette Karte
miniMap.fitBounds(bounds);

// ---------------------------------------------
// Rechteck für aktuellen Hauptkarten-Bereich
// ---------------------------------------------
const viewRect = L.rectangle(bounds, {
    color: "#ff7800",
    weight: 2,
    fillOpacity: 0.1,
    interactive: false
}).addTo(miniMap);

const miniMapWidth = miniMap.getSize().x;
const miniMapHeight = miniMap.getSize().y;

const scaleX = miniMapWidth / MAP_WIDTH;
const scaleY = miniMapHeight / MAP_HEIGHT;

// ---------------------------------------------
// Funktion zum Aktualisieren des Rechtecks
// ---------------------------------------------

function updateMiniMapView() {
    const b = map.getBounds();

    // Aktuelle Hauptkarte-Koordinaten
    const north = b.getNorth();
    const south = b.getSouth();
    const west = b.getWest();
    const east = b.getEast();

    // Skalieren auf Minimap
    const miniNorth = north * scaleY;
    const miniSouth = south * scaleY;
    const miniWest = west * scaleX;
    const miniEast = east * scaleX;

    viewRect.setBounds([
        [miniNorth, miniWest],
        [miniSouth, miniEast]
    ]);
}
