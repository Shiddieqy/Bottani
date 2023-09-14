$(document).ready(function() {
    $('.sidebar-item').click(function() {
      console.log("menu is clicked")
      // Remove the "active" class from all sidebar elements
      $('.sidebar-item').removeClass('active');
      
      // Add the "active" class to the clicked element
      $(this).addClass('active');
      
    });


});

console.log("sidebar-active-handler.js loaded")

const chartMenuAnchor = document.getElementById("chart-menu-anchor")

chartMenuAnchor.addEventListener('click', function(event) {
    event.preventDefault()
    const chartMenu = document.getElementById("chart-submenu")
    if(chartMenu.classList.contains("submenu-open")){
      $("#chart-submenu").removeClass("submenu-open")
      $("#chart-submenu").addClass("submenu-closed")
    }
    else{
      $("#chart-submenu").addClass("submenu-open")
      $("#chart-submenu").removeClass("submenu-closed")
    }
})


