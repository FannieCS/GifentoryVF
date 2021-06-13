/* Insère le menu dans les pages */
$.get("nav.html", function(data){
    $("#nav").replaceWith(data);
});

function displayLastUsed() {
  $.get("/utilises", function (jsondoc) {
    for (var i=0; i<jsondoc.length; i++) {
      $("#utilises").append('<img class="gifthumbnail" src=' +jsondoc[i].link+' alt="" >');

    }
  });
}

function displayLastAdded() {
  $.get("/added", function (jsondoc) {
    for (var i=0; i<jsondoc.length; i++) {
      $("#added").append('<img class="gifthumbnail" src=' +jsondoc[i].link+' alt="">');

    }
  });
}


function displayMostUsed() {
  $.get("/most", function (jsondoc) {
    for (var i=0; i<jsondoc.length; i++) {
      $("#most").append('<img class="gifthumbnail" src=' +jsondoc[i].link+' alt="">');

    }
  });
}



displayLastUsed();
displayLastAdded();
displayMostUsed();


$("#utilises").add("#added").add("#most").on("click", ".gifthumbnail", function(evt){
    navigator.clipboard.writeText(evt.target.getAttribute('src'));
    $.ajax({
        url: "/copy",
        type: "POST",
        data: {src: evt.target.getAttribute('src')},
        success: function(data){
            //navigator.clipboard.writeText(evt.target.getAttribute('src'));
            },
        error: function(jqXHR, textStatus, errorThrown) {console.log(errorThrown + " : " + textStatus);}
    });
});


