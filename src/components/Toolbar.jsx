import React from 'react';

var Toolbar = React.createClass({
    render: function() {
    return(
        <div id="toolbar">
            <a href="/"><img src = "./public/images/home.ico" height = "32" width = "32"/></a>
            <l> </l>
            <a href="/login"> <l>Login</l></a>
            <l> </l>
            <l><a href="/ticketform">Create new form</a></l>
        </div>
        )
    }
})

export default Toolbar;
