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
    "Play it <a href='applets/trivia_game.html'>here!</a>",
    "5/4/2016"
);

console.log(mainBlog.posts[0].title);

mainBlog.display("#Blog");