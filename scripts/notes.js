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
        fullString += content[i]
      }
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
  Update tree with new info
  */
  Update_Tree = function(listData) {
    // build the data array
    var dataArray = []

    //for (var i = listData.length; i >= 0; i--) {
    for (var i = 0; i < listData.length; i++) {
      // for notebook objects
      if (listData[i] instanceof notebookMngr.objNotebook) {
        var newItem = {
          "id" : listData[i].notebook_id,
          "parent" : "#",
          "text" : listData[i].notebook_name
        }
        console.log(newItem);
        dataArray.push(newItem)

      // for note objects
      } else if (listData[i] instanceof notebookMngr.objNote) {
        var newItem = {
          "id" : listData[i].noteId,
          "parent" : listData[i].refNotebookId,
          "text" : listData[i].noteName
        }
        dataArray.push(newItem)
      }
    }

    $('#jstree_demo_div').jstree({ 'core' : {
        'data' : dataArray
    } });
    // $('#jstree_demo_div').jstree({ 'core' : {
    //     'data' : [
    //        {  "id" : "ajson1", "parent" : "#", "text" : "History" },
    //        {  "id" : "ajson2", "parent" : "#", "text" : "Science" },
    //        {  "id" : "ajson3", "parent" : "ajson2", "text" : "11/16" },
    //        {  "id" : "ajson4", "parent" : "ajson2", "text" : "11/17"},
    //     ]
    // } });
  }

  /*
  Save the notes when the user clicks the save button
  */
  $('.btnSaveNotes').on('click', function() {
    var myNotes = Get_Notes('string')
    Highlight_Notes(0, 'question')
    Highlight_Notes(2, 'answer')
    Highlight_Notes(4, 'answer')

    notebookMngr.DB_Save_Note(myNote)
  })

  $('.btnSaveNotes').on('dblclick', function() {
    Unhighlight_All_Notes();

    notebookMngr.DB_Delete_Note(myNote)
  })

  $('.btnSaveNotesAs').on('click', function() {
    // get the currently selected notebook in the tree
    var selected = $('#jstree_demo_div').jstree('get_selected')
  })

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
//console.log(data);
//console.log(e);
    if (data.action === 'select_node') {
      //check if it's a note, if it is open it!
      if (data.selected[0].substring(0,2) === "NT") {
        //save the content first if the node changed
        if (currentSelectedNodeID !== data.selected[0] &&
            currentSelectedNodeID !== "") {
console.log('here!!!!!!!!!!!!!!' + currentSelectedNodeID);
          var noteToUpdate = notebookMngr.DB_Get_Note(currentSelectedNodeID)
console.log(Get_Notes('string'));
          noteToUpdate.notes = Get_Notes('string');
          notebookMngr.DB_Save_Note(noteToUpdate)
        }

        var noteToOpen = notebookMngr.DB_Get_Note(data.selected[0])
  //console.log(data.selected[0]);
        Put_Notes(noteToOpen.notes)
        currentSelectedNodeID = data.selected[0];
      }
    }
  });


  var notebookMngr = new Notebook_Mngr();
  var currentSelectedNodeID = "";

  // var myBook1 = new notebookMngr.objNotebook();
  // myBook1.notebook_id = "NB0";
  // myBook1.notebook_name = "Book 1";
  // notebookMngr.DB_Save_Notebook(myBook1)
  //
  // var myNote = new notebookMngr.objNote();
  // myNote.noteId = "N0";
  // myNote.refNotebookId = "NB0";
  // myNote.noteName = "Note 1";
  // myNote.notes = "My big long notes!!!!";
  // notebookMngr.DB_Save_Note(myNote)
  //
  // var myNote1 = new notebookMngr.objNote();
  // myNote1.noteId = "N1";
  // myNote1.refNotebookId = "NB0";
  // myNote1.noteName = "Note 2";
  // myNote1.notes = "My big long notes!!!!";
  // notebookMngr.DB_Save_Note(myNote1)

  var fullList = notebookMngr.DB_Get_Full_List();
  Update_Tree(fullList)
  console.log(fullList);

});
