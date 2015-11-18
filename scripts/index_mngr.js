var Index_Manager = function() {
  var KEY_NOTEBOOK_INDEX = "Index_Notebook"
  var KEY_NOTE_INDEX = "Index_Note"

  var currentNotebookIndex = localStorage.getItem(KEY_NOTEBOOK_INDEX)
  currentNotebookIndex = parseInt(currentNotebookIndex, 10) || 0

  var currentNoteIndex = localStorage.getItem(KEY_NOTE_INDEX)
  currentNoteIndex = parseInt(currentNoteIndex, 10) || 0

  /*
  Gets the current max notebook ID from local storage and increments it
  */
  this.Get_New_Notebook_ID = function() {
    currentNotebookIndex += 1
    localStorage.setItem(KEY_NOTEBOOK_INDEX, currentNotebookIndex)
    return "NB" + currentNotebookIndex
  }

  /*
  Gets the current max note ID from local storage and increments it
  */
  this.Get_New_Note_ID = function() {
    currentNoteIndex += 1
    localStorage.setItem(KEY_NOTE_INDEX, currentNoteIndex)
    return "NT" + currentNoteIndex
  }
}
