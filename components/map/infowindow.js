/**
* Google maps info window
* User: kasparsb
* Date: 2015-02-21
* Time: 09:56 PM
* To change this template use Tools | Templates.
*/
define(['jquery'], function($){

    function getMarkUp() {
        return  $('<div class="poststation-infowindow" />').append(
            $('<p />')
        ).get(0);
    }

    function setTitle( title ) {
        $('.poststation-infowindow p').html( title );
    }

    var infoWindow = new google.maps.InfoWindow({
        content: getMarkUp()
    })

    // Public API
    return {
        open: function( map, marker, title ) {
            infoWindow.open( map, marker )
            setTitle( title )
        },
        close: function() {
            infoWindow.close();    
        }
    }
})