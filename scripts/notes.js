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
//debugger;
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

  ShowHide_Flash_Card_Edit = function() {
    if ($('.flashCardEditPanel').hasClass('collapse')) {
      $('.flashCardEditPanel').removeClass('collapse')
      Navigate_Flash_Cards('first');
      $('#notesText').css('height', '40vh')

    } else {
      $('.flashCardEditPanel').addClass('collapse')
      Unhighlight_All_Notes()
      $('#notesText').css('height', '63vh')
    }
  }

  ShowHide_Note_Edit_Panel = function(action) {
    var editor_id = $(tinymce.activeEditor).attr('id');

    if (action === 'hide') {
      tinymce.get(editor_id).hide();
      $('#notesText')[0].hidden = true;
    } else if (action === 'show') {
      tinymce.get(editor_id).show();
      $('#notesText')[0].hidden = false;
    }
  }

  Save_Open_Note = function() {
    var noteToUpdate = notebookMngr.DB_Get_Note(currentSelectedNodeID)
    noteToUpdate.notes = Get_Notes('string');
    notebookMngr.DB_Save_Note(noteToUpdate)
  }

  // Flash card previous button
  $('button[name=btnFlashCardPrevious]').on('click', function() {
    Navigate_Flash_Cards('previous');
  })

  // Flash card forward button
  $('button[name=btnFlashCardForward]').on('click', function() {
    Navigate_Flash_Cards('next');
  })

  // Handle user clicking on a Note to open it
  $(document).on('click', '.linkOpenNote', function(e){
    ShowHide_Note_Edit_Panel('show');
    //save the content first if the node changed
    if (currentSelectedNodeID !== e.currentTarget.id &&
        currentSelectedNodeID !== "") {
      Save_Open_Note()
    }
    //now open the new note
    noteBeingEdited = notebookMngr.DB_Get_Note(e.currentTarget.id)
    Put_Notes(noteBeingEdited.notes)
    currentSelectedNodeID = e.currentTarget.id;
  });

  // Add new notebook
  $('.addNotebook').on('click', function() {
    var newNotebookName = prompt("Please enter the new notebook name", "New Notebook");
    // TODO: Validate name
    if (newNotebookName != null) {
      notebookMngr.DB_Create_New_Notebook(newNotebookName)
      Build_Menu()
    }
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
            Save_Open_Note()
          }
      });

      // Add our rename note button
      editor.addButton('renameNote', {
          text: 'Rename',
          icon: false,
          onclick: function() {
            ShowHide_Note_Edit_Panel('hide');
          }
      });

      // Add our delete note button
      editor.addButton('deleteNote', {
          text: 'Delete',
          icon: false,
          onclick: function() {
            var r = confirm("Are you sure you want to delete this note?");
            if (r === true) {
              notebookMngr.DB_Delete_Note(noteBeingEdited.noteId)
              Build_Menu()
              currentSelectedNodeID = '';
              noteBeingEdited = null;
              ShowHide_Note_Edit_Panel('hide')
            }
          }
      });
  });

  tinymce.init({
    selector:'textarea',
    plugins: 'lowerMenu',
    menubar: false,
    toolbar1: 'undo redo | bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify',
    //toolbar2: 'wordDefinition | flashEdit | saveNote | renameNote | deleteNote',
    toolbar2: 'wordDefinition | flashEdit | saveNote | deleteNote',
    statusbar: false,
    // Initially hide the notes area
    setup: function(editor) {
        editor.on('init', function(e) {
            ShowHide_Note_Edit_Panel('hide');
        });
    }
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
    var book1 = notebookMngr.DB_Create_New_Notebook("Example Notebook")
    var note1 = notebookMngr.DB_Create_New_Note(book1.notebook_id, "Example Note 1")
    note1.notes = "<p>Example Note</p>\n" +
    "<p>While this note is open click the 'Flash Card Edit' button above. Then at the bottom of the page use the left and right buttons to scroll through the flash cards which were generated.</p>\n" +
    "<p>&nbsp;</p>\n" +
    "<p>Example Question 1</p>\n" +
    "<ul>\n" +
      "<li>Answer 1</li>\n" +
      "<li>Answer 2</li>\n" +
      "<li>Answer 3</li>\n" +
    "</ul>\n" +
    "<p>&nbsp;</p>\n" +
    "<p>Example Question 2</p>\n" +
    "<ul>\n" +
      "<li>Answer/Question</li>\n" +
      "<li>Answer/Question</li>\n" +
        "<ul>\n" +
          "<li>Answer 1</li>\n" +
          "<li>Answer 2</li>\n" +
        "</ul>\n" +
      "<li>Answer/Question</li>\n" +
        "<ul>\n" +
          "<li>Answer 3</li>\n" +
          "<li>Answer 4</li>\n" +
        "</ul>\n" +
      "<li>Answer/Question</li>\n" +
        "<ul>\n" +
          "<li>Answer 5</li>\n" +
          "<li>Answer 6</li>\n" +
        "</ul>\n" +
      "<li>Answer 7</li>\n" +
    "</ul>\n" +
    "<p>&nbsp;</p>\n"

    var note2 = notebookMngr.DB_Create_New_Note(book1.notebook_id, "Example Note 2")
    notebookMngr.DB_Save_Note(note1)
  }

  Build_Menu();
});
