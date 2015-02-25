/**
* Welcome text for lpindex search
* User: kasparsb
* Date: 2015-02-21
* Time: 09:18 PM
* To change this template use Tools | Templates.
*/
define(['react'], function(React) {
    return React.createClass({
        displayName: 'Welcome',
        render: function() {
            return React.DOM.header(
                { className:'welcome' },
                
                React.DOM.h1({ 
                    className: 'title' 
                }, 'Latvijas Pasta indeksu meklētājs')
            )
        }
    });
});