var App = {
    initialize: function () {
        var map = new L.Map('map');

        map.setView(new L.LatLng(40.990475, 29.029183), 15);
        map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

        var marker = L.marker([40.990475, 29.029183]);

        marker.setMenu({
            radius: 75,

            items: [{
                title: "Menu 1",
                click: function () {
                    alert("Menu 1");
                }
            }, {
                title: "Ozel Menu",
                className: 'item-2',
                click: function () {
                    alert("I have a special class");
                }
            }, {
                title: "Another one!",
                click: function () {
                    alert("Wohoo there is too much!");
                }
            }, {
                title: "Another meh!",
                click: function () {
                    alert("Another meh!");
                }
            }, {
                title: "Im get boring!",
                click: function () {
                    alert("don't!");
                }
            }]
        });

        map.addLayer(marker);
    }
};

App.initialize();