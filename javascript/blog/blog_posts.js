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
mainBlog.newPost(
    "Ruby on Rails Web Apps",
    "I absolutly love building applications that other people can use. Over the past year I have learned to program web apps using the Ruby on Rails framework. Today I have added a new section to my portfolio to show off a few projects I have made. Feel free to take a look at the code!",
    "9/24/2016"
);
mainBlog.newPost(
    "Angular JS - Scholars Bowl",
    "I Have added a new application that uses AngularJS. This new application allows users to" +
        "use a virtual scholars bowl score sheet to keep track of their information. Give it a shot!",
    "6/17/2017"
);
mainBlog.newPost(
    "Software Engineer",
    "I realized that I have not updated this website very much since getting a job as a software" + 
    " engineer. I am currently updating a few things to keep it more current with what I am up to.",
    "5/18/2018"
);
mainBlog.newPost(
	"Halloween",
	"As we get to the end of September we are nearing one of my favorite months, October. One of the reasons I love the month, besides the weather, is because it ends with a holiday that lets me channel my creative side. Over the past several years since moving into my house every Halloween I try to add something new to my decorations. It started with just a pressure sensor made out of two cardboard sheets and some foil attached to a raspberry pi and arduino nano. When the trick or treaters would come up to my door they were greeted with a short LED show around my door and the theme to Stranger Things. The code that I use can be found on my github page. https://github.com/PhillipAC/strangerLights",
	"9/28/2019"
);