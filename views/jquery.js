{
  /* <div id="loading-animation" class="text-center mt-5">
            <!-- Custom Loading Animation -->
            <div class="loading-spinner"></div>
            <h3>Loading...</h3>
      </div>
      <div id="content" class="text-center mt-5" style="display: none;"></div> */
}

$(document).ready(function () {
  // Show the loading animation
  $("#loading-animation").fadeIn();

  // Simulate a 3-second delay
  setTimeout(function () {
    // Hide the loading animation
    $("#loading-animation").fadeOut();

    // Show the content
    $("#content").fadeIn();
  }, 100);
});
