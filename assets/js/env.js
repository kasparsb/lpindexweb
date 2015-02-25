/**
* Created with React start.
* User: kasparsb
* Date: 2015-02-12
* Time: 09:03 PM
* To change this template use Tools | Templates.
*/
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

var o = {
    init: function() {
        this.$w = $(window);
        
        this._windowDimensions();
        this._windowScrollPosition();
        this._setEvents();
    },
    _setEvents: function() {
        var mthis = this;
        
        this.$w.resize( _.debounce( function(){
            // Nolasām window dimensijas
            mthis._windowDimensions();
            // Palaižam eventu
            mthis.trigger( 'windowresize', mthis.window )
        }, 50 ) );
        
        this.$w.scroll( _.debounce( function(){
            mthis._windowScrollPosition();
            mthis.trigger( 'windowscroll', mthis.windowScrollTop )
        }, 50 ) )
    },
    /**
     * Read window dimensions
     */
    _windowDimensions: function() {
        this.window = {
            width: this.$w.width(),
            height: this.$w.height()
        } 
    },
    _windowScrollPosition: function() {
        this.windowScrollTop = this.$w.scrollTop();
    },
    
    /**
     * Čekojam, lai window scroll top būtu 0
     */
    checkWindowScrollForTop: function() {
        var checkTop = _.bind( function() {
            if ( this.windowScrollTop > 0 ) {
                this.scrollToTop();
                return true;
            }
            return false;
        }, this );
        
        if ( !checkTop() ) {
            // Drošības pēc ja nav 0, tad pēc dažām milisekundēm nočekojam vēlreiz
            _.delay( checkTop, 50 )
        }
    },
    
    scrollToTop: function() {
        this.$w.scrollTop( 0 );
    }
}

return _.extend( o, Backbone.Events );

});