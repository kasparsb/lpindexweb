/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-08
* Time: 07:58 PM
* To change this template use Tools | Templates.
*/
define([
    'jquery',
    'underscore',
    'react',
    'env',
    'components/map/map',
    'components/search',
    'components/cover',
    'components/poststationinfo',
    'components/header',
], 
function($, _, React, Env, Map, Search, Cover, PostStationInfo, Header) {
    
return React.createClass({
    displayName: 'SearchApp',

    // Search field width
    maxWidth: 600,
    x: 0,
    y: 0,
    // Top pozīcija, kad novietots ar meklēšanas rezultātiem
    top: 30,

    // Header vēl nav noslēpts
    _headerVisible: true,
    
    /**
     * Centrējam search lauku pa x asi (horizontāli)
     */
    _centerX: function() {
        if ( Env.window.width <= 600 ) {
            this.x = 0;
        }
        else {
            this.x = Env.window.width / 2 - this.maxWidth / 2;
        }
    },
    _centerY: function() {
        this.y = Math.round( Env.window.height*0.2 );
    },
    _applyPosition: function() {

        var headerTop = Math.round( this.y / 2 - this.$header.height() / 2 );
        
        // Uzstādām aprēķinātās x, y koordināted
        this.$search.css({
            transform: 'translateX('+this.x+'px) translateY('+this.y+'px)'
        });
        this.$poststation.css({
            transform: 'translateX('+this.x+'px) translateY('+this.top+'px)'
        });
        this.$header.css({
            transform: 'translateY('+headerTop+'px)'
        });

        // Forcefeed initial state to velocity
        $.Velocity.hook( this.$search, 'translateX', this.x+'px' );
        $.Velocity.hook( this.$search, 'translateY', this.y+'px' );
        
        $.Velocity.hook( this.$poststation, 'translateX', this.x+'px' );
        $.Velocity.hook( this.$poststation, 'translateY', this.top+'px' );
        
        $.Velocity.hook( this.$header, 'translateY', headerTop+'px' );
        $.Velocity.hook( this.$header, 'opacity', 1 );
        $.Velocity.hook( this.$header, 'scale', 1 );
        $.Velocity.hook( this.$header.find('.title'), 'fontSize', '25px' );
    },
    _showSuggestions: function() {
        this.$suggestions.css({
            display: 'block'
        });
        this.$suggestions.velocity({
            opacity: 1,
            translateY: 0
        }, {
            duration: 200
        })
    },
    _hideSuggestions: function() {
        this.$suggestions.hide();
    },
    _animateHeader: function() {
        if ( this._headerVisible ) {
            
            this._headerVisible = false;
            
            this.$header.velocity({
                translateY: '5px'
            }, {
                duration: 200
            });
            
            this.$header.find('.title').velocity({
                fontSize: '16px'
            }, {
                duration: 200
            })
        }
    },
    /**
     * Search lauka sākuma pozīcija
     */
    initialPosition: function() {
        this._centerX();
        this._centerY();

        this._applyPosition();
    },
    /**
     * Nopozicionējam search lauku priekš meklēšanas rezultātu izvadīšanas
     */
    positionForSearchResults: function() {
        var mthis = this;

        this.$search.velocity({
            translateY: this.top
        }, {
            duration: 200,
            complete: function(){

            }
        } );
        
        this._animateHeader();
    },

    handleSuggestions: function( suggestionsCount ) {
        
        this.positionForSearchResults();
        
        if ( this.$poststation.is(':visible') ) {
            this._hideSuggestions();
        }
        else {
            if ( suggestionsCount > 0 ) {
                this._showSuggestions();
                this._animateHeader();
            }
            else
                this._hideSuggestions();
        }
    },
    
    /**
     * Lietotājs izvēlējies savu meklēto vietu
     * Vietas apraksts un vietai piesaistītā pasta stacija
     */
    handlePlaceSelect: function( place ) {
        this.setState({
            poststation: place
        });
        
        this.refs.search.blur();
        /**
         * Kad defokusējam search lauku, tad čekojam, lai window scroll top būtu 0
         * iPhone 4 gadījumā scroll top mainās
         */
        Env.checkWindowScrollForTop();
        this.$poststation.show();
        this.refs.map.exposePlace( place );
        
        this.hideCover();
    },
    
    handleBeforeSearch: function() {
        
    },
    
    handlePostStationInfoClose: function( poststation ) {
        this.refs.search.cleanUp();
        this.refs.search.focus();
        this.refs.map.openInfoWindow( poststation );
        this.$poststation.hide();
    },
    
    /**
     * Lietotāja click uz poststation marker
     */
    handleMapPlaceSelect: function( poststation ) {
        this.handlePlaceSelect( poststation );
    },

    componentDidMount: function() {
        this.$cover = $( this.refs.cover.getDOMNode() );
        this.$search = $(this.refs.search.getDOMNode());
        this.$suggestions = $( this.refs.search.refs.suggestions.getDOMNode() );
        this.$poststation = $( this.refs.poststation.getDOMNode() );
        this.$header = $( this.refs.header.getDOMNode() );

        // Nopozicionējam
        this.initialPosition();

        $.Velocity.hook( this.$cover, 'opacity', 1 );

        $.Velocity.hook( this.$suggestions, 'opacity', 0 );
        $.Velocity.hook( this.$suggestions, 'translateY', '-20px' );

    },
    
    getInitialState: function() {
        return {
            poststation: false
        }
    },

    hideCover: function() {
        this.$cover.velocity({
            opacity: 0
        }, {
            duration: 100,
            complete: _.bind( function(){
                this.$cover.css({
                    display: 'none'
                })
            }, this )
        });
    },

    render: function() {
        return React.DOM.div( { className: 'app' },
            React.createElement( Cover, { ref: 'cover' } ),
            React.createElement( Map, {
                ref: 'map',
                onMarkerSelect: _.bind( this.handleMapPlaceSelect, this )
            } ),
            React.createElement( Search, {
                ref: 'search',
                // Pirms sāk meklēt vietas pēc lietotāja ievadītās adreses
                onBeforeSearch: _.bind( this.handleBeforeSearch, this ),
                // Ielādēti meklēšnas rezultāti
                onSuggestionsListUpdate: _.bind( this.handleSuggestions, this ),
                // Lietotājs izvēlējies konkrētu vietu
                onPlaceSelect: _.bind( this.handlePlaceSelect, this ),
                
            } ),
            React.createElement( PostStationInfo, { 
                ref: 'poststation',
                onClose: _.bind( this.handlePostStationInfoClose, this ),
                item: this.state.poststation
            } ),
            React.createElement( Header, { ref: 'header' } )
        );
    }
})  
    
});