jQuery(document).ready(function() {
    
    $(".card").flip();
    var height =  $(".card").outerHeight();
    $(".card").flip().height(height);
    
})