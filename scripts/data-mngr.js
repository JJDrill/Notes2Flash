var Notebook_Mngr = function() {
  var dbCode_Notebooks = 'NB';
  var dbCode_Notes = 'NT';

  var KEY_NOTEBOOK_INDEX = "Index_Notebook"
  var KEY_NOTE_INDEX = "Index_Note"

  var currentNotebookIndex = localStorage.getItem(KEY_NOTEBOOK_INDEX)
  currentNotebookIndex = parseInt(currentNotebookIndex, 10) || 0

  var currentNoteIndex = localStorage.getItem(KEY_NOTE_INDEX)
  currentNoteIndex = parseInt(currentNoteIndex, 10) || 0

  var tabIncreaseTags = ['<ul>',  '<ol>']
  var tabDecreaseTags = ['</ul>', '</ol>']

  /*
  Defines the notebook object
  */
  this.objNotebook = function() {
    this.notebook_id = "";
    this.notebook_name = "";
  }

  /*
  Defines the note object
  */
  this.objNote = function() {
    this.noteId = "";
    this.refNotebookId = "";
    this.noteName = "";
    this.notes = "";
    var flashCards = [];
  }

  this.DB_Get_Notebook_List = function() {
    var return_array = []
    for (var i = 0; i < localStorage.length; i++) {
      // get the key and value to work with
      var key = localStorage.key([i]);
      var value = localStorage.getItem(localStorage.key([i]));
      value = JSON.parse(value);

      if (key.substring(0,dbCode_Notebooks.length) === dbCode_Notebooks) {
        var newNotebook = new this.objNotebook()
        newNotebook.notebook_id = value.notebook_id
        newNotebook.notebook_name = value.notebook_name;
        // get our list of notes to attach too
        var noteList = this.DB_Note_List(value.notebook_id)
        newNotebook.noteList = noteList
        return_array.push(newNotebook)
      }
    }
    return return_array
  }

  this.DB_Note_List = function(Notebook_ID) {
    var return_array = []
    for (var i = 0; i < localStorage.length; i++) {
      // get the key and value to work with
      var key = localStorage.key([i]);
      var value = localStorage.getItem(localStorage.key([i]));
      value = JSON.parse(value);

      if (Notebook_ID === value.refNotebookId) {
        var newNote = new this.objNote()
        newNote.noteId = value.noteId;
        newNote.refNotebookId = value.refNotebookId;
        newNote.noteName = value.noteName;
        newNote.notes = value.notes;
        return_array.push(newNote);
      }
    }
    return return_array
  }

  this.DB_Get_Full_List = function() {
    var return_array = []
    for (var i = 0; i < localStorage.length; i++) {
      // get the key and value to work with
      var key = localStorage.key([i]);
      var value = localStorage.getItem(localStorage.key([i]));
      value = JSON.parse(value);

      if (key.substring(0,dbCode_Notebooks.length) === dbCode_Notebooks) {
        var newNotebook = new this.objNotebook()
        newNotebook.notebook_id = value.notebook_id;
        newNotebook.notebook_name = value.notebook_name;
        return_array.push(newNotebook);

      } else if (key.substring(0,dbCode_Notes.length) === dbCode_Notes) {
        var newNote = new this.objNote()
        newNote.noteId = value.noteId;
        newNote.refNotebookId = value.refNotebookId;
        newNote.noteName = value.noteName;
        newNote.notes = value.notes;
        return_array.push(newNote);
      }
    }
    return return_array
  }

  this.DB_Create_New_Notebook = function(newNotebookName) {
    var newBook = new this.objNotebook();
    newBook.notebook_id = Get_New_Notebook_ID();
    newBook.notebook_name = newNotebookName;
    this.DB_Save_Notebook(newBook)
    return newBook;
  }

  this.DB_Save_Notebook = function(notebook) {
    if (!(notebook instanceof this.objNotebook)) {
      console.log("Object passed in is not of type objNotebook.");
      return false;
    }

    var string_to_save = JSON.stringify(notebook)
    localStorage.setItem(notebook.notebook_id, string_to_save)
  }

  /*
  Retrieves a notebook from storage
  */
  this.DB_Get_Notebook = function(notebook_key) {
    var dataToCopy = JSON.parse( localStorage.getItem(notebook_key) )

    var returnItem = new this.objNotebook();
    returnItem.notebook_id = dataToCopy.notebook_id;
    returnItem.notebook_name = dataToCopy.notebook_name;
    return returnItem;
  };

  this.DB_Delete_Notebook = function(notebookId) {
    // First delete all associated notes, then the notebook
    var noteList = this.DB_Note_List();
    for (var i = 0; i < noteList.length; i++) {
      if (noteList[i].refNotebookId === notebookId) {
        this.DB_Delete_Note(noteList[i].noteId)
      }
    }
    localStorage.removeItem(notebookId)
  }

  /*
  Creates a new note under a notebook
  */
  this.DB_Create_New_Note = function(notebookId, newNotebookName) {
    var newNote = new this.objNote();
    newNote.noteId = Get_New_Note_ID();
    newNote.refNotebookId = notebookId;
    newNote.noteName = newNotebookName;
    newNote.notes = "";
    this.DB_Save_Note(newNote)
    return newNote;
  }

  /*
  Retrieves a note from storage
  */
  this.DB_Get_Note = function(note_key) {
    var dataToCopy = JSON.parse( localStorage.getItem(note_key) )

    var returnItem = new this.objNote();
    returnItem.noteId = dataToCopy.noteId;
    returnItem.refNotebookId = dataToCopy.refNotebookId;
    returnItem.noteName = dataToCopy.noteName;
    returnItem.notes = dataToCopy.notes;
    returnItem.flashCards = dataToCopy.flashCards;
    return returnItem;
  };

  /*
  Returns the current flash card array for a note
  */
  this.DB_Get_Note_Flash_Cards = function(note_key) {
    var myNote = this.DB_Get_Note(note_key);
    return myNote.flashCards;
  }

  /*
  Saves a new note into storage, or updates the note
  */
  this.DB_Save_Note = function(note_to_save) {
    if (!(note_to_save instanceof this.objNote)) {
      console.log("Object passed in is not of type objNote.");
      return false;
    }

    Generate_Flash_Cards(note_to_save)

    var string_to_save = JSON.stringify(note_to_save)
    localStorage.setItem(note_to_save.noteId, string_to_save)
    return note_to_save;
  };

  /*
  Deletes a note from storage
  */
  this.DB_Delete_Note = function(note_key_to_delete) {
    localStorage.removeItem(note_key_to_delete)
  }

  /*
  Private
  Gets the current max notebook ID from local storage and increments it
  */
  var Get_New_Notebook_ID = function() {
    currentNotebookIndex += 1
    localStorage.setItem(KEY_NOTEBOOK_INDEX, currentNotebookIndex)
    return "NB" + currentNotebookIndex
  }

  /*
  Private
  Gets the current max note ID from local storage and increments it
  */
  var Get_New_Note_ID = function() {
    currentNoteIndex += 1
    localStorage.setItem(KEY_NOTE_INDEX, currentNoteIndex)
    return "NT" + currentNoteIndex
  }

  /*
  Private
  Generates the flash card objects for a note
  */
  var Generate_Flash_Cards = function(note) {
    var contentArray = note.notes.split('\n')
    var flashArray = [];
    var tabIndex = 0;

    /*
    loop through each line in the Content and add it to our
    flashArray with each line object
    */
    for (var i = 0; i < contentArray.length; i++) {

      if (tabIncreaseTags.indexOf(contentArray[i]) > -1) {
        tabIndex += 1;
      } else if (tabDecreaseTags.indexOf(contentArray[i]) > -1) {
        tabIndex -= 1;
      }

      var newAnswerObj = {
        "lineNumber": i + 1,
        "tabIndex": tabIndex,
        "lineContent": contentArray[i],
        "answers": []
      }

      flashArray.push(newAnswerObj);

      if ( pIsIgnoredForFlash( newAnswerObj.lineContent ) ) {
        continue;
      }

      /*
      Now loop through the flash array in reverse
      looking for parents which have a n-1 tab index
      which will be an answer
      */
      for (var flashIndex = flashArray.length - 1; flashIndex >=0; flashIndex--) {
        // check if the line is something we need to ignore
        if ( pIsIgnoredForFlash( flashArray[flashIndex].lineContent ) ) {
          continue;
        } else {
          if (flashArray[flashIndex].tabIndex === newAnswerObj.tabIndex - 1) {
            flashArray[flashIndex].answers.push(newAnswerObj)
            break;
          }
        }
      }
    }

    //now go through and clean up the fragmented array
    var fullLength = flashArray.length;
    for (var i = fullLength-1; i >= 0; i--) {
      if (flashArray[i].answers.length === 0) {
        flashArray.splice(i,1);
      }
    }

    // Set the updated flash card array to our note object
    note.flashCards = flashArray;
  }

  /*
  Private
  Used to check if a string is an ignored sting while we're parsing flash cards
  */
  var pIsIgnoredForFlash = function(line) {
    if (tabIncreaseTags.indexOf(line) > -1) {
      return true;
    } else if (tabDecreaseTags.indexOf(line) > -1) {
      return true;
    } else if (line === "<p>&nbsp;</p>") {
      return true;
    } else {
      return false;
    }
  }

}
