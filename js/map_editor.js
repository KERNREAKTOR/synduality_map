// ------------------------------------------------------
// EDITOR / DRAW TOOL
// ------------------------------------------------------

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: {
            draggable: true
        },
        polyline: {
            shapeOptions: {
                color: '#00aaff',
                weight: 5
            }
        }
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
});

map.addControl(drawControl);

// Wenn ein neues Element gezeichnet wird
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
});

// ------------------------------------------------------
// EXPORT-FUNKTION ALS JSON (X/Y im Karten-Koordinatensystem)
// ------------------------------------------------------

window.exportPaths = () => {
    const exportData = [];

    drawnItems.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            const latlngs = layer.getLatLngs();
            const points = latlngs.map(p => ({
                x: Math.round(p.lng),
                y: Math.round(p.lat)
            }));

            exportData.push({
                type: "polyline",
                points
            });
        } else if (layer instanceof L.Marker) {
            const p = layer.getLatLng();
            exportData.push({
                type: "point",
                x: Math.round(p.lng),
                y: Math.round(p.lat)
            });
        }
    });

    console.log("EXPORT:", JSON.stringify(exportData, null, 2));
    alert("Export wurde in der Browser-Konsole ausgegeben.");
};
