
/**************************************************************************
 * When the document is loaded it GETs the Todos and displays in a table
 * see getData function below
 * ***********************************************************************/
var ulEmployees = $('#ulEmployees');
var uri = "https://localhost:44325/api/todos";

$(document).ready(function () {
    getData();
});

$('#btn').click(function () {
    getData();
    $.ajax({
        type: 'GET',
        url: 'https://localhost:44325/api/todos',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',

        success: function (data) {
            ulEmployees.empty();
            $.each(data, function (index, val) {
                var title = val.title;
                ulEmployees.append('<li>' + title + '</li>')
            });
        }
    });
});

$('#btnClear').click(function () {
    ulEmployees.empty();
});

/*****************************************************************************************
 * This function calls the todos web api and passes a todo item which is then stored in
 * SQL database 
 * *************************************************************(*************************/
function addItem() {
    const item = {
        'Title': $('#add-title').val(),
        'isDone': false
    };

    $.ajax({
        type: 'POST',
        accepts: 'application/json',
        url: 'https://localhost:44325/api/todos',
        contentType: 'application/json',
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert('in error function');
        },
        success: function (result) {
            getData();
            //   $('#add-title').val('');
        }
    });
}

/*****************************************************************************************
 * This function calls the todos web api and GETs the data stored in the SQL table Todos
 * It then writes a tabke to the client displaying all the Todos
 **************************************************************(*************************/
function getData() {
   $.ajax({
        type: 'GET',
        url: 'https://localhost:44325/api/todos',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            $('#todos').empty();
            $.each(data, function (key, item) {
                const checked = item.isDone ? 'checked' : '';

                $('<tr><td><input disabled="true" type="checkbox" ' + checked + '></td>' +
                    '<td>' + item.title + '</td>' +
                    '<td><button onclick="editItem(' + item.id + ')">Edit</button></td>' +
                    '<td><button onclick="deleteItem(' + item.id + ')">Delete</button></td>' +
                    '</tr>').appendTo($('#todos'));
            });

            todos = data;
        }
    });
}


/******************************************************************************************
 * This function calls the todos web api and DELETS the selected record
 * It then re-writes the grid/table to the client displaying all the remaining Todos
 ****************************************************************************************/
function deleteItem(id) {
    alert("in delete function");
    $.ajax({
        url: uri + '/' + id,
        type: 'DELETE',
        success: function (result) {
            getData();
        }
    });
}

/*****************************************************************************************
 * This function calls the todos web api and DELETS the selected record
 * It then re-writes the grid/table to the client displaying all the remaining Todos
 ****************************************************************************************/
function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $('#edit-title').val(item.title);
            $('#edit-id').val(item.id);
            $('#edit-isDone').val(item.isDone);
        }
    });
    $('#spoiler').css({ 'display': 'block' });
}

$('.my-form').on('submit', function () {
    const item = {
        'title': $('#edit-title').val(),
        'isDone': $('#edit-isDone').is(':checked'),
        'id': $('#edit-id').val()
    };

    $.ajax({
        url: uri + '/' + $('#edit-id').val(),
        type: 'PUT',
        accepts: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $('#spoiler').css({ 'display': 'none' });
}