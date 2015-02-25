/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-08
* Time: 06:52 PM
* To change this template use Tools | Templates.
*/
define(['react', 'components/map/infowindow', 'markerclusterer'], function(React, InfoWindow, MC) {
    return React.createClass({
        displayName: 'CommentBox',
        
        /**
         * Collection of markers in map
         */
        markers: [],

        /**
         * Poststation map marker
         */
        postStationMarker: new google.maps.MarkerImage(
            'assets/images/marker.png', null, null, null, 
            new google.maps.Size( 29, 37 ) // Actual image is twice the size
        ),
        
        componentDidMount: function() {
            this.createMap();
            this.loadPoststations();
            this.setEvents();
        },
        createMap: function() {
            var options = {
                center: new google.maps.LatLng(57.853520561214154, 23.983154296875),
                zoom: 8
            };
            this.map = new google.maps.Map( this.getDOMNode(), options );
            
            // Pēc panTo(izvēlētā marker pozīcija). Nobīdam centru uz leju, lai tas nav zem poststationinfo loga
            this._wasPanTo = false;
            google.maps.event.addListener(this.map, 'center_changed', _.bind( function() {
                if ( this._wasPanTo ) {
                    this._wasPanTo = false;
                    
                    _.delay( _.bind( function(){
                        this.map.panBy( 0, -100 );
                    }, this ), 100 );
                    
                }
            }, this ));
            
            this._fitMap();
        },
        loadPoststations: function() {
            var mthis = this;
            $.get( 'http://pad.dyndns.org/lpindex/app/poststations/', function(r){
                _(r).each(function(s){
                    mthis.addPoststation(s);
                });
                
                mthis.createMarkerCluster();
            }, 'json' );
        },
        /**
         * Iecentrējam karti, tā lai visa Latvija redzama
         */
        _fitMap: function() {
            var southWest = new google.maps.LatLng(56.19142449275458, 21.4068603515625);
            var northEast = new google.maps.LatLng(58.013917869866205, 27.2186279296875);
            var bounds = new google.maps.LatLngBounds(southWest, northEast);
            
            this.map.fitBounds( bounds );
        },
        setEvents: function() {
            /*google.maps.event.addListener( this.map, 'click', function(position) {
                console.log(position.latLng.lat()+', '+position.latLng.lng());
            });*/
        },
        createMarkerCluster: function() {
            // Savācam masīvu ar markeriem
            var markers = [];
            _(this.markers).each(function(m){
                markers.push( m.marker );
            });
            this.mc = new MarkerClusterer(this.map, markers);
        },
        addMarker: function( place, lat, lng ) {
            
            
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng( lat, lng ),
                //map: this.map,
                draggable: false,
                icon: this.postStationMarker
            });
            
            google.maps.event.addListener( marker, 'click', _.bind( function() {
                this.markerSelected( this.getMarker( marker ) );
            }, this ));
            
            this.markers.push({
                place: place,
                marker: marker
            });
        },
        markerSelected: function( marker ) {
            InfoWindow.close();
            this.props.onMarkerSelect( marker.place )
        },
        getMarker: function( m ) {
            return _( this.markers ).find(function(d){
                return ( d.marker == m )
            });
        },
        /**
         * Find marker by poststation index
         */
        findMarker: function( index ) {
            return _( this.markers ).find(function(d){
                return ( d.place.index == index )
            });
        },
        addPoststation: function( data ) {
            this.addMarker( data, data.lat, data.lng );
        },
        exposePlace: function( markerData ) {
            var m = this.findMarker( markerData.index );
            
            // Zoom into place
            this._wasPanTo = true;
            this.map.panTo( new google.maps.LatLng( m.place.lat, m.place.lng ) )
            this.map.setZoom( 16 )
        },
        openInfoWindow: function( place ) {
            InfoWindow.open( this.map, this.findMarker( place.index ).marker, place.poststation_caption )
        },
        render: function() {
            return (
                React.DOM.div( { className: "map-container" } )
            );
        }
    });
});