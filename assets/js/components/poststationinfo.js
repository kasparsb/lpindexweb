/**
* Post station full info
* User: kasparsb
* Date: 2015-02-20
* Time: 08:59 PM
*/
define(['react'], function(React) {
    return React.createClass({
        displayName: 'PostStationInfo',
        closeClick: function() {
            this.props.onClose( this.props.item );
        },
        render: function() {
            
            return React.DOM.div( 
                { className: 'poststationinfo' },

                // Close icon
                React.DOM.span( 
                    { 
                        className:' ico',
                        onClick: _.bind( this.closeClick, this )
                    }, 
                    React.DOM.i( { className: 'fa fa-times' } ) 
                ),
                // Searched phrase (place). The one which user entered into search field
                React.DOM.div(
                    {className: 'item search-phrase'},
                    this.props.item.full
                ),
                // Post station caption
                React.DOM.h1(
                    {className: 'item title'},
                    this.props.item.poststation_caption
                ),
                React.DOM.h2(
                    {className: 'item title'},
                    this.props.item.index
                ),
                // Post station address
                React.DOM.div(
                    {className: 'item address'},
                    this.props.item.poststation_address
                ),
                // Lat Long
                React.DOM.div(
                    {className: 'item coords'},
                    React.DOM.span( {className:'ico'}, React.DOM.i( {className: 'fa fa-map-marker'} )),
                    this.props.item.lat+', '+this.props.item.lng
                )
            )
        }
    });
});