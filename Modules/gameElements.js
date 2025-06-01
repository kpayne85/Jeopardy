class timer {
    constructor(func, delay, ...rest) {
        this.callback = func;
        this.delay = delay;
        this.args = rest;
        this.remainingTime = 0;
        this.status = "Ready";
    }

    start() {
        this.startTime = new Date();
        this.status = "Running";
        this.timer = setTimeout(() => { this.run(); }, this.delay);
    }
    pause() {
        this.pauseTime = new Date();
        const elapsedTime = (this.pauseTime - this.startTime);
        if (elapsedTime < this.delay) {
            clearTimeout(this.timer);
            this.remainingTime = this.delay - elapsedTime;
            this.status = "Paused"
        }
    }
    resume() {
        if (this.status === "Paused") {
            this.status = "Running";
            this.startTime = new Date();
            this.timer = setTimeout(() => { this.run(); }, this.remainingTime);
            this.remainingTime = 0;
        }

    }
    reset() {
        if (this.status === "Running" || this.status === "Paused") {
            clearTimeout(this.timer);
            this.status = "Ready";
            this.remainingTime = 0;
        }
    }
    run() {
        this.status = "Finished";
        this.remainingTime = 0;
        this.callback(...this.args);
    }
}

class gameArea extends abstractElemCollection {
    constructor() {
        super();
        const loaded = {
            eventType: 'DOMContentLoaded',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.loaded();
            },
        };
        this.addEvent(loaded);

    }

    resize() {
        const x = window.visualViewport.width;
        const y = window.visualViewport.height;
        this.elem.style.width = `${x}px`;
        this.elem.style.height = `${y}px`;
    }
    loaded() {
        this.build()
            .appendAsChildOf(document.querySelector('body'))
            .resize();
        const g = new game(this.elem);
        g.build();
    }

    eventConstructor() {
        const autoResize = {
            eventType: 'resize',
            eventTarget: window,
            eventFunction: (event, type, target) => {
                if (event.target === target &&
                    event.type === type) {
                    this.resize();
                }
            },
        };

        this.addEvent(autoResize);

    }

    actionConstructor() {/*no actions*/ }

    constructorTemplate() {

        const gameArea = {
            tag: 'div',
            options: { id: "app" },
        };

        const template = new tree(gameArea);
        return template;
    }
}

class chat extends abstractElemCollection {
    constructor() {
        super();
    }
    build() {
        super.build(chatHook);
        return this;
    }

    chatEvent(e) {
        const audio = new Audio("./media/sounds/chat_chime.wav");
        audio.play();
        const said = e.detail.said;
        const who = e.detail.who;
        new elemConstructor('p')
            .setOptions({ innerText: `${who}: ${said}` })
            .appendAsChildOf(chatHistory);

        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    eventConstructor() {
        const chat = {
            eventType: 'chat',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.chatEvent(event);
            },
        };

        this.addEvent(chat);

    }

    actionConstructor() { }

    constructorTemplate() {
        const root = {
            tag: 'div',
            options: { id: 'chatRoot' },
        };
        const history = {
            tag: 'div',
            options: { id: 'chatHistory', },
        };
        const inputLabel = {
            tag: 'label',
            options: {
                innerText: "Say:",
                htmlFor: "chatInput",
                id: "chatInputLabel",
            },
        };
        const chatInput = {
            tag: 'input',
            options: {
                id: 'chatInput',
                name: 'chatInput',
            },
        };
        const template = new tree(root);
        template
            .addChild(history)
            .addChild(inputLabel)
            .addChild(chatInput);
        return template;
    }
}

