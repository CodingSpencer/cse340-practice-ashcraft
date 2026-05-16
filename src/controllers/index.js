// Route handlers for static pages
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
};

const aboutPage = (req, res) => {
    const studentProfile = {
        name: 'Spencer Ashcraft',
        age: 22,
        desc: "💻 I’m a Software Engineering student...",
        major: 'Software Engineering',
        hobbies: ["🏓 Ping Pong", "🥏 Disc Golf", "📚 Reading", "🛠️ Home Labs"]
    };

    res.render('about', { 
        title: 'About', 
        heading: 'Welcome to About Me', 
        student: studentProfile 
    });
};

const demoPage = (req, res) => {
    res.render('demo', { title: 'Middleware Demo Page' });
};

//  Test error on middleware
const testErrorPage = (req, res, next) => {
    try {
        // Simulating a real runtime error
        throw new Error('This is a test error');
    } catch (err) {
        // This hands the error directly over to your global error middleware
        next(err); 
    }
};

export { homePage, aboutPage, demoPage, testErrorPage };