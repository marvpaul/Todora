var data = null;
var card = "            <div class=\"list text-white bg-primary mb-3\">\n" +
    "                <div class=\"titleList card-header \">Meine Liste1</div>\n" +
    "                <div class=\"card-body\">\n" +
    "                    <br>\n" +
    "                        <div class='empty'>" +
    "                            Leere Liste" +
    "                        </div>" +
    "<br><input class='todo-entry-input'> <button class='add btn btn-success'>Add entry</button>\n" +
    "                            <br><button class='del todo-list btn btn-danger'>Delete todo</button>\n"+
    "                </div>\n" +
    "            </div>\n" +
    "        </div>"
$(document).ready(function() {

    data = JSON.parse(localStorage.getItem('data'));
    if(data == null){
        data = {
            "lists" : [],
            "count" : 0
        };
    }
    restoreData();

    document.getElementById("createTODO").addEventListener("click", function(){
        addList(event);
    });
    console.log(data)
});

function addList(event) {
    var name = $("#inputNewList").val();
    $("#inputNewList").val("");
    addTodolist(name);
}

function addTodolist(name){
    $('.info.welcome').css("display", "none");

    var ID = data.lists.length;
    list = {id: ID,
            name : name,
            entries : []};
    data.lists.push(list);
    localStorage.setItem('data', JSON.stringify(data));

    //Add list template
    $('#gridView').append("<div class=\"text-center col-12 col-md-4 todo-list animated bounceIn\" id=\"" + ID + "\">" + card);
    $('#' + ID + " .card-header").text(name);

    //Add button functionality
    $('#' + ID + " .add").attr("id", ID);
    $('#' + ID + " .add").bind("click",function(){
        addTodolistItem(event)
    });

    $('.del.todo-list').bind("click", function(){
        delTodoList(ID);
    })
}

/**
 * Remove a todolist item
 * @param event the event which is fired when pressing the delete button
 */
function delListItem(event, entryId, listId){
    for(i = 0; i < data.lists.length; i++){
        for(j = 0; j < data.lists[i].entries.length; j++){
            console.log(entryId);
            if(data.lists[i].entries[j].id == entryId){

                data.lists[i].entries.splice(j, 1);
                $("#" + entryId + ".todo-entry").addClass("animated bounceOut");
                window.setTimeout( function(){
                    $("#" + entryId + ".todo-entry").remove();
                }, 1000);

                if(data.lists[i].entries.length == 0){
                    $("#" + listId + " .empty").css("display", "block");
                }
                break;
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Add a new todolist item
 * @param event the event which is fired when pressing the add button
 */
function addTodolistItem(event){
    for(i = 0; i < data.lists.length; i++){
        if(data.lists[i].id == event.target.id){
            content = $("#" + i + " input.todo-entry-input").val();
            $("#" + i + " input.todo-entry-input").val("");
            $("#" + i + " .empty").css("display", "none");
            entryID = data.count;
            data.count += 1;
            data.lists[i].entries.push({
                id : entryID,
                name : content,
                checked : false
            });
            localStorage.setItem('data', JSON.stringify(data));

            $('#' + data.lists[i].id + " .card-body").prepend("<div id='" + entryID + "' class='todo-entry card text-white bg-info animated bounceIn'><div id='checkbox-div' class='col-md-2'><input type='checkbox'></div><div id='content' class='col-md-8'>" + content + " </div><div class='delEntry badge badge-pill badge-danger col-md-2' " + entryID + "><i class=\"fa fa-times\" aria-hidden=\"true\"></i></div></div>");

            delListItemEvent(entryID, i);
        }
    }
}

function delListItemEvent(entryId, listId){
    //Remove button functionality
    $('#' + entryId + " .delEntry").attr("id", entryId);
    $('#' + entryId + " .delEntry").addClass(listId);
    $('#' + entryId + " .delEntry").bind("click",function(){

        delListItem(event, entryId, listId);
    });
}

/**
 * Del a certain todo list
 * @param listId the list to delete
 */
function delTodoList(listId){
    for(i = 0; i < data.lists.length; i++){
        if(data.lists[i].id == listId){
            data.lists.splice(i, 1);
            $(".todo-list#" + listId).addClass("animated bounceOut");
            window.setTimeout( function(){
                $(".todo-list#" + listId).remove();
            }, 1000);
        }
        localStorage.setItem('data', JSON.stringify(data));
    }
    if(data.lists.length == 0){
        $('.info.welcome').css("display", "block");
    }
}

function restoreData(){
    for(i = 0; i < data.lists.length; i++){
        $('.info.welcome').css("display", "none");

        ID = data.lists[i].id;

        //Add list template
        $('#gridView').append("<div class=\"text-center col-12 col-md-4 todo-list animated bounceIn\" id=\"" + ID + "\">" + card);
        $('#' + ID + " .card-header").text(data.lists[i].name);

        //Add button functionality
        $('#' + ID + " .add").attr("id", ID);
        $('#' + ID + " .add").bind("click",function(){
            addTodolistItem(event)
        });

        $('.del.todo-list').bind("click", function(){
            delTodoList(ID);
        })

        for(j = 0; j < data.lists[i].entries.length; j++){
            console.log("Hello");
                content = data.lists[i].entries[j].name;
                $("#" + i + " .empty").css("display", "none");
                entryID = data.lists[i].entries[j].id;

                $('#' + data.lists[i].id + " .card-body").prepend("<div id='" + entryID + "' class='todo-entry card text-white bg-info animated bounceIn'><div id='checkbox-div' class='col-md-2'><input type='checkbox'></div><div id='content' class='col-md-8'>" + content + " </div><div class='delEntry badge badge-pill badge-danger col-md-2' " + entryID + "><i class=\"fa fa-times\" aria-hidden=\"true\"></i></div></div>");

                delListItemEvent(entryID, i);

        }
    }
}
