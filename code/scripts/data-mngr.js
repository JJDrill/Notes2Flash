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

  this.DB_Get_Notebook = function() {

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
