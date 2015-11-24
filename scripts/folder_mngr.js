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

  var pGet_Notebook = function(notebookId, notebookName, notebookIndex) {

    var response =
    '<div class="panel panel-default notebookMenu">' +
      '<div class="panel-heading" role="tab" id="' + notebookId + '">' +
        '<h4 class="panel-title">' +
          '<a class="collapsed notebookMenuItem" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + notebookIndex + '" aria-expanded="false" aria-controls="collapse' + notebookIndex + '">' +
            notebookName +
          '</a>' +

          '<span class="pull-right dropdown">' +
            '<button class="btn btn-xs dropdown-toggle notebookOptions" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
               '<span class="glyphicon glyphicon-option-horizontal"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" data-notebookID="' + notebookId + '" data-notebookName="' + notebookName + '" aria-labelledby="dropdownMenu1">' +
              '<li><a class="createNewNote" href="#">Add New Note</a></li>' +
              '<li role="separator" class="divider"></li>' +
              '<li><a class="renameNotebook" href="#">Rename Notebook</a></li>' +
              '<li><a class="deleteNotebook" href="#">Delete Notebook</a></li>' +
              // '<li><a class="deleteNotebook" data-toggle="modal" data-target="#confirmNotebookDelete" data-notebookID="' + notebookId + '" data-notebookName="' + notebookName + '" href="#">Delete Notebook</a></li>' +
            '</ul>' +
          '</span>' +
        '</h4>' +
      '</div>' +
      '<div id="collapse' + notebookIndex + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + notebookIndex + '">' +
        '<div class="list-group noteList">'

    return response;
  }

  var pGet_Note = function(noteID, noteName) {
    return '<button id="' + noteID + '" type="button" class="list-group-item linkOpenNote">' + noteName + '</button>'
  }

}
