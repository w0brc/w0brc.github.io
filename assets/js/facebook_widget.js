if (window.location.pathname === '/') {
    function loadFacebookWidget() {
       (function(d,s,id) {
            var js,fjs = d.getElementsByTagName(s)[0];
            if(d.getElementById(id)){return;}
            js=d.createElement(s);
            js.id=id;
            js.async=true;
            js.defer=true;
            js.src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0";
            fjs.parentNode.insertBefore(js,fjs);
       }
       (document, "script", "facebook-jssdk")
       );
    };

    window.onload = loadFacebookWidget();
}
