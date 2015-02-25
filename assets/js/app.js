requirejs.config({
    // Sadefinējam vendorus
    paths: {
        jquery: 'vendor/jquery' ,
        react: 'vendor/react',
        backbone: 'vendor/backbone',
        underscore: 'vendor/underscore',
        velocity: 'vendor/velocity',
        markerclusterer: 'vendor/markerclusterer'
    },
    urlArgs: 'r=' + (new Date()).getTime(),
});

define(['jquery', 'react', 'env', 'components/main'], function($, React, Env, Main) {
    
    var App = {
        
        _revealAnimInProgress: false,
        
        init: function() {
            // Attālums no apakšas. Vieta priekš scroll more button
            // Keep in syns with .content .reveal
            this.bottomPadding = 50;

            // Container, kurā liksim app
            this.$container = $('body>.doc');
            this.$content = $('body>.content');
            
            this.$revelaButton = $('body>.content .reveal');

            this.sizeContainer();

            this.setEvents();

            React.render(
                React.createElement( Main, null ),
                this.$container.get(0)
            );    
        },

        setEvents: function() {
            // Klausāmies window resize eventu. Env uzstāda vienu window resize eventu un izpilda to reizi 50ms
            Env.on( 'windowresize', this.sizeContainer, this );
            
            //Env.on( 'windowscroll', this.handleRevelVisibility, this );
        },

        /**
         * Resaizojam container atkarībā no pieejamā ekrāna augstuma
         */
        sizeContainer: function() {
            var ch = Env.window.height;
            this.$container.css({
                height: ch
            });
            this.$content.css({
                marginTop: ch// - this.bottomPadding
            })
        },
        
        /**
         * Content reavel button visibility
         * When user has scrolled little bit fade out revela button
         */
        handleRevelVisibility: function( scrollTop ) {
            this._revealAnimation( scrollTop <= 2 );
            
        },
        
        _revealAnimation: function( visible ) {
            if ( this._revealAnimInProgress )
                return;
                
            if ( this._revealVisible == visible )
                return;

            this._revealAnimInProgress = true;

            this.$revelaButton.velocity({
                translateY: visible ? 0 : 50
            }, {
                duration: 100,
                complete: _.bind(function() {
                    this._revealAnimInProgress = false;
                    this._revealVisible = visible
                }, this )
            } );
        }
    }
    
    // When DOM ready fire up
    $(function(){
        Env.init();
        App.init();
    });
    
});