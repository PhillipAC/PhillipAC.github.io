var mainBlog = new Blog();

mainBlog.newPost(
    "First Post",
    "I have added a simple javascript blog to my website.",
    "5/4/2016"
);
mainBlog.newPost(
    "New Applet - Bridges & Shortcuts - Trivia",
    "I have added a new version of my previous game \"Bridges & Shortcuts\" " +
    ".This time around you are required to answer some trivia questions " +
    "presented on \"cards\" before you can roll. The main reason I made this" +
    "version of the game is to show off how you can easily expand a game with" +
    "new features. I also seperated the code into seperate files to allow for" +
    " various objects to be reused. <br>"+
    "Play it <a href='/applets/trivia_game.html'>here!</a>",
    "5/4/2016"
);
mainBlog.newPost(
    "Single Pages",
    "Today I added some code to let each post be able to be displayed in a page by itself using URL parameters. Each post is displaid in the post.html website and a parameter of id=# will display the post with that id. Go ahead and try it out by click the title of this post, then try clicking on another post's title.",
    "5/6/2016"
);