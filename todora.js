var data = null;
//Card template for todolist
var card = "            <div class=\"list text-white card card-inverse card-primary bg-primary +\">\n" +
    "                <div class=\"titleList card-header \"><input class='list-name input-field'><button class='del todo-list btn btn-danger'><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button></input>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <br>" +
    "                        <div class='progressBar'></div>" +
    "                        <div class='empty'>" +
    "                            Leere Liste" +
    "                        </div>" +
    "<br><input class='todo-entry-input'><button class='add btn btn-success'>Add entry</button>\n" +
    "                            <br>\n"+
    "                </div>\n" +
    "            </div>\n" +
    "        </div>";

$(document).ready(function() {
    data = JSON.parse(localStorage.getItem('data'));
    if(data == null){
        data = {
            "lists" : [],
            "count" : 0
        };
    }
    restoreData();

    //Create new TODOList
    document.getElementById("createTODO").addEventListener("click", function(){
        var name = $("#inputNewList").val();
        $("#inputNewList").val("");
        ID = addTodoListToStore(name);
        addTodoListToDom(name, ID);
        initEntry = addEntryToStore("Beispiel", ID);
        addEntryToDom("Beispiel", initEntry, ID);
    });
});

/**
 * Add a new todolist to the dom
 * @param name the name of the list
 * @param ID the id which is used as well in the data object
 */
function addTodoListToDom(name, ID){
    var welcomeDiv = $('.welcome');
    welcomeDiv.css("visibility", "hidden");
    welcomeDiv.css("opacity", "0");
    welcomeDiv.css("height", "0");

    //Add list template
    $('#gridView').append("<div class=\"text-center col-12 col-lg-4  todo-list\" id=\"" + ID + "\">" + card);
    $('#' + ID + " .card-header .list-name").val(name);

    //Add button functionality
    var addEntryButton = $('#' + ID + " .add");
    addEntryButton.bind("click",function(){
        name = $("#" + ID + " input.todo-entry-input").val();
        $("#" + ID+ " input.todo-entry-input").val("");
        entryID = addEntryToStore(name, ID);
        addEntryToDom(name, entryID, ID);
    });

    var delListButton = $('#' + ID + " .del.todo-list");
    delListButton.bind("click", function(){
        delTodoListFromStore(ID);
        delTodoListFromDom(ID);
    })

    $('#' + ID + " .card-header input.list-name").bind('change', function(){
        changeListName($('#' + ID + " .card-header .list-name").val(), ID);
    })

}

