var Post = function(id, title, body, date){
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
}
Post.prototype.display = function(element){
    var $mainElement = $("<div></div>")
                        .addClass("post");
    var $title = $("<h2></h2>")
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

var Blog = function(){
    this.posts = []; 
};
Blog.prototype.getAmount = function(i){
    if(i !== undefined){return this.posts.length;}
    else{return this.posts.length-i;}
};
Blog.prototype.newPost = function(title,body,date){
    this.posts.push(new Post(this.getAmount(),title,body,date));
};
Blog.prototype.getPost = function(i){
    return this.posts[i];
    
};
Blog.prototype.deletePost = function(){
    this.posts.splice(i, 1);
};
Blog.prototype.updatePost = function(index, title, body, date){
    var post = this.getPost(index);
    post.title = title;
    post.body = body;
    post.date = date;
    this.posts[index]=post;
};
Blog.prototype.display = function(element){
    for(var i = this.posts.length-1; i >= 0; i--){
        this.posts[i].display(element);
    }
};