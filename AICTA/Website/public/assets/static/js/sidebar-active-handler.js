$(document).ready(function() {
    $('.menu').click(function() {
      // Remove the "active" class from all sidebar elements
      $('.menu').removeClass('active');
      
      // Add the "active" class to the clicked element
      $(this).addClass('active');
      
    });


});