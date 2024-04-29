(function ($, window, document, undefined) {
    var pluginName = "editable",
        defaults = {
            keyboard: true,
            dblclick: true,
            button: true,
            buttonSelector: ".edit",
            maintainWidth: true,
            dropdowns: {},
            edit: function () { },
            save: function () { },
            cancel: function () { }
        };

    function editable(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    editable.prototype = {
        init: function () {
            this.editing = false;

            if (this.options.dblclick) {
                $(this.element)
                    .css('cursor', 'pointer')
                    .bind('dblclick', this.toggle.bind(this));
            }

            if (this.options.button) {
                $(this.options.buttonSelector, this.element)
                    .bind('click', this.toggle.bind(this));
            }
        },

        toggle: function (e) {
            e.preventDefault();

            this.editing = !this.editing;

            if (this.editing) {
                this.edit();
            } else {
                this.save();
            }
        },

        edit: function () {
            var instance = this,
                values = {};

            $('td[data-field]', this.element).each(function () {
                var input,
                    field = $(this).data('field'),
                    value = $(this).text(),
                    width = $(this).width();

                values[field] = value;

                $(this).empty();

                if (instance.options.maintainWidth) {
                    $(this).width(width);
                }

                if (field in instance.options.dropdowns) {
                    input = $('<select></select>');

                    for (var i = 0; i < instance.options.dropdowns[field].length; i++) {
                        $('<option></option>')
                            .text(instance.options.dropdowns[field][i])
                            .appendTo(input);
                    };

                    input.val(value)
                        .data('old-value', value)
                        .dblclick(instance._captureEvent);
                } else {
                    input = $('<input type="text" required/>')
                        .val(value)
                        .data('old-value', value)
                        .dblclick(instance._captureEvent);
                }

                input.appendTo(this);

                if (instance.options.keyboard) {
                    input.keydown(instance._captureKey.bind(instance));
                }
            });

            this.options.edit.bind(this.element)(values);
        },

        save: function () {
            var instance = this,
                values = {};

            $('td[data-field]', this.element).each(function () {
                var value = $(':input', this).val();

                values[$(this).data('field')] = value;

                $(this).empty()
                    .text(value);
            });

            this.options.save.bind(this.element)(values);
        },

        cancel: function () {
            var instance = this,
                values = {};

            $('td[data-field]', this.element).each(function () {
                var value = $(':input', this).data('old-value');

                values[$(this).data('field')] = value;

                $(this).empty()
                    .text(value);
            });

            this.options.cancel.bind(this.element)(values);
        },

        _captureEvent: function (e) {
            e.stopPropagation();
        },

        _captureKey: function (e) {
            if (e.which === 13) {
                this.editing = false;
                this.save();
            } else if (e.which === 27) {
                this.editing = false;
                this.cancel();
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new editable(this, options));
            }
        });
    };

})(jQuery, window, document);

editTable();

function editTable() {
    $(function () {
        var pickers = {};

        $('table tr').editable({
            dropdowns: {
                sex: ['Male', 'Female']
            },
            edit: function (values) {
                $(".edit i", this)
                    .removeClass('fa-pencil')
                    .addClass('fa-save')
                    .attr('title', 'Save');

                // pickers[this] = new Pikaday({
                //     field: $("td[data-field=birthday] input", this)[0],
                //     format: 'MMM D, YYYY'
                // });
            },
            save: function (values) {
                $(".edit i", this)
                    .removeClass('fa-save')
                    .addClass('fa-pencil')
                    .attr('title', 'Edit');

                if (this in pickers) {
                    pickers[this].destroy();
                    delete pickers[this];
                }
            },
            cancel: function (values) {
                $(".edit i", this)
                    .removeClass('fa-save')
                    .addClass('fa-pencil')
                    .attr('title', 'Edit');

                if (this in pickers) {
                    pickers[this].destroy();
                    delete pickers[this];
                }
            }
        });
    });
}

$(".add-row").click(function () {
    var columnCount = $("#editableTable thead tr th").length;
    var newRow = "<tr id='row'>";
    for (var i = 0; i < columnCount - 1; i++) {
        newRow += "<td data-field=''></td>";
    }
    newRow += "<td><a class='button button-small edit' title='Edit'><i class='fa fa-pencil'></i></a> <a class='button button-small' title='Delete'><i class='fa fa-trash'></i></a></td>";
    newRow += "</tr>";
    $("#editableTable").find("tbody tr:first").before(newRow);
    editTable();
    setTimeout(function () {
        $("#editableTable").find("tbody tr:first td:last a[title='Edit']").click();
    }, 200);

    setTimeout(function () {
        $("#editableTable").find("tbody tr:first td:first input[type='text']").focus();
    }, 300);

    $("#editableTable").find("a[title='Delete']").unbind('click').click(function (e) {
        if (confirm("Are you sure you want to delete entire row?") == true) {
            $(this).closest("tr").remove();
        }
    });
});

