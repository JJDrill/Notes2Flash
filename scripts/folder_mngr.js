var File_Manager = function() {

  this.Build_List = function(noteBookList, noteList) {
    // build the data array
    var returnString = ""

    // First loop through and get all our notebooks
    for (var noteBookListIndex = 0; noteBookListIndex < noteBookList.length; noteBookListIndex++) {

      var notebookStartString = pGet_Notebook(
        noteBookList[noteBookListIndex].notebook_id,
        noteBookList[noteBookListIndex].notebook_name,
      noteBookListIndex)

      var noteString = ""

      // Now loop through all our notes and assign them to the right books
      for (var noteListIndex = 0; noteListIndex < noteList.length; noteListIndex++) {
        //debugger;
        if (noteBookList[noteBookListIndex].notebook_id === noteList[noteListIndex].refNotebookId) {
          noteString += pGet_Note(noteList[noteListIndex].noteId, noteList[noteListIndex].noteName)
        }
      }
      returnString += notebookStartString + noteString + '</div></div></div>'
    }
    return returnString
  }

  this.Add_Notebook_Node = function(name) {
  }

  this.Add_Note_Node = function(name, parent) {
  }

  var pGet_Notebook = function(notebookId, notebookName, notebookIndex) {

    var response =
    '<div class="panel panel-default">' +
      '<div class="panel-heading" role="tab" id="' + notebookId + '">' +
        '<h4 class="panel-title">' +
          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + notebookIndex + '" aria-expanded="true" aria-controls="collapse' + notebookIndex + '">' +
            notebookName +
          '</a>' +
        '</h4>' +
      '</div>' +
      '<div id="collapse' + notebookIndex + '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading' + notebookIndex + '">' +
        '<div class="list-group noteList">'

    return response;
  }

  var pGet_Note = function(noteID, noteName) {
    return '<button id="' + noteID + '" type="button" class="list-group-item note">' + noteName + '</button>'
  }

}
