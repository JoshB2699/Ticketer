import React from 'react';

var Toolbar = React.createClass({
    render: function() {
    return(
        <div id="toolbar">
                <a href="/"><img src = "./public/images/home.ico" height = "32" width = "32"/></a>
                <a href="/login"><l> Login</l></a>
        </div>
        )
    }
})

export default Toolbar;
