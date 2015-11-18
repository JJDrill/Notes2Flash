$(function(){
  var NEW_NOTEBOOK_ID = "NEW_NOTEBOOK";
  var NEW_NOTEBOOK_TEXT = "* Add New Notebook *";
  var NEW_NOTE_ID = "NEW_NOTE_";
  var NEW_NOTE_TEXT = "* Add New Note *";

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

    // add the default "add new note" node for each notebook at the start
    var defaultNewNotebook = {
      "id" : NEW_NOTEBOOK_ID,
      "parent" : "#",
      "text" : NEW_NOTEBOOK_TEXT
    }
    dataArray.push(defaultNewNotebook)

    for (var i = 0; i < listData.length; i++) {
      // for notebook objects
      if (listData[i] instanceof notebookMngr.objNotebook) {

        // add the default "add new note" node for each notebook at the start
        var defaultNewNote = {
          "id" : NEW_NOTE_ID + listData[i].notebook_id,
          "parent" : listData[i].notebook_id,
          "text" : NEW_NOTE_TEXT
        }
        dataArray.push(defaultNewNote)

        //now add the notebook node
        var newItem = {
          "id" : listData[i].notebook_id,
          "parent" : "#",
          "text" : listData[i].notebook_name
        }
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

    $('#jstree_demo_div').jstree('deselect_all');
    $('#jstree_demo_div').jstree({ 'core' : {
        'data' : dataArray
    } });
    $('#jstree_demo_div').jstree(true).redraw(true);
    //$('#jstree_demo_div').jstree(true).refresh();

    //$('#jstree_demo_div').jstree('refresh');
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
  // $('.btnSaveNotes').on('click', function() {
  //   var myNotes = Get_Notes('string')
  //   Highlight_Notes(0, 'question')
  //   Highlight_Notes(2, 'answer')
  //   Highlight_Notes(4, 'answer')
  //
  //   notebookMngr.DB_Save_Note(myNote)
  // })

  Navigate_Flash_Cards = function(direction) {
    // do nothing if the flash card array isn't populated
    //debugger;
    if (currentNodeFlashArray.length === 0) {
      return;
    }

    // handle the index modification first
    if ('first' === direction) {
      currentNodeFlashIndex = 0;

    } else if ('next' === direction) {
      if (currentNodeFlashIndex < currentNodeFlashArray.length-1) {
        currentNodeFlashIndex += 1;
      }

    } else if ('previous' === direction) {
      if (currentNodeFlashIndex > 0) {
        currentNodeFlashIndex -= 1;
      }

    } else if ('last' === direction) {
      currentNodeFlashIndex = currentNodeFlashArray.length;

    } else {
      console.log('ERROR: Invalid flash card direction.');
    }

    // set the cards to display the index
    $('.flashQuestion')[0].textContent = currentNodeFlashArray[currentNodeFlashIndex].lineContent;

    for (var i = 0; i < currentNodeFlashArray[0].answers.length; i++) {
      $('.flashAnswer')[0].textContent = currentNodeFlashArray[currentNodeFlashIndex].answers[i];
    }

    // enable/disable the forward and back buttons accordingly
    if (currentNodeFlashIndex === 0) {
      $('button[name=btnFlashCardPrevious]').prop('disabled', true)
      $('button[name=btnFlashCardForward]').prop('disabled', false)
    } else if (currentNodeFlashIndex >= currentNodeFlashArray.length-1) {
      $('button[name=btnFlashCardPrevious]').prop('disabled', false)
      $('button[name=btnFlashCardForward]').prop('disabled', true)
    } else {
      $('button[name=btnFlashCardPrevious]').prop('disabled', false)
      $('button[name=btnFlashCardForward]').prop('disabled', false)
    }
  }

  $('.btnFlashCardEdit').on('click', function() {
    if ($('.flashCardEditPanel').hasClass('collapse')) {
      $('.flashCardEditPanel').removeClass('collapse')

      // Save the current notes

      // Populate our current flash card array
      currentNodeFlashArray = notebookMngr.DB_Get_Note_Flash_Cards(currentSelectedNodeID)
console.log(currentNodeFlashArray);
      Navigate_Flash_Cards('first');

    } else {
      $('.flashCardEditPanel').addClass('collapse')
    }
  })

  $('button[name=btnFlashCardPrevious]').on('click', function() {
    Navigate_Flash_Cards('previous');
  })

  $('button[name=btnFlashCardForward]').on('click', function() {
    Navigate_Flash_Cards('next');
  })

  /*
  Flash card edit previous button
  */

  /*
  Flash card edit forward button
  */

  // $('.btnSaveNotes').on('dblclick', function() {
  //   Unhighlight_All_Notes();
  //
  //   notebookMngr.DB_Delete_Note(myNote)
  // })
  //
  // $('.btnSaveNotesAs').on('click', function() {
  //   // get the currently selected notebook in the tree
  //   var selected = $('#jstree_demo_div').jstree('get_selected')
  // })

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {

    if (data.action === 'select_node') {

      //check if it's a note, if it is open it!
      if (data.selected[0].substring(0,2) === "NT") {
        //save the content first if the node changed
        if (currentSelectedNodeID !== data.selected[0] &&
            currentSelectedNodeID !== "") {
          var noteToUpdate = notebookMngr.DB_Get_Note(currentSelectedNodeID)
          noteToUpdate.notes = Get_Notes('string');
          notebookMngr.DB_Save_Note(noteToUpdate)
        }

        var noteToOpen = notebookMngr.DB_Get_Note(data.selected[0])
        Put_Notes(noteToOpen.notes)
        currentSelectedNodeID = data.selected[0];

      // check if the user clicked on the new notebook node
      } else if (data.selected[0].substring(0,NEW_NOTEBOOK_ID.length) === NEW_NOTEBOOK_ID) {
        var newNotebookName = prompt("Please enter the new notebook name", "New Notebook");
        if (newNotebookName != null) {
          var newBook = new notebookMngr.objNotebook();
          newBook.notebook_id = indexMngr.Get_New_Notebook_ID();;
          newBook.notebook_name = newNotebookName;
          notebookMngr.DB_Save_Notebook(newBook)

          //refresh the tree
          var fullList = notebookMngr.DB_Get_Full_List();
          Update_Tree(fullList)
        }

      // check if the user clicked on the new note node
      } else if (data.selected[0].substring(0,NEW_NOTE_ID.length) === NEW_NOTE_ID) {
        var newNotebookName = prompt("Please enter the new note name", "New Note");
        if (newNotebookName != null) {
          var newNote = new notebookMngr.objNote();
          newNote.noteId = indexMngr.Get_New_Note_ID();
          newNote.refNotebookId = data.node.parents[0];
          newNote.noteName = newNotebookName;
          newNote.notes = "";
          notebookMngr.DB_Save_Note(newNote)

          //refresh the tree
          var fullList = notebookMngr.DB_Get_Full_List();
          Update_Tree(fullList)
        }
      }
    }
  });

  $('.btnDefinition').on('click', function() {
    var wordToLookup = tinymce.activeEditor.selection.getContent();
    mngrDictionary.Get_Definition(wordToLookup, function(data){
      var fullDefinitionResponse = wordToLookup + " : "

      for (var i = 0; i < data.definitions.length; i++) {
        fullDefinitionResponse += data.definitions[i].text + " / "
      }
      tinymce.activeEditor.selection.setContent(fullDefinitionResponse);
    });

  });


  var indexMngr = new Index_Manager();
  var notebookMngr = new Notebook_Mngr();
  var mngrDictionary = new Dictionary_Mngr();
  var currentSelectedNodeID = "";
  var currentNodeFlashArray = [];
  var currentNodeFlashIndex = 0;

  /*
  Insert some test data if they have an empty local storage
  */
  if (localStorage.length === 0) {

    var Book1ID = indexMngr.Get_New_Notebook_ID();
    var myBook1 = new notebookMngr.objNotebook();
    myBook1.notebook_id = Book1ID;
    myBook1.notebook_name = "Default Notebook #1";
    notebookMngr.DB_Save_Notebook(myBook1)

    var myNote = new notebookMngr.objNote();
    myNote.noteId = indexMngr.Get_New_Note_ID();
    myNote.refNotebookId = Book1ID;
    myNote.noteName = "Note 1";
    myNote.notes = "Test note data 1";
    notebookMngr.DB_Save_Note(myNote)

    var myNote1 = new notebookMngr.objNote();
    myNote1.noteId = indexMngr.Get_New_Note_ID();
    myNote1.refNotebookId = Book1ID;
    myNote1.noteName = "Note 2";
    myNote1.notes = "Test note data 2";
    notebookMngr.DB_Save_Note(myNote1)

    var myBook2 = new notebookMngr.objNotebook();
    myBook2.notebook_id = indexMngr.Get_New_Notebook_ID();
    myBook2.notebook_name = "Default Notebook #2";
    notebookMngr.DB_Save_Notebook(myBook2)
  }

  var fullList = notebookMngr.DB_Get_Full_List();
  Update_Tree(fullList)
});
