$(document).ready(function() {

        $('.burger').click(function(){
            $('header').toggleClass('clicked');
        });
    
        $('.headerNav nav ul li').click(function(){
            $('.headerNav nav ul li').removeClass('selected');
            $('.headerNav nav ul li').addClass('notselected');
            $(this).toggleClass('selected');
            $(this).removeClass('notselected');
        });
        
});

