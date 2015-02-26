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
    'react',
    'env',
    'velocity', 
    'components/suggestion/list'
], 
function(
    $, 
    _, 
    React,
    Env,
    Velocity,
    SuggestionsList 
) {
    
    return React.createClass({
        displayName: 'SearchBox',

        _lastSearchPhrase: '',

        /**
         * Initial state
         */
        getInitialState: function() {
            return {
                suggestions:  []
            }
        },
        searchKeyPress: function(ev) {
            // If keyTypeHandlers found apropriate handler for current key, then it return true
            if ( !this.keyTypeHandlers.execute.call( this, ev ) ) {

                // No specific handler for key type found, so we can execute search
                var search = _.bind( function(){
                    var s = this.getSearchPhrase();

                    // Search only if user has changed search phrase
                    if ( s !== this._lastSearchPhrase ) {
                        this._lastSearchPhrase = s;
                        
                        this.startLoadSuggestions()
                    }
                }, this );

                // Delay search for next execution cycle, to get search field input
                _.delay( search, 1 )
            }
        },
        /**
         * Pressed key type handlers. Here are defined function for every key type we need to handle
         */
        keyTypeHandlers: {
            execute: function( ev ) {
                if ( typeof this.keyTypeHandlers[ev.key] == 'function' ) {
                    ev.preventDefault();
                    this.keyTypeHandlers[ev.key].call( this );
                    return true;
                }
            },
            ArrowDown: function() {
                this.refs.suggestions.next();
            },
            ArrowUp: function() {
                this.refs.suggestions.prev();
            },
            Enter: function() {
                this.refs.suggestions.clickSelected();
            }
        },
        startLoadSuggestions: function() {
            this.props.onBeforeSearch();
            this.loadSuggestions();
        },
        /**
         * Atgriežam ievadīto meklēšanas frāzi
         */
        getSearchPhrase: function() {
            return $( this.refs.search.getDOMNode() ).val();
        },
        /**
         * Ielādējam suggestions
         */
        loadSuggestions: function() {
            var s = this.getSearchPhrase();

            // Update suggestions in state
            var setSuggestions = _.bind( function( d ){
                this.setState({ 
                    suggestions: d
                });
            }, this );

            // Ja nav ievadīta search frāze, tad nemeklējam
            if ( s == '' )
                setSuggestions([]);
            else
                $.get( 'http://pad.dyndns.org/lpindex/app/search/', {
                    q: s
                }, _.bind( function( response ) {
                    
                    // Papildinām katru item ar property full
                    for ( var i in response.results )
                        if ( typeof response.results[i].full == 'undefined' )
                            response.results[i].full = '';
                    
                    if ( response.results.length == 1 && response.results[0].index )
                        this.handleSelectedSuggestion( response.results[0] );
                    
                    setSuggestions( response.results );

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