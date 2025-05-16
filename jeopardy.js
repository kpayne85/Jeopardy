function addAutoResizer(element) {
    window.addEventListener('resize', () => {
        const x = window.visualViewport.width;
        const y = window.visualViewport.height;
        element.style.width = `${x}px`;
        element.style.height = `${y}px`;
    });
    const x = window.visualViewport.width;
    const y = window.visualViewport.height;
    element.style.width = `${x}px`;
    element.style.height = `${y}px`;
}


const gameArea = gameAreaFactory();
const startpage = startPageFactory();


const app = gameArea(document.querySelector('body'));
addAutoResizer(app);
// const start = startpage(app);
// document.querySelector("#start-submit").type = "submit";
const g = new game(app);


// const testQuestion = new question(app);
// testQuestion
//     .setValue(200)
//     .setPrompt("The value of 1 + 1 is")
//     .setAnswer("2")
//     .setPosition({ column: 6, row: 5 });

// const testCatagory = new Map();
// testCatagory.set("Test Catagory", new question(app));
// testCatagory.get("Test Catagory")
//     .setValue("TestCatagory")
//     .setPosition({ column: 1, row: 0 });

// testCatagory.set(200, new question(app));
// testCatagory.get(200)
//     .setValue(200)
//     .setPrompt("This is the $200 question")
//     .setAnswer("200")
//     .setPosition({ column: 1, row: 1 });

// testCatagory.set(400, new question(app));
// testCatagory.get(400)
//     .setValue(400)
//     .setPrompt("This is the $400 question")
//     .setAnswer("400")
//     .setPosition({ column: 1, row: 2 });

// testCatagory.set(600, new question(app));
// testCatagory.get(600)
//     .setValue(600)
//     .setPrompt("This is the $600 question")
//     .setAnswer("600")
//     .setPosition({ column: 1, row: 3 });

// testCatagory.set(800, new question(app));
// testCatagory.get(800)
//     .setValue(800)
//     .setPrompt("This is the $800 question")
//     .setAnswer("800")
//     .setPosition({ column: 1, row: 4 });

// testCatagory.set(1000, new question(app));
// testCatagory.get(1000)
//     .setValue(1000)
//     .setPrompt("This is the $1000 question")
//     .setAnswer("1000")
//     .setPosition({ column: 1, row: 5 });

