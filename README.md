## Leaflet Marker Menu Plugin

This plugin adds animated circular menus to your leaflet markers. Unfortunately there is only support for css3 animations.
Please see the <a href="http://umurgdk.github.io/leaflet-marker-menu/demo/index.html" target="_blank">demo page</a>.

![Leaflet Marker Menu Demo Screenshot](https://raw.github.com/umurgdk/leaflet-marker-menu/master/demo/ss.png)

###Usage

```js
var marker = L.marker([-33.4373, -70.6437]);
marker.setMenu({
    radius: 75,                        // radius of the circle,
    size: [24, 24],                    // menu items width and height
    animate: true,                     // [OPTIONAL] default true
    duration: 200,                     // [OPTIONAL] animate duration defaults 200ms

    items: [{
        title: "Menu Item 1",          // [OPTIONAL] will be link's title attribute
        className: "extra-class",      // [OPTIONAL] you can add your css classes
        click: function () {           // callback function fired on click. this points to item
            console.log("Menu Item 1");
        }
    }, {
        title: "Menu Item 2",
        className: "extra-class red-circle"
        click: function () {
            console.log("Menu Item 2");
        }
    }]
});

// You can open menus programmatically
marker.openMenu();

// or close
marker.closeMenu();

// You can remove them
marker.removeMenu();

// You can get the menu object
var menu = marker.getMenu();

// and you can add items to it
menu.append([{
    title: 'another',
    click: function () {
        console.log('another');
    }
}]);

menu.hide() // hide (display: none)
menu.show() // show (display: block)

// You can create menu's separated from marker
var menu2 = L.markerMenu({
    radius: 75,                        
    size: [24, 24],                    
    animate: true,                     
    duration: 200,                     

    items: [{
        title: "Menu Item 1",          
        className: "extra-class",      
        click: function () {           
            console.log("Menu Item 1");
        }
    }]
});

// and you can add them to markers
marker.setMenu(menu2);
```
