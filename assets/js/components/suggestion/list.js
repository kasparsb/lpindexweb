/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-13
* Time: 10:58 PM
* Search suggestions list
*/
define(['react', 'components/suggestion/single'], function(React, Suggestion) {
    return React.createClass({
        displayName: 'SuggestionList',
        
        /**
         * Current selected suggestion in list
         */
        _current: -1,

        handleClick: function( item ) {
            this.props.onClick( item );
        },

        /**
         * Move to previous suggestion
         */
        prev: function() {
            this._current--;
            this._validateCurrent();
            this._selectItem(this._current);
        },

        /**
         * Move to next suggestion
         */
        next: function() {
            this._current++;
            this._validateCurrent();
            this._selectItem(this._current);
        },

        clickSelected: function() {
            this.$items.find('.selected').click();
        },

        _validateCurrent: function() {
            if ( this._current < 0 )
                this._current = 0;
            if ( this._current >= this.props.items.length )
                this._current = this.props.items.length-1;
        },

        /**
         * Select item from list by index
         */
        _selectItem: function( index ) {
            // Unselect
            this.$items.find('.selected').removeClass('selected');
            // Select
            this.$items.find('.item:eq('+index+')').addClass( 'selected' );
        },

        componentDidMount: function() {
            this.$items = $( this.refs.items.getDOMNode() );
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
                        ref: 'items',
                        className: 'suggestions'
                    },
                    items
                )
            );
        }
    });
});