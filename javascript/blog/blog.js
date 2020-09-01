var getUrlVars = function()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


var Post = function(id, title, body, date){
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
}
Post.prototype.display = function(element){
    var $mainElement = $("<div></div>")
                        .addClass("post");
    var $title = $("<a href='/static_pages/post.html?id=" + this.id + "'><h2></h2></a>")
                        .text(this.title);
    var $body = $("<div></div>")
                        .html(this.body);
    var $date = $("<br><i></i></br>")
                        .text(this.date);
    $title.appendTo($mainElement);
    $body.appendTo($mainElement);
    $date.appendTo($mainElement);
    $mainElement.appendTo($(element));
};

var Blog = function(dataSource, element){
    this.dataSource = `https://docs.google.com/spreadsheets/d/${dataSource}/gviz/tq?gid=0&headers=1&tq=`;
    this.posts = []; 
    this.element = element;
};
Blog.prototype.getAmount = function(id){
    if(id == undefined)
    {
        return this.posts.length;
    }
    else
    {
        return this.posts.length-id;
    }
};
Blog.prototype.getPost = function(id){
    var queryString = encodeURIComponent(`SELECT * WHERE A = ${id}`);
    var query = new google.visualization.Query(this.dataSource+queryString);
    query.send(function(response){this.loadResponse(response, this)}.bind(this));
};
Blog.prototype.getRangeAsc = function(id, count){
    var queryString = encodeURIComponent(`select * where A >= ${id} limit ${count}`);
    var query = new google.visualization.Query(this.dataSource+queryString);
    query.send(function(response){this.loadResponse(response, this)}.bind(this));
}
Blog.prototype.getRangeDesc = function(count, skip){
    var queryString = encodeURIComponent(`select * order by A desc limit ${count} offset ${skip}`);
    var query = new google.visualization.Query(this.dataSource+queryString);
    query.send(function(response){this.loadResponse(response, this)}.bind(this));
}
Blog.prototype.loadResponse = function(response)
{
    var data = response.getDataTable();
    var responseAmount = data.getNumberOfRows();
    for (var i = 0; i < responseAmount; i++)
    {
        this.posts.push(new Post(data.getValue(i, 0), data.getValue(i,1), data.getValue(i,2), data.getValue(i,3)));
    }
    this.posts.sort(function(a, b){ return a.id - b.id });
    this.display(this.element);
}
Blog.prototype.display = function(element){
    for(var i = this.posts.length-1; i >= 0; i--){
        this.posts[i].display(element);
    }
};
Blog.prototype.addButtons = function(page, element)
{
    console.log(page);
    page = page == undefined ? 1 : Number(page);
    $(element).addClass("blogNavigation")
    if (page !== undefined && page !== 1)
    {
        var backButton = $(`<a class="left" href="/index.html?page=${page-1}"></a>`).text("Newer");
        $(element).append(backButton);
    }
    
    var forwardButton = $(`<a class="right" href="/index.html?page=${(page+1)}"></a>`).text("Older");
    $(element).append(forwardButton);
}