var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('EmployeesList')/items";
var queryURLLib = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeDocuments')/items?$select=FileLeafRef,FileRef,Created,Author/ID,Author/Title&$expand=Author/ID,Author/Title";

function getUsingFetch() {
    let payload = {
        method: 'GET',
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        credentials: 'same-origin'
    }
    fetch(queryURL, payload)
        .then(response => response.json())
        .then((data) => {
            let items = data.d.results;
            fnDisplayDataTable(items, 'List');
        })
}


function getUsingRest() {
    var confirmVal = confirm(`Select Ok to display "Document Library"\n\nSelect Cancel to display "List"`);
    if(confirmVal === true){
        var getURL = queryURLLib;
        var toDisplay = 'Document Library';
    } else{
        var getURL = queryURL;
        var toDisplay = 'List';
    }
    $.ajax({
        url: getURL,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        async: false,
        success: function (data) {
            let items = data.d.results;
            fnDisplayDataTable(items, toDisplay);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function fnDisplayDataTable(tableData, type) {
    if(type === 'List'){
        var datatableColumns = [
            {title: "S. No", className: 'dt-body-center'},
            {data: "Title", title: "Employee Full Name"},
            {data: "Designation", title: "Designation"},
            {data: "ProfileImage", title: "Profile Image",
                className: 'dt-body-center',
                render: function (data, type, row) {
                    return formatProfileImage(data)
                }
            }
        ];
    } else{
        var datatableColumns = [
            {title: "S. No", className: 'dt-body-center'},
            {data: "FileLeafRef", title: "Document"},
            {data: "Author", title: "Modified By",
                className: 'dt-body-center',
                render: function (data, type, row) {
                    return formatUser(data)
                }},
            {data: "FileRef", title: "Download",
                className: 'dt-body-center',
                render: function (data, type, row) {
                    return formatView(data)
                }
            }
        ];
    }
    $('#EmployeeListID').DataTable({
        "language": {
            "emptyTable": "No Records available"
        },
        "autoWidth": false,
        data: tableData,
        columns: datatableColumns,
        "columnDefs": [{
            "render": function (data, type, full, meta) {
                tableData[meta.row].id = meta.row + 1; // adds id to dataset
                return meta.row + 1; // adds id to serial no
            },
            "targets": 0
        }]
    });
    $("#toDisplay").text(type);
    $("#EmployeeListID th").css({
        "text-align": "center",
        "background-color": "#476f96",
        "color": "white",
        "padding": "5px",
        "font-weight": "400"});
}

function formatProfileImage(data) {
    return '<img src="' + data + '" style="width:50px">';
}

function formatView(data){
    return '<a href="'+data+'"><img src="../SiteAssets/download.png"></a>'
}

function formatUser(data){
    return '<span>'+data.Title+'</span>'
}