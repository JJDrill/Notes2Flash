var Notebook_Mngr = function() {
  var dbCode_Notebooks = 'NB';
  var dbCode_Notes = 'NT';

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

  this.DB_Save_Notebook = function(notebook) {
    if (!(notebook instanceof this.objNotebook)) {
      console.log("Object passed in is not of type objNotebook.");
      return false;
    }

    var string_to_save = JSON.stringify(notebook)
    localStorage.setItem(notebook.notebook_id, string_to_save)
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
  Saves a new note into storage, or updates the note
  */
  this.DB_Save_Note = function(note_to_save) {
    if (!(note_to_save instanceof this.objNote)) {
      console.log("Object passed in is not of type objNote.");
      return false;
    }

    this.Generate_Flash_Cards(note_to_save)

    var string_to_save = JSON.stringify(note_to_save)
    localStorage.setItem(note_to_save.noteId, string_to_save)
  };

  /*
  Deletes a note from storage
  */
  this.DB_Delete_Note = function(note_to_delete) {
    if (!(note_to_delete instanceof this.objNote)) {
      console.log("Object passed in is not of type objNote.");
      return false;
    }

    var myKey = pGenerateNoteKey(note_to_delete)
    localStorage.removeItem(myKey)
  }

  /*
  Generates the flash card objects for a note
  */
  this.Generate_Flash_Cards = function(note) {
    var contentArray = note.notes.split('\n')
    var flashArray = [];
    var tabIndex = 0;

    /*
    loop through each line in the Content and add it to our
    flashArray with each line object
    */
    for (var i = 0; i < contentArray.length; i++) {

      if ('<ul>' === contentArray[i]) {
        tabIndex += 1;
      } else if ('</ul>' === contentArray[i]) {
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
      // if (newAnswerObj.lineContent === "<ul>"  ||
      //     newAnswerObj.lineContent === "</ul>"  ||
      //     newAnswerObj.lineContent === "<p>&nbsp;</p>") {
        continue;
      }

      /*
      Now loop through the flash array in reverse
      looking for parents which have a n-1 tab index
      */
      for (var flashIndex = flashArray.length - 1; flashIndex >=0; flashIndex--) {
        // check if the line is something we need to ignore
        if ( pIsIgnoredForFlash( flashArray[flashIndex].lineContent ) ) {
          continue;

        } else {
          console.log(flashArray[flashIndex].lineContent);
          //debugger;
          if (flashArray[flashIndex].tabIndex === newAnswerObj.tabIndex - 1) {
            flashArray[flashIndex].answers.push(newAnswerObj.lineContent)
            break;
          }
        }
      }
    }

    console.log(flashArray);

    //now go through and clean up the fragmented array
    var fullLength = flashArray.length;
    for (var i = fullLength-1; i >= 0; i--) {
      if (flashArray[i].answers.length === 0) {
        flashArray.splice(i,1);
      }
    }

    console.log(flashArray);
  }

  /*
  Private
  Used to check if a string is an ignored sting while we're parsing flash cards
  */
  var pIsIgnoredForFlash = function(line) {
    if (line === "<ul>"  ||
        line === "</ul>"  ||
        line === "<p>&nbsp;</p>") {
      return true;

    } else {
      return false;
    }
  }

  /*
  Private
  Used to generate the key for local storage
  */
  var pGenerateNoteKey = function(aNote) {

    return  "NB:" +
            aNote.notebookName.toLowerCase().replace(" ", "") +
            ":" +
            aNote.noteName.toLowerCase().replace(" ", "")
  }

}
