var Notebook_Mngr = function() {

  /*
  Defines the note object
  */
  this.objNote = function(notebook_name, note_name) {
    var flashCards = [];
    this.notebookName = notebook_name;
    this.noteName = note_name;
    this.notes = "";
    this.generateFlashCards = function(){}
  }

  /*
  Retrieves a note from storage
  */
  this.DB_Get_Note = function(note_key) {
    return JSON.parse( localStorage.getItem(note_key) )
  };

  /*
  Saves a new note into storage, or updates the note
  */
  this.DB_Save_Note = function(note_to_save) {
    if (!(note_to_save instanceof this.objNote)) {
      console.log("Object passed in is not of type objNote.");
      return false;
    }

    var myKey = pGenerateNoteKey(note_to_save)
    var string_to_save = JSON.stringify(note_to_save)
    localStorage.setItem(myKey, string_to_save)
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
