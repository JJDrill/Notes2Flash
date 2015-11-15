$(function(){

  /*
  Get all the content from the note text area
  */
  Get_Notes = function(contentType) {
    if (contentType === 'string') {
      return tinymce.activeEditor.getContent()

    } else if (contentType === 'array') {
      return tinymce.activeEditor.getContent().split('\n')

    } else {
      console.log('Content type ' + contentType + 'is not supported!')
    }
  }

  /*
  Puts content into the note text area
  */
  Put_Notes = function(content) {
    if (typeof content === 'string') {
      tinymce.activeEditor.setContent(content)
    } else {
      var fullString = ''
      for (var i = 0; i < content.length; i++) {
        console.log('TEST: ' + content[i]);
        fullString += content[i]
      }
      console.log(fullString);
      tinymce.activeEditor.setContent(fullString)
    }

  }

  /*
  Highlight a given row with a specific color
  */
  Highlight_Notes = function(lineNumber, item) {
    var notesArray = Get_Notes('array')
    var lineElements = $(notesArray[lineNumber])

    if ('question' === item.toLowerCase()) {
      $(lineElements[0]).addClass('highlightQuestion')
    } else if ('answer' === item.toLowerCase()) {
      $(lineElements[0]).addClass('highlightAnswer')
    }

    notesArray[lineNumber] = lineElements[0].outerHTML
    Put_Notes(notesArray)
  }

  /*
  Un-highlight all content
  */
  Unhighlight_All_Notes = function() {
    var notesArray = Get_Notes('array')

    for (var i = 0; i < notesArray.length; i++) {
      var lineElements = $(notesArray[i])

      if (lineElements.length != 0) {
        
        if ($(lineElements[0]).hasClass('highlightQuestion')) {
          $(lineElements[0]).removeClass('highlightQuestion')
        } else if ($(lineElements[0]).hasClass('highlightAnswer')) {
          $(lineElements[0]).removeClass('highlightAnswer')
        }

        notesArray[i] = lineElements[0].outerHTML
      }
    }
    Put_Notes(notesArray)
  }

  /*
  Save the notes when the user clicks the save button
  */
  $('.btnSaveNotes').on('click', function() {
    var myNotes = Get_Notes('string')
    Highlight_Notes(0, 'question')
    Highlight_Notes(2, 'answer')
    Highlight_Notes(4, 'answer')
  })

  $('.btnSaveNotes').on('dblclick', function() {
    Unhighlight_All_Notes();
  })

});
