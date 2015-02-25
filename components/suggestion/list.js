/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-13
* Time: 10:58 PM
* Search suggestions list
*/
define(['components/suggestion/single'], function(Suggestion) {
    return React.createClass({
        displayName: 'SuggestionList',
        handleClick: function( item ) {
            this.props.onClick( item );
        },
        render: function() {
            var mthis = this;
            
            var items = this.props.items.map(function (item) {
                return React.createElement( Suggestion, {
                    item: item,
                    onClick: _.bind( mthis.handleClick, mthis )
                } );
            });
            return (
                React.DOM.div( 
                    {
                        className: 'suggestions'
                    },
                    items
                )
            );
        }
    });
});