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

const testQuestion = new question(app);
testQuestion
    .setValue(200)
    .setPrompt("The value of 1 + 1 is")
    .setAnswer("2")
    .setPosition({ column: 6, row: 5 });

