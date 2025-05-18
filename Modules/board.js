class board {
    #workingCat;
    #workingVal;
    constructor(parent, type) {
        this.catagories = new Map();
        this.root = createElementBT({
            type: 'div',
            classList: 'game-board',
        });
        parent.appendChild(this.root);
        switch (type) {
            case "Jeopardy":
                this.dblJeopardy = false;
                break;
            case "Double Jeopardy":
                this.dblJeopardy = true;
                break;
            case "test":
                this.makeTest();
                break;
            default:
        }
    }

    /**
     * 
     * @param {{title: String, 
     * questionArr: [{prompt: String, answer: String}, 
     * {prompt: String, answer: String}, 
     * {prompt: String, answer: String}, 
     * {prompt: String, answer: String}, 
     * {prompt: String, answer: String}]} } catagoryConstructorObj 
     *
     */
    addCatagory(catagoryConstructorObj) {
        const col = this.catagories.size + 1;
        const newCatagory = new catagory(this.root, col);
        newCatagory
            .setTitle(catagoryConstructorObj.title)
            .setDoubleJeopardy(this.dblJeopardy);
        catagoryConstructorObj.questionArr.forEach((question) => {
            newCatagory.addQuestion(question);
        });
        this.catagories.set(catagoryConstructorObj.title, newCatagory);

    }

    makeTest() {
        for (let i = 1; i < 7; i++) {
            const testConstructor = {
                title: "Test Title".concat(` ${i}`),
                questionArr: [
                    { prompt: "The answer to 1 + 1", answer: 2 },
                    { prompt: "The answer to 1 + 1", answer: 2 },
                    { prompt: "The answer to 1 + 1", answer: 2 },
                    { prompt: "The answer to 1 + 1", answer: 2 },
                    { prompt: "The answer to 1 + 1", answer: 2 },
                ],
            };
            this.addCatagory(testConstructor);
        }
    }

    choose({ catagory, value }) {
        this.#workingCat = this.catagories.get(catagory);
        this.#workingVal = value;
        this.#workingCat.setState({ value: this.#workingVal, state: "Active" });
    }

    isAvailable({ catagory, value }) {
        const workingCat = this.catagories.get(catagory);
        return workingCat.isAvailable(value);
    }

    finishQuestion() {
        this.#workingCat.setState({ value: this.#workingVal, state: "Attempted" });
    }

}