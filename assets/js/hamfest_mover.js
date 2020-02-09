if (window.location.pathname === '/') {
    $.ajax({
        url:'/blog/2019/10/13/hamfest-2020-announcement',
        type:'GET',
        success: function(data){
            $('#hamfest-title').html($(data).find('#post-title').html());
            $('#hamfest-content').html($(data).find('#markdown-content-container').html());
            //fix the top of the element so it stops overlapping with content above it
            //$('#hamfest-title').addClass('remove-block');
        }
    });
}