class question extends abstractElemCollection {
    constructor() {
        super();

    }
    build() {
        super.build();
        this.appendAsChildOf(this.parent);
        this.valueLink = this.elem.children[0].children[0].children[0];
        this.promptLink = this.elem.children[0].children[1].children[0].children[0];
        this.innerLink = this.elem.children[0];
        this.questionBack = this.elem.children[0].children[1];
        return this;
    }
    setParent(p) {
        this.parent = p;
        return this;
    }
    setValue(val, catagory) {
        this.value = val;
        this.valueLink.innerText = `$${val}`;
        this.valueLink.setAttribute("data-catagory", catagory);
        return this;
    }
    setPrompt(prompt) {
        this.promptLink.innerText = prompt;
        this.prompt = prompt;
        return this;
    }
    setAnswer(ans) {
        this.answer = ans;
        return this;
    }
    setPosition({ column = 1, row = 0 }) {
        switch (column) {
            case 1:
                this.innerLink.classList.add('first-column');
                break;

            case 2:
                this.innerLink.classList.add('second-column');
                break;

            case 3:
                this.innerLink.classList.add('third-column');
                break;

            case 4:
                this.innerLink.classList.add('fourth-column');
                break;

            case 5:
                this.innerLink.classList.add('fifth-column');
                break;

            case 6:
                this.innerLink.classList.add('sixth-column');
                break;
            default:
        }

        switch (row) {
            case 1:
                this.innerLink.classList.add('first-row');
                break;

            case 2:
                this.innerLink.classList.add('second-row');
                break;

            case 3:
                this.innerLink.classList.add('third-row');
                break;

            case 4:
                this.innerLink.classList.add('fourth-row');
                break;

            case 5:
                this.innerLink.classList.add('fifth-row');
                break;

            case 0:
                this.innerLink.classList.add('title-row');
                break;
            default:
        }

        return this;

    }

    setActivity(bool) {
        if (bool) {
            this.elem.classList.add("active");
        } else {
            this.elem.classList.remove("active");
        }
        return this;
    }

    attempt() {
        this.valueLink.classList.add("attempted");
    }

    //need to implement these methods in decendant class.
    eventConstructor() { }

    actionConstructor() { }

    constructorTemplate() {

        const question = {
            tag: 'div',
            options: { classList: 'question' },
        };
        const questionInner = {
            tag: 'div',
            options: { classList: 'question-inner' },
        };
        const questionFront = {
            tag: 'div',
            options: { classList: 'question-front' },
        };
        const questionValue = {
            tag: 'p',
            options: { classList: 'question-value' },
        };
        const questionBack = {
            tag: 'div',
            options: { classList: 'question-back' },
        };
        const questionDisplay = {
            tag: 'div',
            options: { classList: 'question-display' },
        };
        const questionText = {
            tag: 'p',
            options: { classList: 'question-text' },
        };


        const template = new tree(question);
        template.addChild(questionInner);
        template.children[0] //question inner
            .addChild(questionFront)
            .addChild(questionBack);
        template.children[0].children[0] //question front
            .addChild(questionValue);
        template.children[0].children[1] //question back
            .addChild(questionDisplay);
        template.children[0].children[1].children[0] //question display
            .addChild(questionText);
        return template;
    }
}

class catTitle extends abstractElemCollection {
    constructor() {
        super();
    }

    build() {
        super.build();
        this.appendAsChildOf(this.parent);
        this.innerLink = this.elem.children[0];
        return this;
    }
    setParent(p) {
        this.parent = p;
        return this;
    }

    //need to implement these methods in decendant class.
    eventConstructor() { }

    actionConstructor() { }

    constructorTemplate() {

        const outerElem = {
            tag: 'div',
            options: { classList: 'question' },

        };
        const innerElem = {
            tag: 'div',
            options: { classList: 'title-element' },
        };

        const titleText = {
            tag: 'h2',
            options: { classList: 'title-text' },
        };
        const template = new tree(outerElem);
        template.addChild(innerElem);
        template.children[0].addChild(titleText);

        return template;
    }


    setTitle(title) {
        this.innerLink.children[0].innerText = title;
        return this;
    }
    setPosition({ column = 1, row = 0 }) {
        switch (column) {
            case 1:
                this.innerLink.classList.add('first-column');
                break;

            case 2:
                this.innerLink.classList.add('second-column');
                break;

            case 3:
                this.innerLink.classList.add('third-column');
                break;

            case 4:
                this.innerLink.classList.add('fourth-column');
                break;

            case 5:
                this.innerLink.classList.add('fifth-column');
                break;

            case 6:
                this.innerLink.classList.add('sixth-column');
                break;
            default:
        }

        switch (row) {
            case 1:
                this.innerLink.classList.add('first-row');
                break;

            case 2:
                this.innerLink.classList.add('second-row');
                break;

            case 3:
                this.innerLink.classList.add('third-row');
                break;

            case 4:
                this.innerLink.classList.add('fourth-row');
                break;

            case 5:
                this.innerLink.classList.add('fifth-row');
                break;

            case 0:
                this.innerLink.classList.add('title-row');
                break;
            default:
        }

        return this;

    }
}

