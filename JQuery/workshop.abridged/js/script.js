
var bookDataFromLocalStorage = [];

$(function(){
   
    loadBookData();
    var data = [
        {title:"資料庫",value:"image/database.jpg"},
        {title:"網際網路",value:"image/internet.jpg"},
        {title:"應用系統整合",value:"image/system.jpg"},
        {title:"家庭保健",value:"image/home.jpg"},
        {title:"語言",value:"image/language.jpg"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "title",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    var BookCategory = $("#book_category").data("kendoDropDownList");
    BookCategory.select(0);

    $("#bought_datepicker").kendoDatePicker({
        format:"yyyy-MM-dd"
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]
        
    });
    $(".book-grid-search").on("input",searchBook);


    //Window
    var window = $("#addBookWindow"),
        addBook = $("#add-book-btn"),
        add = $("#add-btn");
        add.click(function(){
            window.data("kendoWindow").center().open();
        })

        addBook.click(function(){
        //addBook.fadeOut();
        
        window.data("kendoWindow").close();
        });
        /*
        function onClose(){
        addBook.fadeIn();
        }*/
    window.kendoWindow({
        modal:true,
        width:"400px",
        title:"新增書籍",
        visible:false,
        actions:[
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        //close:onClose
    })//.data("kendoWindow").center.open();
});

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
        //console.log(bookDataFromLocalStorage);
    }
}

 //換圖片 
function onChange(){
    var BookImg=$("#book_category").val(); //路徑
    $(".book-image").attr("src",BookImg) ; 
}
 
 //刪除資料   
 /*
function deleteBook(e){
    e.preventDefault();
    var dataItem = this.dataItem($(e.target).closest("tr"));
    var index=$("#book_grid").data("kendoGrid").dataSource.BookId;
    if (confirm('Do you really want to delete this book?')){
        var dataSource = $("#book_grid").data("kendoGrid").dataSource;
        dataSource.remove(dataItem);
        dataSource.sync();
        bookDataFromLocalStorage.splice(index,1);
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
        
    }
    
}*/
function deleteBook(e){
    e.preventDefault();
    var dataItem = this.dataItem($(e.target).closest("tr"));
        if (confirm('Do you really want to delete ?')) {
            var dataSource = $("#book_grid").data("kendoGrid").dataSource;
            dataSource.remove(dataItem);
            dataSource.sync();
            for(var i=0;i<bookDataFromLocalStorage.length;i++){
                if(dataItem.BookId == bookDataFromLocalStorage[i].BookId){
                    bookDataFromLocalStorage.splice(i,1);
                    localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
                }
            }            
        }
}

//新增
$("#add-book-btn").click(function(){

var 
    book_id = parseInt(bookDataFromLocalStorage[bookDataFromLocalStorage.length-1].BookId)+1,
    book_category = $("#book_category").data("kendoDropDownList").text(),
    book_name = $("#book_name").val(),
    book_author = $("#book_author").val(),
    bought_datepicker = $("#bought_datepicker").val();
    
    bookDataFromLocalStorage.push({
    BookId : book_id,
    BookCategory : book_category,
    BookName : book_name,
    BookAuthor : book_author,
    BookBoughtDate : bought_datepicker
    })

    $("#book_grid").data("kendoGrid").dataSource.read()
    localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    
});

//查詢
function searchBook(){
    var value = this.value,
        filters = {field:"BookName",operator:"contains",value:value}; 
    $("#book_grid").data("kendoGrid").dataSource.filter(filters);
}
        


 /*
    var value = $("#book_category").val();
   $("#image")
   .toggleClass("book-image",value==1)
   .toggleClass("interent",value==2)
   .toggleClass("system",value==3)
   .toggleClass("home",value==4)
   .toggleClass("language",value==5);
*/