class board {
    #workingCat;
    #workingVal;
    #catagories = [];
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
                this.makeBoard();
                break;
            case "Double Jeopardy":
                this.dblJeopardy = true;
                this.makeBoard();
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

    async makeBoard() {
        //make sure we have catagories to choose from
        await this.#getCatagories();
        //make the board

        Promise.all([
            this.makeCatagory(),
            this.makeCatagory(),
            this.makeCatagory(),
            this.makeCatagory(),
            this.makeCatagory(),
            this.makeCatagory(),
        ]).then(() => {
            //tell everyone that the board is ready.
            const boardReadyEvent = new CustomEvent('boardReady', { detail: "Pop!", bubbles: true });
            this.root.dispatchEvent(boardReadyEvent);
        });




    }

    async makeCatagory() {
        //choose a random catagory
        const randCatIdx = Math.floor((Math.random() * this.#catagories.length));
        const randCat = this.#catagories.splice(randCatIdx, 1)[0];
        //get questions for catagory
        const questions = await this.#getQuestions(randCat.id);
        //construct template
        const catConstruct = {
            title: randCat.title,
            questionArr: [
                { prompt: questions[0].question, answer: questions[0].answer },
                { prompt: questions[1].question, answer: questions[1].answer },
                { prompt: questions[2].question, answer: questions[2].answer },
                { prompt: questions[3].question, answer: questions[3].answer },
                { prompt: questions[4].question, answer: questions[4].answer },
            ],
        };
        //add catagory by template
        this.addCatagory(catConstruct);
    }

    async #getCatagories() {
        if (this.#catagories.length === 0) {
            const getString =
                `https://rithm-jeopardy.herokuapp.com/api/categories?count=100`;
            const res = await axios.get(getString);
            this.#catagories = [...res.data];
        }
    }

    async #getQuestions(id) {
        const getString =
            `https://rithm-jeopardy.herokuapp.com/api/category?id=${id}`;

        const res = await axios.get(getString);
        return [...res.data.clues];
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