class catagory {
    constructor(parent, column) {

        this.data = new Map();
        this.questionState = new Map();
        this.appendPoint = parent;
        this.column = column;
        this.dblJeopardy = false;
    }

    setTitle(title) {
        const titleElem = new catTitle();
        titleElem
            .setParent(this.appendPoint)
            .build()
            .setTitle(title)
            .setPosition({ column: this.column, row: 0 });
        this.data.set("Title", titleElem);
        this.title = title;
        return this;
    }
    setDoubleJeopardy(bool) {
        this.dblJeopardy = bool;
        return this;
    }
    addQuestion({ prompt, answer }) {
        const questionNum = this.data.size;
        if (questionNum >= 1 && questionNum <= 5) {
            const value = this.dblJeopardy ?
                questionNum * 400 : questionNum * 200;
            this.data.set(value, new question());
            this.data.get(value)
                .setParent(this.appendPoint)
                .build()
                .setValue(value, this.title)
                .setPrompt(prompt)
                .setAnswer(answer)
                .setPosition({ column: this.column, row: questionNum });
            this.questionState.set(value, "Available");
        }
        return this;
    }
    setState({ value, state }) {
        if (state === "Active") {
            this.data.get(value).setActivity(true);
            this.questionState.set(value, state);
        }
        if (state === "Attempted") {
            this.data.get(value).setActivity(false).attempt();
            this.data.get(value).questionBack.classList.remove("buzzin");
            this.questionState.set(value, state);

        }
    }
    canBuzz(questionValue, bool) {
        const q = this.data.get(questionValue);
        if (bool) {
            q.questionBack.classList.add("buzzin");
        }
        else {
            q.questionBack.classList.remove("buzzin");
        }
    }

    isAvailable(value) {
        const state = this.questionState.get(Number.parseInt(value));
        if (state === "Available") return true;
        return false;
    }
}
class board extends abstractElemCollection {
    #workingCat;
    #workingVal;
    #catagories = [];
    constructor() {
        super();
        this.titleArr = [];
        this.catagories = new Map();
    }

    build() {
        super.build();
        this.appendAsChildOf(boardHook);
        const madeboard = new Promise((resolve, reject) => {
            setTimeout(() => reject("timeout"), 5000);
            this.makeBoard().then(() => resolve(), (err) => reject());
        });
        madeboard.then(
            () => { return this; },
            (err) => console.log(err)
        );
        return this;
    }

    setDoubleJeopardy(bool) {
        this.dblJeopardy = bool;
        return this;
    }

    availableCatagories() {
        return { data: this.catagories };
    }