function changeListName(name, ID){
    for(var i = 0; i < data.lists.length; i++){
        if(data.lists[i].id == ID){
            data.lists[i].name = name;
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}

function changeEntryName(name, ID){
    for(i = 0; i < data.lists.length; i++){
        for(j = 0; j < data.lists[i].entries.length; j++){
            if(data.lists[i].entries[j].id == ID){
                data.lists[i].entries[j].name = name;
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Del a certain todolist from dom
 * @param listId the list to delete
 */
function delTodoListFromDom(id){
    //$(".todo-list#" + id).addClass("animated bounceOut");
    $(".todo-list#" + id).remove();
    if(data.lists.length == 0){
        var welcomeDiv = $('.welcome');
        welcomeDiv.css("visibility", "visible");
        welcomeDiv.css("opacity", "1");
        welcomeDiv.css("height", "100%");
    }
}

/**
 * Add a list to the store
 * @param name
 * @returns Number of the newly created list
 */
function addTodoListToStore(name){
    var ID = data.lists.length;
    list = {id: ID,
        name : name,
        entries : []};
    data.lists.push(list);
    localStorage.setItem('data', JSON.stringify(data));
    return ID;
}

/**
 * Del a certain todolist from store
 * @param listId the list to delete
 */
function delTodoListFromStore(id){
    for(i = 0; i < data.lists.length; i++){
        if(data.lists[i].id ==id){
            data.lists.splice(i, 1);
        }
        localStorage.setItem('data', JSON.stringify(data));
    }
}

/**
 * Add a new todolist item to dom
 * @param name name of the entry / content
 * @param entryID
 * @param listID
 */
function addEntryToDom(name, entryID, listID){
    $("#" + listID + " .empty").css("display", "none");
    $('#' + listID + " .card-body").prepend("<div id='" + entryID + "' class='todo-entry card text-white bg-info'><div class='checkbox-div' class='col-2'><input type='checkbox' class='" + listID +"' id='" + entryID +"-check'><label for='" + entryID + "-check'></label></div><input class='content col-8 input-field' value='" + name + "'><div class='delEntry badge badge-pill badge-danger col-2 " + entryID + "'><i class=\"fa fa-times\" aria-hidden=\"true\"></i></div></div>");
    //Remove button functionality
    var delEntryButton = $('#' + entryID + " .delEntry");
    delEntryButton.bind("click",function(){
        delEntryFromStore(entryID);
        delEntryFromDom(entryID, listID);
    });

    for(var i = 0; i < data.lists.length; i++){
        for(var j = 0; j < data.lists[i].entries.length; j++){
            if(data.lists[i].entries[j].id == entryID){
                $('#' + entryID + '-check').prop('checked', data.lists[i].entries[j].checked);
            }
        }
    }

    if($('#' + listID + ' .progBar').length === 0){
        $("#" + listID + " .progressBar").append('<div class="progBar">\n' +
            '                                <div class="progFilled ' + listID + '">\n' +
            '                                    <div class=\'amountOfChecked\'>0/1</div>\n' +
            '                                </div>\n' +
            '                            </div>');
        var progress = getProgress(listID);
        $("#" + listID + " .amountOfChecked").text(progress);
        setProgressbarValue(listID, progress);
    } else{
        var progress = getProgress(listID);
        $("#" + listID + " .amountOfChecked").text(progress);
        setProgressbarValue(listID, progress);
    }

    var listEntryCheckbox = $('input#' + entryID + '-check.' + listID);
    if(listEntryCheckbox.is(':checked')){
        $('#' + entryID + ".todo-entry input").css("text-decoration", "line-through");
    }
    listEntryCheckbox.change(function(){
       setEntryCheck(this.checked, entryID);
       var todoEntry = $('#' + entryID + ".todo-entry input");
       if(this.checked){
           todoEntry.css("text-decoration", "line-through");
       } else{
           todoEntry.css("text-decoration", "none");
       }

        var progress = getProgress(listID);
        $("#" + listID + " .amountOfChecked").text(progress);
        setProgressbarValue(listID, progress)
    });

    $('#' + listID + ' #' + entryID +  ' .input-field').bind('change', function(){
        changeEntryName($('#' + listID + ' #' + entryID +  ' .input-field').val(), entryID);
    });
}

/**
 * Set the progressbar in dom to progress progress
 * @param listID
 * @param progress
 */
function setProgressbarValue(listID, progress){
    $('#' + listID + ' .progFilled.' + listID).css("width", eval(progress)*100 + "%");
}

/**
 * Set an entry in data as checked / unchecked in case the user changed a value
 * @param checked true if checkbox was checked
 * @param entryID the entry which was checked
 */
function setEntryCheck(checked, entryID) {
    for (i = 0; i < data.lists.length; i++) {
        for (j = 0; j < data.lists[i].entries.length; j++) {
            if(data.lists[i].entries[j].id == entryID){
                data.lists[i].entries[j].checked = checked;
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Get the progress for a list
 * @param listID id of the list
 * @returns string as string 2/2
 */
function getProgress(listID){
    entireEntries = 0;
    checkedEntries = 0;
    for(i = 0; i < data.lists.length; i++){
        if(data.lists[i].id == listID){
            entireEntries = data.lists[i].entries.length;
            for(j = 0; j < data.lists[i].entries.length; j++){
                if(data.lists[i].entries[j].checked){
                    checkedEntries ++;
                }
            }
        }
    }
    return String(checkedEntries) + "/" + String(entireEntries);
}

/**
 * Delete todoentry from dom
 * @param entryID
 * @param listID
 */
function delEntryFromDom(entryID, listID){
    $("#" + entryID + ".todo-entry").remove();
    var progress = getProgress(listID);
    $("#" + listID + " .amountOfChecked").text(progress);
    setProgressbarValue(listID, progress);
    for(i = 0; i < data.lists.length; i++){
        if(data.lists[i].id == listID){
            if(data.lists[i].entries.length == 0){
                $("#" + listID + " .empty").css("display", "block");
                $("#" + listID + " .progBar").remove();
            }
        }
    }
}

/**
 * Add
 * @param name the name of the entry / content
 * @param listID id of the list the entry is in
 * @returns the id of the new created entry
 */
function addEntryToStore(name, listID){
    entryID = data.count;
    data.count += 1;
    for(i = 0; i < data.lists.length; i++) {
        if (data.lists[i].id == listID) {
            data.lists[i].entries.push({
                id: entryID,
                name: name,
                checked: false
            });
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
    return entryID;
}

/**
 * Delete an entry from the store
 * @param entryID the id of the entry
 */
function delEntryFromStore(entryID){
    for(i = 0; i < data.lists.length; i++){
        for(j = 0; j < data.lists[i].entries.length; j++){
            if(data.lists[i].entries[j].id == entryID){
                data.lists[i].entries.splice(j, 1);
                break;
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Restore the data which is saved in browser storage
 * --> Lists and list entries
 */
function restoreData(){
    for(var i = 0; i < data.lists.length; i++){
        addTodoListToDom(data.lists[i].name, data.lists[i].id);
        for(var j = 0; j < data.lists[i].entries.length; j++){
                addEntryToDom(data.lists[i].entries[j].name, data.lists[i].entries[j].id, data.lists[i].id);
        }
    }
    if(data.lists.length != 0){
        var welcomeDiv = $('.welcome');
        welcomeDiv.css("visibility", "hidden");
        welcomeDiv.css("opacity", "0");
    }
}
