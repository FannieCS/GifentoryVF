/* Insère le menu dans les pages */
$.get("nav.html", function(data){
    $("#nav").replaceWith(data);
});


function displayGalerieTri() {
  $.post("/tri-affich", function (jsondoc) {
    if (jsondoc[0].tag) {
      for (var i=0; i<jsondoc.length; i++) {
        var division = '<section class="liste"><div class="container"><img class="gifthumbnail liste" src=' +jsondoc[i].link+' alt=""></div><p>Lien : <a href="'+jsondoc[i].link+'">'+jsondoc[i].link+'</a><br/>Tags : '+jsondoc[i].tag+'<br/>Nombre de fois utilisé : '+jsondoc[i].clicks+'<br/>Utilisé pour la dernière fois : '+jsondoc[i].lastUse+'<br/>Ajout : '+jsondoc[i].added+'<br/></p></section>';
        $("#galerie").append(division);
      }
    }
    else {
      for (var i=0; i<jsondoc.length; i++) {
      $("#added").append('<img class="gifthumbnail" src=' +jsondoc[i].link+' alt="">');
      }
    }
  });
}

$("#galerie").on("click", ".gifthumbnail", function(evt){
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



displayGalerieTri();