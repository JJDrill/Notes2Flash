var Dictionary_Mngr = function() {

  var ditionaryURL = "https://montanaflynn-dictionary.p.mashape.com/define?"

  this.Get_Definition = function(word) {
    $.ajax({
      url: ditionaryURL, // The URL to the API. You can get this in the API page of the API you intend to consume
      type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
      data: {"word": word}, // Additional parameters here
      dataType: 'json',
      success: function(data) {
        console.log(data);
        //console.dir((data.source));
      },
      error: function(err) { console.log(err); },
      beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Mashape-Authorization", "EniIzr5ONgmshxNnNZiqaMtH4029p1vX4R0jsnHNf3brDzQnlJ"); // Enter here your Mashape key
    }
  });
  }

}
