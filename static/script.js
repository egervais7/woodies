$(document).ready(function(){

// set up a delete path for user to delete tool from their table
  $(".del-btn").click(function(e){
    e.preventDefault();
    var url = $(this).attr("href");
    var id = $(this).attr("id");
    if (confirm("Do You really want to remove this tool?")) {
      $.ajax({
        url: url,
        method: 'DELETE',
        data: {id: id},
        success: function(data, status, obj) {
          alert('Deleted Tool');
          window.location.reload(true);
        },
        error: function(err, status, message) {
          console.log(err, status, message);
        }
      });
    } else {
      return;
    }
  });
});