    eventConstructor() {
        const checkAvailCata = {
            eventType: 'checkAvailableCatagories',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.sendAvailableCatagories(this.availableCatagories());
            },
        };
        const gameUpdate = {
            eventType: 'updateGameState',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                const { state, ...rest } = { ...event.detail };
                switch (state) {
                    case 'top of the round':
                        const { gameStart } = { ...rest };
                        if (!gameStart) {
                            this.finishQuestion();
                        }
                        break;
                    case 'question chosen':
                        const { catagory, value } = { ...rest };
                        this.choose({ catagory, value });

                        break;
                    default:
                }

            },
        };
        this.addEvent(gameUpdate);
        this.addEvent(checkAvailCata);
    }

    actionConstructor() {
        const sendAvailCata = {
            fnName: "sendAvailableCatagories",
            sender: globalThis.document,
            type: "availableCatagories",
            dataObj: {},
        };
        this.addAction(sendAvailCata);

    }

    constructorTemplate() {
        const gameBoard = {
            tag: 'div',
            options: { classList: 'game-board' },
        };
        const template = new tree(gameBoard);
        return template;
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
        const newCatagory = new catagory(this.elem, col);
        newCatagory
            .setTitle(catagoryConstructorObj.title)
            .setDoubleJeopardy(this.dblJeopardy);
        catagoryConstructorObj.questionArr.forEach((question) => {
            newCatagory.addQuestion(question);
        });
        this.catagories.set(catagoryConstructorObj.title, newCatagory);
        this.titleArr.push(catagoryConstructorObj.title);

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
        ]).then(() => { return true; },
            (err) => { console.log(err) });
    }

    async makeCatagory() {
        //choose a random catagory
        const randCatIdx = Math.floor((Math.random() * this.#catagories.length));
        const randCat = this.#catagories.splice(randCatIdx, 1)[0];
        //get questions for catagory
        const { title, id } = { ...randCat };
        const questions = await this.#getQuestions(id);
        //construct template        
        const catConstruct = {
            title: title,
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

class game extends abstractElemCollection {
    constructor(parent) {
        super();
        this.parent = parent;
    }

    build() {
        const buildGame = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("timeout");
            }, 5000);

            super.build();
            this.appendAsChildOf(this.parent);
            const gb = new board();
            gb.setDoubleJeopardy(false);
            gb.build();
            resolve(true);
        });

        buildGame
            .then(
                () => this.finishBuild(),
                (err) => console.log("there was an error building the board")
            );


    }

    finishBuild() {
        new chat().build();
        //     const gameHost = new host(hostHook);
        const orderChooser = ["Player 1", "Player 2", "Player 3"];
        const getHook = this.playerChooser(orderChooser);
        const human = new humanPlayer(getHook);
        human.setName("Keaton")
            .build()
            .setPictureSource("");
        const bot1Hook = this.playerChooser(orderChooser);
        const bot1 = new computerPlayer(bot1Hook);
        bot1.setName("Mr. Roboto")
            .build()
            .setPictureSource("")
            .setAttributes({ dex: 10, int: 10, wis: 10, con: 10 });
        const bot2Hook = this.playerChooser(orderChooser);
        const bot2 = new computerPlayer(bot2Hook);
        bot2.setName("Calculon")
            .build()
            .setPictureSource("")
            .setAttributes({ dex: 10, int: 10, wis: 10, con: 10 });
        new host().build();


        this.boardReady();
    }

    playerChooser(arr) {
        const rand = Math.floor(Math.random() * arr.length);
        const iAm = arr.splice(rand, 1);
        switch (iAm[0]) {
            case "Player 1":
                return contestantOneHook;
            case "Player 2":
                return contestantTwoHook;
            case "Player 3":
                return contestantThreeHook;
            default:
        }
    }

    eventConstructor() {

    }

    actionConstructor() {

        //make action constructor object

        const myAction = {
            fnName: "boardReady",
            sender: globalThis.document,
            type: "boardReady",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            dataObj: {},
        };

        //add your custom event

        this.addAction(myAction);
    }

    constructorTemplate() {

        const root = {
            tag: 'div',
            options: { id: "gameRoot" },
        };
        const upper = {
            tag: 'div',
            options: { id: "gameUpper" },
        };
        const lower = {
            tag: 'div',
            options: { id: "gameLower" },
        };
        const boardHook = {
            tag: 'div',
            options: { id: "boardHook" },
        };
        const rightPannel = {
            tag: 'div',
            options: { id: "rightPannel" },
        };
        const hostHook = {
            tag: 'div',
            options: { id: "hostHook" },
        };
        const chatHook = {
            tag: 'div',
            options: { id: "chatHook" },
        };
        const contestantOneHook = {
            tag: 'div',
            options: {
                id: "contestantOneHook",
                classList: "contestant"
            },
        };
        const contestantTwoHook = {
            tag: 'div',
            options: {
                id: "contestantTwoHook",
                classList: "contestant"
            },
        };
        const contestantThreeHook = {
            tag: 'div',
            options: {
                id: "contestantThreeHook",
                classList: "contestant"
            },
        };

        const template = new tree(root);
        template
            .addChild(upper)
            .addChild(lower);
        template.children[0]    //upper
            .addChild(boardHook)
            .addChild(rightPannel);
        template.children[1]    //lower
            .addChild(contestantOneHook)
            .addChild(contestantTwoHook)
            .addChild(contestantThreeHook);
        template.children[0].children[1]    //rightPannel
            .addChild(hostHook)
            .addChild(chatHook);

        return template;
    }
}
