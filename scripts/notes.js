$(function(){
  var NEW_NOTEBOOK_ID = "NEW_NOTEBOOK";
  var NEW_NOTEBOOK_TEXT = "New Notebook";
  var NEW_NOTE_ID = "NEW_NOTE_";
  var NEW_NOTE_TEXT = "New Note";

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
    var lineNumberInArray = lineNumber-1
    var lineElements = $(notesArray[lineNumberInArray])

    if ('question' === item.toLowerCase()) {
      $(lineElements[0]).addClass('highlightQuestion')
    } else if ('answer' === item.toLowerCase()) {
      $(lineElements[0]).addClass('highlightAnswer')
    }

    notesArray[lineNumberInArray] = lineElements[0].outerHTML
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
          notesArray[i] = lineElements[0].outerHTML
        } else if ($(lineElements[0]).hasClass('highlightAnswer')) {
          $(lineElements[0]).removeClass('highlightAnswer')
          notesArray[i] = lineElements[0].outerHTML
        }
      }
    }
    Put_Notes(notesArray)
  }

  // /*
  // Update tree with new info
  // */
  // Update_Tree = function(listData) {
  //   // build the data array
  //   var dataArray = []
  //
  //   // add the default "add new note" node for each notebook at the start
  //   var defaultNewNotebook = {
  //     "id" : NEW_NOTEBOOK_ID,
  //     "parent" : "#",
  //     "text" : NEW_NOTEBOOK_TEXT,
  //     "icon" : "glyphicon glyphicon-option-horizontal"
  //   }
  //   dataArray.push(defaultNewNotebook)
  //
  //   for (var i = 0; i < listData.length; i++) {
  //     // for notebook objects
  //     if (listData[i] instanceof notebookMngr.objNotebook) {
  //
  //       // add the default "add new note" node for each notebook at the start
  //       var defaultNewNote = {
  //         "id" : NEW_NOTE_ID + listData[i].notebook_id,
  //         "parent" : listData[i].notebook_id,
  //         "text" : NEW_NOTE_TEXT,
  //         "icon" : "glyphicon glyphicon-option-horizontal"
  //       }
  //       dataArray.push(defaultNewNote)
  //
  //       //now add the notebook node
  //       var newItem = {
  //         "id" : listData[i].notebook_id,
  //         "parent" : "#",
  //         "text" : listData[i].notebook_name,
  //         "icon" : "glyphicon glyphicon-folder-open"
  //       }
  //       dataArray.push(newItem)
  //
  //     // for note objects
  //     } else if (listData[i] instanceof notebookMngr.objNote) {
  //       var newItem = {
  //         "id" : listData[i].noteId,
  //         "parent" : listData[i].refNotebookId,
  //         "text" : listData[i].noteName,
  //         "icon" : "glyphicon glyphicon-file"
  //       }
  //       dataArray.push(newItem)
  //     }
  //   }
  //
  //   $('#jstree_demo_div').jstree('deselect_all');
  //   $('#jstree_demo_div').jstree(
  //     { 'core' : {
  //       'check_callback': true,
  //       'cache' : false,
  //       'data' : dataArray
  //   } });
  //   //$('#jstree_demo_div').jstree(true).redraw(true);
  //   //$('#jstree_demo_div').jstree(true).refresh();
  //   $("#jstree_demo_div").jstree('refresh');
  // }

  Navigate_Flash_Cards = function(direction) {
    // do nothing if the flash card array isn't populated
    //debugger;
    if (noteBeingEdited.flashCards.length === 0) {
      return;
    }

    // handle the index modification first
    if ('first' === direction) {
      currentNodeFlashIndex = 0;
    } else if ('next' === direction) {
      if (currentNodeFlashIndex < noteBeingEdited.flashCards.length-1) {
        currentNodeFlashIndex += 1;
      }
    } else if ('previous' === direction) {
      if (currentNodeFlashIndex > 0) {
        currentNodeFlashIndex -= 1;
      }
    } else if ('last' === direction) {
      currentNodeFlashIndex = noteBeingEdited.flashCards.length;
    } else {
      console.log('ERROR: Invalid flash card direction.');
    }

    // set the cards to display the current question/answers
    // also highlight the needed lines in the note
    Unhighlight_All_Notes();
    var flashCardArray = noteBeingEdited.flashCards[currentNodeFlashIndex];

    $('.flashQuestion')[0].textContent = $(flashCardArray.lineContent).text();
    Highlight_Notes(flashCardArray.lineNumber, 'question')
    $('.flashAnswer')[0].textContent = ""

    var fullAnswerText = "";
    for (var i = 0; i < flashCardArray.answers.length; i++) {
      answerText = $(flashCardArray.answers[i].lineContent).text();
      fullAnswerText += answerText + '\r\n';
      Highlight_Notes(flashCardArray.answers[i].lineNumber, 'answer')
    }
    $('.flashAnswer')[0].innerText = fullAnswerText;

    // enable/disable the forward and back buttons accordingly
    if (currentNodeFlashIndex === 0) {
      $('button[name=btnFlashCardPrevious]').prop('disabled', true)
      $('button[name=btnFlashCardForward]').prop('disabled', false)
    } else if (currentNodeFlashIndex >= noteBeingEdited.flashCards.length-1) {
      $('button[name=btnFlashCardPrevious]').prop('disabled', false)
      $('button[name=btnFlashCardForward]').prop('disabled', true)
    } else {
      $('button[name=btnFlashCardPrevious]').prop('disabled', false)
      $('button[name=btnFlashCardForward]').prop('disabled', false)
    }
  }

  Build_Menu = function() {
    $('.notebookMenuItem').remove();
    var noteBookList = notebookMngr.DB_Get_Notebook_List();
    var noteList = notebookMngr.DB_Note_List();
    var navToBuild = mngrFolder.Build_List(noteBookList, noteList);
    $('#accordion').append(navToBuild);
  }

  ShowHide_Flash_Card_Edit = function() {
    if ($('.flashCardEditPanel').hasClass('collapse')) {
      $('.flashCardEditPanel').removeClass('collapse')
      Navigate_Flash_Cards('first');
      //console.log($('.notesTextArea'));
      $('#notesText_ifr').css('height', '40vh')

    } else {
      $('.flashCardEditPanel').addClass('collapse')
      Unhighlight_All_Notes()
      $('#notesText_ifr').css('height', '63vh')
    }
  }

  // Flash card previous button
  $('button[name=btnFlashCardPrevious]').on('click', function() {
    Navigate_Flash_Cards('previous');
  })

  // Flash card forward button
  $('button[name=btnFlashCardForward]').on('click', function() {
    Navigate_Flash_Cards('next');
  })

  // Handle user clicking on a Note
  $(document).on('click', '.note', function(e){
    //save the content first if the node changed
    if (currentSelectedNodeID !== e.currentTarget.id &&
        currentSelectedNodeID !== "") {
      var noteToUpdate = notebookMngr.DB_Get_Note(currentSelectedNodeID)
      noteToUpdate.notes = Get_Notes('string');
      notebookMngr.DB_Save_Note(noteToUpdate)
    }
    //now open the new note
    noteBeingEdited = notebookMngr.DB_Get_Note(e.currentTarget.id)
    Put_Notes(noteBeingEdited.notes)
    currentSelectedNodeID = e.currentTarget.id;
  });

  // $('#jstree_demo_div').on("changed.jstree", function (e, data) {
  //   if (data.action === 'select_node') {
  //
  //     //check if it's a note, if it is open it!
  //     if (data.selected[0].substring(0,2) === "NT") {
  //       //save the content first if the node changed
  //       if (currentSelectedNodeID !== data.selected[0] &&
  //           currentSelectedNodeID !== "") {
  //         var noteToUpdate = notebookMngr.DB_Get_Note(currentSelectedNodeID)
  //         noteToUpdate.notes = Get_Notes('string');
  //         notebookMngr.DB_Save_Note(noteToUpdate)
  //       }
  //       //now open the new note
  //       noteBeingEdited = notebookMngr.DB_Get_Note(data.selected[0])
  //       Put_Notes(noteBeingEdited.notes)
  //       currentSelectedNodeID = data.selected[0];
  //
  //     // check if the user clicked on the new notebook node
  //     } else if (data.selected[0].substring(0,NEW_NOTEBOOK_ID.length) === NEW_NOTEBOOK_ID) {
  //       var newNotebookName = prompt("Please enter the new notebook name", "New Notebook");
  //
  //       if (newNotebookName != null) {
  //         var newBook = new notebookMngr.objNotebook();
  //         newBook.notebook_id = indexMngr.Get_New_Notebook_ID();;
  //         newBook.notebook_name = newNotebookName;
  //         notebookMngr.DB_Save_Notebook(newBook)
  //
  //         //refresh the tree
  //         var fullList = notebookMngr.DB_Get_Full_List();
  //         Update_Tree(fullList)
  //       }
  //
  //     // check if the user clicked on the new note node
  //     } else if (data.selected[0].substring(0,NEW_NOTE_ID.length) === NEW_NOTE_ID) {
  //       var newNotebookName = prompt("Please enter the new note name", "New Note");
  //       if (newNotebookName != null) {
  //         var newNote = new notebookMngr.objNote();
  //         newNote.noteId = indexMngr.Get_New_Note_ID();
  //         newNote.refNotebookId = data.node.parents[0];
  //         newNote.noteName = newNotebookName;
  //         newNote.notes = "";
  //         notebookMngr.DB_Save_Note(newNote)
  //
  //         //refresh the tree
  //         var fullList = notebookMngr.DB_Get_Full_List();
  //         Update_Tree(fullList)
  //       }
  //     }
  //   }
  // });

  Get_Word_Definition = function() {
    // set a bookmark first
    var bm = tinymce.activeEditor.selection.getBookmark();

    var wordToLookup = tinymce.activeEditor.selection.getContent();
    mngrDictionary.Get_Definition(wordToLookup, function(data){
      var fullDefinitionResponse = wordToLookup + " : "

      for (var i = 0; i < data.definitions.length; i++) {
        fullDefinitionResponse += data.definitions[i].text + " / "
      }
      tinymce.activeEditor.selection.setContent(fullDefinitionResponse);
    });

    //go back to the line we were on using our bookmark
    tinymce.activeEditor.selection.moveToBookmark(bm);
  }

  // Add new notebook
  $('.addNotebook').on('click', function() {
    var newNotebookName = prompt("Please enter the new notebook name", "New Notebook");
    // TODO: Validate name
    if (newNotebookName != null) {
      notebookMngr.DB_Create_New_Notebook(newNotebookName)
    }
    Build_Menu()
  })

  // Delete notebook click
  $(document).on('click', '.deleteNotebook', function(event){
    var notebookIdToDelete = event.target.parentNode.parentNode.dataset.notebookid
    var notebookNameToDelete = event.target.parentNode.parentNode.dataset.notebookname

    var r = confirm("Are you sure you want to delete the notebook " + notebookNameToDelete + "?");
    if (r == true) {
      notebookMngr.DB_Delete_Notebook(notebookIdToDelete)
      Build_Menu()
    }
  })

  // Create a new note
  $(document).on('click', '.createNewNote', function(event){
    var notebookID = event.target.parentNode.parentNode.dataset.notebookid
    var newNoteName = prompt("Please enter the new note name", "New Note")
    notebookMngr.DB_Create_New_Note(notebookID, newNoteName)
    Build_Menu()
  })

  tinymce.PluginManager.add('lowerMenu', function(editor, url) {
      // Add our word definition button
      editor.addButton('wordDefinition', {
          text: 'Get Definition',
          icon: false,
          onclick: function() {
            //console.log('test!!!');
            Get_Word_Definition();
          }
      });

      // Add our flash card edit
      editor.addButton('flashEdit', {
          text: 'Flash Card Edit',
          icon: false,
          onclick: function() {
            ShowHide_Flash_Card_Edit();
          }
      });

      // Add our rename note button
      editor.addButton('saveNote', {
          text: 'Save',
          icon: false,
          onclick: function() {
            //ShowHide_Flash_Card_Edit();
          }
      });

      // Add our rename note button
      editor.addButton('renameNote', {
          text: 'Rename',
          icon: false,
          onclick: function() {
            //ShowHide_Flash_Card_Edit();
          }
      });

      // Add our delete note button
      editor.addButton('deleteNote', {
          text: 'Delete',
          icon: false,
          onclick: function() {
            notebookMngr.DB_Delete_Note(noteBeingEdited.noteId)
            Build_Menu()
            currentSelectedNodeID = '';
            noteBeingEdited = null;
          }
      });
  });

  var indexMngr = new Index_Manager();
  var notebookMngr = new Notebook_Mngr();
  var mngrDictionary = new Dictionary_Mngr();
  var mngrFolder = new File_Manager();
  var currentSelectedNodeID = "";
  var noteBeingEdited = new notebookMngr.objNote();
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

  Build_Menu();
});
