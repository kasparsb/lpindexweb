/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-08
* Time: 07:45 PM
* To change this template use Tools | Templates.
*/
define([
    'jquery', 
    'underscore', 
    'env',
    'velocity', 
    'components/suggestion/list'
], 
function(
    $, 
    _, 
    Env,
    Velocity,
    SuggestionsList 
) {
    
    return React.createClass({
        displayName: 'SearchBox',
        /**
         * Initial state
         */
        getInitialState: function() {
            return {
                suggestions:  []
            }
        },
        searchKeyPress: function(ev) {
            if ( ev.key == 'Enter' ) {
                this.props.onBeforeSearch();
                this.loadSuggestions();
            }
        },
        /**
         * Ielādējam suggestions
         */
        loadSuggestions: function() {
            $.get( 'http://pad.dyndns.org/lpindex/app/search/', {
                q: $( this.refs.search.getDOMNode() ).val()
            }, _.bind( function( response ) {
                // Papildinām katru item ar property full
                for ( var i in response.results )
                    if ( typeof response.results[i].full == 'undefined' )
                        response.results[i].full = '';
                
                if ( response.results.length == 1 && response.results[0].index )
                    this.handleSelectedSuggestion( response.results[0] );
                
                this.setState({ 
                    suggestions: response.results 
                });
            }, this ), 'json' );
        },
        handleSelectedSuggestion: function( item ) {
            
            $( this.refs.search.getDOMNode() ).val( item.full );
            
            if ( item.index == '' ) {    
                this.loadSuggestions();
            }
            else {
                this.props.onPlaceSelect( item );
            }
        },
        /**
         * Notīrām meklēšanas frāzi
         */
        cleanUp: function() {
            $( this.refs.search.getDOMNode() ).val('')
        },
        focus: function() {
            this.refs.search.getDOMNode().focus();
        },
        blur: function() {
            this.refs.search.getDOMNode().blur();  
        },
        componentDidUpdate: function() {
            this.props.onSuggestionsListUpdate( this.state.suggestions.length );
        },
        render: function() {
            return (
                React.DOM.div( 
                    { className: 'search-box' },
                    React.DOM.input( { 
                        type: 'text', 
                        ref: 'search',
                        placeholder: 'Ievadiet adresi',
                        onKeyDown: this.searchKeyPress 
                    } ),
                    React.DOM.span( { className:' ico' }, React.DOM.i( { className: 'fa fa-search' } ) ),
                    React.createElement( 
                        SuggestionsList, 
                        { 
                            ref: 'suggestions',
                            items: this.state.suggestions,
                            // Lietotājs izvēlas vienu piedāvātajiem suggestions
                            onClick: _.bind( this.handleSelectedSuggestion, this )
                        } )
                )
            );
        }
    });
});