$(".add-rows").click(function () {
    var columnCount = $("#editableTables thead tr th").length;
    var newRow = "<tr id='row'>";
    for (var i = 0; i < columnCount - 1; i++) {
        newRow += "<td data-field=''></td>";
    }
    newRow += "<td><a class='button button-small edit' title='Edit'><i class='fa fa-pencil'></i></a> <a class='button button-small' title='Delete'><i class='fa fa-trash'></i></a></td>";
    newRow += "</tr>";
    $("#editableTables").find("tbody tr:first").before(newRow);
    editTable();
    setTimeout(function () {
        $("#editableTables").find("tbody tr:first td:last a[title='Edit']").click();
    }, 200);

    setTimeout(function () {
        $("#editableTables").find("tbody tr:first td:first input[type='text']").focus();
    }, 300);

    $("#editableTables").find("a[title='Delete']").unbind('click').click(function (e) {
        if (confirm("Are you sure you want to delete entire row?") == true) {
            $(this).closest("tr").remove();
        }
    });
});


var rowCount = 0;
$(".add-rowes").click(function () {
    var columnCount = $("#editableTables thead tr th").length;
    var newRow = "<tr id='row_" + rowCount + "'>";

    newRow += "<td><select class='form-control' id='select_" + rowCount + "'>";
    newRow += "<option>Internship</option>";
    newRow += "<option>Probation</option>";
    newRow += "<option>Permanent</option>";
    newRow += "</select></td>";

    for (var i = 1; i < columnCount - 1; i++) {
        newRow += `<td data-field='' id='editdata_${rowCount}_${i}' name='editdata_${rowCount}_${i}'></td>`;
    }

    newRow += "<td><a class='button button-small edit' title='Edit'><i class='fa fa-pencil'></i></a> <a class='button button-small' title='Delete'><i class='fa fa-trash'></i></a></td>";

    newRow += "</tr>";
    $("#editableTables").find("tbody tr:first").before(newRow);
    editTable();

    rowCount++;

    // Click the 'Edit' button of the newly added row
    setTimeout(function () {
        $("#editableTables").find("tbody tr:first td:last a[title='Edit']").click();
    }, 200);

    // Set focus to the first input/select of the newly added row
    setTimeout(function () {
        $("#editableTables").find("tbody tr:first td:first select").focus();
    }, 300);

    // Bind click event to the 'Delete' button
    $("#editableTables").find("a[title='Delete']").unbind('click').click(function (e) {
        if (confirm("Are you sure you want to delete entire row?") == true) {
            $(this).closest("tr").remove();
        }
    });
});

$("#editableTable").find("a[title='Delete']").click(function (e) {
    if (confirm("Are you sure you want to delete entire row?") == true) {
        $(this).closest("tr").remove();
    }
});
$("#editableTables").find("a[title='Delete']").click(function (e) {
    if (confirm("Are you sure you want to delete entire row?") == true) {
        $(this).closest("tr").remove();
    }
});

$("#leave-form").click(function () {
    var leaveQuotaDataArray = [];

    $("#editableTables tbody tr").each(function () {
        var rowId = $(this).attr('id');
        if (!rowId) {
            rowId = 'row_' + rowCount++;
            $(this).attr('id', rowId);
        } else {
            rowId = rowId.split('_')[1]; 
        }
        var selectedOption = $("#select_" + rowId).val(); 
        var leaveQuotaData = {
            type: selectedOption,
            sick: parseInt($("#editdata_" + rowId + "_1 input").val()),
            casual: parseInt($("#editdata_" + rowId + "_2 input").val()),
            birthday: parseInt($("#editdata_" + rowId + "_3 input").val()),
            year: parseInt($("#yearInput").val()),
            employee_status: $("#employeeStatusInput").val()
        };

        leaveQuotaDataArray.push(leaveQuotaData);
    });
    leaveQuotaDataArray.pop();
    console.log(leaveQuotaDataArray);


    // $.ajax({
    //     type: "POST",
    //     url: "/add-leave-quota",
    //     data: JSON.stringify(leaveQuotaData),
    //     contentType: "application/json",
    //     success: function (response) {
    //         console.log("Leave quota added successfully:", response);
    //     },
    //     error: function (error) {
    //         // Handle error response
    //         console.error("Failed to add leave quota:", error.responseText);
    //     }
    // });
});
