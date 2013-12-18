var App = {
    initialize: function () {
        var map = window.map = L.mapbox.map('map', 'umurgdk.map-q0038vnz').setView([-33.4373, -70.6437], 15),
            marker = L.marker([-33.4373, -70.6437]);

        marker.setMenu({
            radius: 75,

            items: [{
                title: "Hobarey",
                click: function () {
                    alert("Hobarey");
                }
            }, {
                title: "Ne Guzel",
                className: 'item-2',
                click: function () {
                    alert("Ne Guzel");
                }
            }, {
                title: "Ne Guzel",
                click: function () {
                    alert("Ne Guzel");
                }
            }, {
                title: "Ne Guzel",
                click: function () {
                    alert("Ne Guzel");
                }
            }, {
                title: "Ne Guzel",
                click: function () {
                    alert("Ne Guzel");
                }
            }]
        });

        map.addLayer(marker);
    }
};

App.initialize();