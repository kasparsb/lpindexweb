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

        _searchUrl: 'http://pad.dyndns.org/lpindex/app/search/',

        _lastSearchPhrase: '',

        /**
         * Shoukld we select suggestion if only one suggestion found
         * If case of enter key it is usefull
         */
        _immediatelySelectSingleSuggestion: false,

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
                if ( typeof this.keyTypeHandlers[ev.key] == 'function' )
                    return this.keyTypeHandlers[ev.key].call( this, ev );
            },

            // If methods below returns true, then no search will be executed
            ArrowDown: function(ev) {
                ev.preventDefault();
                this.refs.suggestions.next();
                return true;
            },
            ArrowUp: function(ev) {
                ev.preventDefault();
                this.refs.suggestions.prev();
                return true;
            },
            Enter: function() {
                // If there ir selected suggestion, then click it
                if ( this.refs.suggestions.isSelected() ) {
                    this.refs.suggestions.clickSelected();
                    return true;
                }
                // If suggestions available, then select single
                else if ( this.state.suggestions.length > 0 && this.selectSingleSuggestion() ) {
                    return true;
                }
                else {
                    // After loading suggestions immediately select single suggestion
                    this._immediatelySelectSingleSuggestion = true;
                    return false;
                }
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
            // Avoid paralell running requests
            if ( this._searchRequest )
                this._searchRequest.abort();

            var s = this.getSearchPhrase();

            // Update suggestions in state
            var setSuggestions = _.bind( function( d ){
                // Papildinām katru item ar property full
                for ( var i in d )
                    if ( typeof d[i].full == 'undefined' )
                        d[i].full = '';

                this.setState({ 
                    suggestions: d
                });
            }, this );

            var handleResponse = _.bind( function( response ) {
                this._searchRequest = false;

                setSuggestions( response.results );
                this.checkImmediateSelect();
            }, this );

            // Ja nav ievadīta search frāze, tad nemeklējam un notīrām esošos suggestions
            if ( s == '' )
                setSuggestions([]);
            else
                this._searchRequest = $.get( this._searchUrl, { q: s }, handleResponse, 'json' );
        },
        checkImmediateSelect: function() {
            if ( this._immediatelySelectSingleSuggestion )
                this.selectSingleSuggestion();        
            
            this._immediatelySelectSingleSuggestion = false;
        },
        /**
         * If there is one suggestion then select it and return true
         */
        selectSingleSuggestion: function() {
            if ( this.state.suggestions.length == 1 && this.state.suggestions[0].index ) {
                this.handleSelectedSuggestion( this.state.suggestions[0] );
                return true;
            }
            return false;
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