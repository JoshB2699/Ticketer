import React from 'react';

var Toolbar = React.createClass({
    render: function() {
    return(
        <div id="toolbar">
            <p>
            <a href="/">Home</a>
            <a href="../image_selector">Images</a>
            <a href="../games">Games</a>
            </p>
        </div>
        )
    }
})

export default Toolbar;
