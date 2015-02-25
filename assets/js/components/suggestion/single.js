/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-13
* Time: 10:58 PM
* Single suggestion for suggestions list
*/
define(['react'], function(React) {
    return React.createClass({
        displayName: 'SuggestionSingle',
        handleClick: function() {
            this.props.onClick( this.props.item );
        },
        render: function() {
            return (
                React.DOM.div( 
                    { 
                        className: 'item',
                        onClick: _.bind( this.handleClick, this )
                    },
                    this.props.item.full
                )
            );
        }
    });
});