var mainBlog = new Blog();

mainBlog.newPost(
    "First Post",
    "I have added a simple javascript blog to my website.",
    "5/4/2016"
);

console.log(mainBlog.posts[0].title);

mainBlog.display("#Blog");