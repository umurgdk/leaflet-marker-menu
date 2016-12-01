(function () {
    function array_map(array, cb, context) {
        for (var i = 0, l = array.length; i < l; i++) {
            cb.call(context || null, array[i], i, array);
        }
    }

    L.MarkerMenu = (L.Layer ? L.Layer : L.Class).extend({
        includes: L.Mixin.Events,

        options: {
            pane: 'menuPane',
            radius: 100,
            animate: true,
            duration: 200,
            size: [24, 24]
        },

        initialize: function (options, source) {
            L.setOptions(this, options);

            this._items = [];

            // DOM Element represents ul
            this._menuList = null; 

            // DOM Elements array represents li's
            this._menuItems = [];

            this._appendItems(this.options.items);

            this._source = source;
            this._isOpened = false;
        },

        hide: function () {
            this._container.style.display = 'none';
        },

        show: function () {
            this._container.style.display = 'block';
        },

        getItems: function () {
            return this._items;
        },

        append: function (items) {
            if (items instanceof L.MarkerMenu) {
                this._appendItems(items.getItems());
            } else {
                this._appendItems(items);
            }
        },

        getLatLng: function () {
            return this._latlng;
        },

        setLatLng: function (latlng) {
            this._latlng = latlng;

            if (this._map) {
                this._updatePosition();
            }

            return this;
        },

        onAdd: function (map) {
            this._map = map;

            if (!this._container) {
                this._initLayout();
                this._updateMenu();
            }

            map.on('zoomstart', this._onZoomStart, this);
            map.on('zoomend', this._onZoomEnd, this);

            this._updatePosition();

            map.getPanes().markerPane.appendChild(this._container);

            if (this._source) {
                this._source.fire('menuopen', {menu: this});
            }
        },

        onRemove: function (map) {
            var that = this;

            this._resetItemsPositions();

            map.off('zoomstart', this._onZoomStart);
            map.off('zoomend', this._onZoomEnd);

            setTimeout(function () {
                that._map = null;

                map.getPanes().markerPane.removeChild(that._container);

                if (that._source) {
                    that._source.fire('menuclose', {menu: that});
                }
            }, this.options.duration);
        },

        _onZoomStart: function () {
            this.hide();
        },

        _onZoomEnd: function () {
            this._updatePosition();
            this.show();
        },
        
        _appendItems: function (items) {
            array_map(items, function (item) {
                this._items.push(item);
            }, this);

            this._updateMenu();
            this._updatePosition();
        },

        _initLayout: function () {
            var prefix = 'leaflet-marker-menu';
            
            this._container = L.DomUtil.create('div',
                prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-hide');

            this._container.style.zIndex = -1;
            this._container.style.position = 'absolute';
        },

        _updateMenu: function () {
            if (!this._container) {
                return;
            }

            var prefix = 'leaflet-marker-menu-item';

            if (this._menuList) {
                this._container.removeChild(this._menuList);
            }

            this._menuList = L.DomUtil.create('ul', '', this._container);
            this._menuItems = [];

            this._menuList.style.listStyle = 'none';
            this._menuList.style.padding = 0;
            this._menuList.style.margin = 0;
            this._menuList.style.position = 'relative';
            this._menuList.style.width = this.options.size[0] + 'px';
            this._menuList.style.height = this.options.size[1] + 'px';

            array_map(this._items, function (item, i, items) {
                var listItem = L.DomUtil.create('li','', this._menuList),
                    menuItem = L.DomUtil.create('a', prefix + ' ' + (this.options.itemClassName || '') +
                        ' ' + (item.className || ''), listItem);

                menuItem.style.width = this.options.size[0] + 'px';
                menuItem.style.height = this.options.size[1] + 'px';
                menuItem.style.display = 'block';
                menuItem.style.cursor = 'pointer';

                menuItem.title = item.title;

                listItem.style.zIndex = 10000000;
                listItem.style.position = 'absolute';

                // only css3 for a now needs implementation something like PosAnimation for opacity
                if (this.options.animate) {
                    listItem.style.left = 0;
                    listItem.style.bottom = 0;

                    L.DomUtil.setOpacity(listItem, 0);

                    listItem.style[L.DomUtil.TRANSITION] = 'all ' + (this.options.duration / 1000) + 's';
                }

                L.DomEvent.addListener(menuItem, 'click', item.click, item);

                this._menuItems.push(listItem);
            }, this);

            this._menuItems.reverse();
        },

        _resetItemsPositions: function () {
            array_map(this._menuItems, function (item) {
                item.style.left = 0;
                item.style.bottom = 0;

                L.DomUtil.setOpacity(item, 0);
            }, this);
        },

        _updatePosition: function () {
            if (!this._map) {
                return;
            }

            var pos = this._map.latLngToLayerPoint(this._latlng),
                offset = L.point(this.options.offset || [0, 0]),
                container = this._container,
                style = container.style,
                angle = Math.PI / (this._menuItems.length + 1),
                radius = this.options.radius,
                that = this;

            var bottom = this._containerBottom = -offset.y - pos.y;
            var left = this._containerLeft = offset.x + pos.x;

            this._container.style.bottom = (bottom + (this.options.size[1] / 2)) + 'px';
            this._container.style.left = (left - (this.options.size[0] / 2)) + 'px';

            setTimeout(function () {
                array_map(that._menuItems, function (item, i) {
                    var itemLeft = (Math.cos(angle * (i + 1)) * radius),
                        itemBottom = (Math.sin(angle * (i + 1)) * radius) ;

                    item.style.left = Math.round(itemLeft) + 'px';
                    item.style.bottom = Math.round(itemBottom) + 'px';

                    L.DomUtil.setOpacity(item, 1);
                }, this);
            }, 0);
        },

        _resetPosition: function () {
            array_map(this._menuItems, function (item) {
                item.style.left = 0 + 'px';
                item.style.bottom = 0 + 'px';

                L.DomUtil.setOpacity(item, 0);
            }, this);
        }
    });

    L.markerMenu = function (options, source) {
        return new L.MarkerMenu(options, source);
    };

	L.Marker.include({
        openMenu: function () {
            if (!this._menu) {
                return;
            }

            this._menu.setLatLng(this._latlng);
            this._menu._isOpened = true;

            this._map.addLayer(this._menu);
            
            return this;
        },
        
        closeMenu: function () {
            if (!this._menu) {
                return;
            }

            this._map.removeLayer(this._menu);
            this._menu._isOpened = false;
        },
        
        toggleMenu: function () {
            if (!this._menu) {
                return;
            }

            if (this._menu._isOpened) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },
        
        getMenu: function () {
            return this._menu;
        },
        
        setMenu: function (options) {
            if (!options instanceof L.MarkerMenu && options.items.length === 0) {
                return;
            }

            var that = this;
            
            if (this._menu) {
                this.removeMenu();
            }

            if (options instanceof L.MarkerMenu) {
                this._menu = options;
            } else {
                this._menu = L.markerMenu(options, this);
            }
            
            this.on('click', this.toggleMenu, this);
            this.on('move', this._moveMenu, this);
            this.on('remove', this.closeMenu, this);
        },

        removeMenu: function () {
            if (!this._menu) {
                return;
            }

            this.off('click', this.toggleMenu);
            this.off('move', this._moveMenu);
            this.off('remove', this.closeMenu);

            this.closeMenu();
            this._menu = null;
        },

        _moveMenu: function (e) {
            if (!this._menu) {
                return;
            }

            this._menu.setLatLng(this._latlng);
        },
    });
}());
