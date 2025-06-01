class abstractPerson extends abstractElemCollection {
    constructor() {
        if (new.target === abstractPerson) {
            throw new ErrorEvent("This class cannot be instantiated");
        }
        super();
        this.properties = {};
        this.personMap = new Map();
        this.gameState = {};

    }
    setName(name) {
        this.properties.name = name;
    }

    buildPersonMap(e) {
        const { name, ...rest } = e.detail;
        this.personMap.set(name, rest);
    }

    conversationListener(e) {
    }

    utter(utterance) {
        const u = {
            who: this.properties.name,
            said: utterance,
        }
        this.say(u);
    }
    /**
     * 
     * @returns Array of strings that contain catagories with at least one active Question.
     */
    availableCatagories() {
        const catArr = [...this.availcat.values()];
        const isAvail = catArr.map((c) => {
            const qs = [...c.questionState.values()];
            return qs.includes('Available');
        });
        const catTitles = [...this.availcat.keys()];

        const availCata = catTitles.map((v, i) => {
            const avail = isAvail[i];
            if (avail) {
                return v;
            }
        });
        return availCata;
    }
    /**
     * 
     * @param {String} catName 
     * @returns An Array of values for available Questions.
     */
    availValues(catName) {
        const workingCat = this.availcat.get(catName);
        const vals = [...workingCat.questionState.keys()];
        const availVals = vals.map((v) => {
            const a = workingCat.isAvailable(v);
            if (a) {
                return v;
            }
        });
        return availVals;
    }

    eventConstructor() {

        //Example Event

        // for each event you want your collection to handle,
        // make an event handler object

        const introduction = {
            eventType: 'introduce',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.buildPersonMap(event);
            },
        };
        const listen = {
            eventType: 'chat',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.conversationListener(event);
            },
        };
        const gameUpdate = {
            eventType: 'updateGameState',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.gameStateUpdated(event.detail);
            },
        };
        const updateCat = {
            eventType: 'availableCatagories',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.availcat = event.detail.data;
            },
        };


        // pass your event handler object to add event

        this.addEvent(introduction);
        this.addEvent(listen);
        this.addEvent(gameUpdate);
        this.addEvent(updateCat);

    }
    gameStateUpdated(gameStateObj) {
        for (let key in gameStateObj) {
            this.gameState[key] = gameStateObj[key];
        }
        switch (this.gameState.state) {
            case 'introductions':
                this.intoduceSelf(this.properties);
                break;
            default:

        }
    }

    actionConstructor() {

        //make action constructor object

        const introduceSelf = {
            fnName: "intoduceSelf",
            sender: globalThis.document,
            type: "introduce",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            dataObj: {},
        };
        const say = {
            fnName: "say",
            sender: this.elem,
            type: "chat",
            dataObj: {},
        };
        const checkCat = {
            fnName: "checkCat",
            sender: globalThis.document,
            type: 'checkAvailableCatagories',
            dataObj: {},
        };

        //add your custom event

        this.addAction(introduceSelf);
        this.addAction(say);
        this.addAction(checkCat);

    }

    constructorTemplate() {
        throw new ErrorEvent("This method needs to be implemented in decendant");
    }
}

class host extends abstractPerson {
    constructor() {
        super();
        this.properties.role = "Host";

    }

    build() {
        this.setName("Alex");
        super.build(hostHook);
        this.readingTimer = new timer(
            this.gameUpdate,
            0,
            { state: 'awaiting buzzer' }
        );
        this.buzzerTimer = new timer(
            this.gameUpdate,
            5000,
            { state: 'buzzer expired' }
        );
        this.answerTimer = new timer(
            this.gameUpdate,
            15000,
            { state: 'resume buzzin' }
        );
    }

    conversationListener(e) {
        const { who, said } = e.detail;
        if (who !== this.properties.name) {
            setTimeout(() => {
                // const { role, score, player } = this.personMap.get(who);
                const { state, chooser, from } = { ...this.gameState };
                switch (state) {
                    case 'awaitingChoice':
                        if (who !== chooser) {
                            this.utter(`I am sorry, ${who}, it is not your turn.`);
                        } else {
                            this.gs2(said);
                        }
                        break;
                    case 'awaiting answer':
                        if (who !== from) {
                            this.utter(`I am sorry, ${who}, is answeing right now.`);
                        } else {
                            this.gs5(said);
                        }
                        break;
                    default:
                }

            }, 200);
        }
    }
    buildPersonMap(e) {
        super.buildPersonMap(e);
    }

    eventConstructor() {
        super.eventConstructor();
        const gameReady = {
            eventType: 'boardReady',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.startGame();
            },
        };
        this.addEvent(gameReady);
        const hearBuzzer = {
            eventType: 'buzzer',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                if (this.gameState.state === 'awaiting buzzer') {
                    this.gameUpdate({
                        state: 'awaiting answer',
                        from: event.detail.who
                    });
                    const activeCat = this.availcat.get(this.gameState.catagory);
                    activeCat.canBuzz(this.gameState.value, false);
                }
            },
        };
        this.addEvent(hearBuzzer);
    }

    actionConstructor() {
        super.actionConstructor();

        const updateGameState = {
            fnName: "gameUpdate",
            sender: globalThis.document,
            type: "updateGameState",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            dataObj: {},
        };
        const scoreChange = {
            fnName: "scoreChange",
            sender: globalThis.document,
            type: "scoreChange",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            dataObj: {},
        };
        this.addAction(updateGameState);
        this.addAction(scoreChange);
    }

    constructorTemplate() {
        const root = {
            tag: 'div',
            options: { id: 'hostRoot' }
        }
        const displayPic = {
            tag: 'img',
            options: { id: 'displayPic' },
        };

        const template = new tree(root);
        template
            .addChild(displayPic);

        return template;
    }

    gameStateUpdated(gameStateObj) {
        super.gameStateUpdated(gameStateObj);
        this.checkCat();
        switch (this.gameState.state) {
            case 'question chosen':
                this.gs3();
                break;
            case 'awaiting buzzer':
                this.gs4();
                break;
            case 'buzzer expired':
                this.gs4a();
                break;
            case 'top of the round':
                this.gs1();
                break;
            case 'awaiting answer':
                this.buzzerTimer.pause();
                this.answerTimer.start();
                break;
            case 'resume buzzin':
                this.scoreChange({
                    who: this.gameState.from,
                    value: -this.gameState.value,
                });
                this.gs4();
                break;

            default:
        }
    }
    read(script, after, args) {
        this.utter(script);
        const lettersPerSecond = 21;
        const additionalTime = 1;
        const promptLength = script.length
        const timeToRead = Math.floor(((promptLength / lettersPerSecond)
            + additionalTime) * 1000);
        const rTimer = new timer(after, timeToRead, args);

        rTimer.start();
    }

    startGame() {
        this.gameUpdate({ state: "introductions" });
        const script1 = "Welcome to Jeopardy!";
        this.read(script1, () => {
            const script2 = "Use your space bar as your buzzer, and type in any answers to the prompts. Remember to give your answers in the form of a question!";
            this.read(script2, () => {
                let p1;
                for (let key of this.personMap.keys()) {
                    const val = this.personMap.get(key);
                    if (val.player === "Player 1") p1 = key;
                }
                const script2 = ` When the game started, ${p1} was selected as the first player to choose a question.`;
                this.read(script2, this.gameUpdate,
                    {
                        state: "top of the round",
                        chooser: p1,
                        gameStart: true
                    });
            });
        });
    }
    gs1() {
        //get whoever is the current chooser
        const { chooser } = { ...this.gameState };
        const script = `${chooser}, please tell me the catagory and value of the clue you want me to read.`;
        this.read(script, this.gameUpdate, { state: "awaitingChoice" });
    }
    gs2(phrase) {
        //make array of optional chars
        const optionalChars = [' ', '"', "'", ".", "!", "?", "/", "$"];
        //get the available catagories
        const titles = this.availableCatagories();
        //for each catagory
        const titleExp = titles.map((t) => {

            const tSplit = t.split("");        //split it up
            const tSplitMap = tSplit.map((c) => {
                const found = optionalChars.find((o) => {   //check if its an optional char
                    return o === c;
                });
                if (found) {
                    c += "?";   //add a question mark
                }
                return c;      //add result back to map
            });
            const tJoin = tSplitMap.join("");
            tJoin.replaceAll("s ", "s? ");
            return tJoin;
        });

        //make title expressions into regexes
        const regexes = titleExp.map((t) => {
            return new RegExp(t, "i");
        });

        //test the phrase against the regexes
        const idx = regexes.findIndex((r) => {
            return r.test(phrase);
        });
        //get back original title if match or "no match"
        let chosenCatagory = (idx) ? titles[idx] : "no match";

        const valregex = /\d\d\d\d?/;
        const valtest = valregex.exec(phrase);
        const chosenVal = parseInt((valtest) ? valtest[0] : undefined);


        let hasCatagory = false;
        let hasValue = false;
        let isAvailable = false;


        if (chosenCatagory !== 'no match') hasCatagory = true;
        if (chosenVal) hasValue = true;
        if (hasCatagory && hasValue) {
            isAvailable = this.availcat.get(chosenCatagory).isAvailable(chosenVal);
        }
        if (!hasCatagory && hasValue) {
            if (this.gameState.prevCatagory) {
                if (this.availcat.get(this.gameState.prevCatagory).isAvailable(chosenVal)) {
                    chosenCatagory = this.gameState.prevCatagory;
                    hasCatagory = true;
                    isAvailable = true;
                }
            }
        }
        if (hasCatagory && !hasValue) {
            this.gameState.prevCatagory = chosenCatagory;
        }


        if (!hasCatagory && !hasValue)
            this.read("I am sorry, I did not get that.");
        if (hasCatagory && !hasValue)
            this.read(`${chosenCatagory}, for what value?`);
        if (hasCatagory && hasValue && !isAvailable)
            this.read("I am sorry, that is not available.");
        if (hasCatagory && hasValue && isAvailable)
            this.questionChosen(chosenCatagory, chosenVal);
    }

    questionChosen(chosenCatagory, chosenVal) {
        const theCat = this.availcat.get(chosenCatagory);
        const { prompt, answer } = { ...theCat.data.get(chosenVal) };

        const script = `${this.gameState.chooser} has chosen ${chosenCatagory} for ${chosenVal}.`;
        this.read(script, this.gameUpdate, {
            state: 'question chosen',
            catagory: chosenCatagory,
            value: chosenVal,
            prompt,
            answer,
        })
    }

    gs3() {
        this.gameUpdate({ state: 'reading' });
        this.read(this.gameState.prompt, this.gameUpdate, { state: 'awaiting buzzer' });
    }
    gs4() {
        const alertSound = new Audio("./media/sounds/alert.wav");
        alertSound.play();
        const activeCat = this.availcat.get(this.gameState.catagory);
        activeCat.canBuzz(this.gameState.value, true);
        if (this.buzzerTimer.status === "Paused") {
            this.buzzerTimer.resume();
        } else {
            this.buzzerTimer.start();
        }

    }
    gs4a() {
        const badNoAnswer = new Audio("./media/sounds/wrong.wav");
        badNoAnswer.play();
        const script = `I am sorry the answer was ${this.gameState.answer}`;
        this.read(script, this.gameUpdate,
            {
                state: 'top of the round',
                prevCatagory: this.gameState.catagory,
                catagory: "",
                value: "",
                prompt: "",
                answer: "",
                gameStart: false,
            });
    }
    #hasQuestionWord(userInput) {
        const questionRegexes = [
            new RegExp("who", "i"),
            new RegExp("what", "i"),
            new RegExp("when", "i"),
            new RegExp("where", "i"),
            new RegExp("why", "i"),
            new RegExp("how", "i"),
        ];
        const containsQuestion = questionRegexes.find((q) => {
            return q.test(userInput);
        });
        if (containsQuestion) return true;
        return false;
    }
    #hasAnswer(userInput) {
        const answerReg = new RegExp(this.gameState.answer, "i");
        return answerReg.test(userInput);
    }
    gs5(attemptedAnswer) {

        const badNoAnswer = new Audio("./media/sounds/wrong.wav");
        const success = new Audio("./media/sounds/success.mp3");
        const formOfQuestion = this.#hasQuestionWord(attemptedAnswer);
        const containsAnswer = this.#hasAnswer(attemptedAnswer);
        let script;
        const { from, value } = { ...this.gameState };
        this.answerTimer.reset();

        if (!formOfQuestion) {
            script = "I am sorry that was not in the form of a question.";
            this.scoreChange({
                who: from,
                value: -value
            });
            badNoAnswer.play();
            this.read(script, this.gameUpdate,
                {
                    state: 'awaiting buzzer',
                });
        }
        if (formOfQuestion && containsAnswer) {
            this.buzzerTimer.reset();
            script = "Correct! Please choose the next question.";
            this.scoreChange({
                who: from,
                value: value
            });
            success.play();
            this.read(script, this.gameUpdate,
                {
                    state: 'top of the round',
                    prevCatagory: this.gameState.catagory,
                    chooser: from,
                    catagory: "",
                    value: "",
                    prompt: "",
                    answer: "",
                    from: "",
                    gameStart: false,
                });
        }
        if (formOfQuestion && !containsAnswer) {
            script = `I am sorry, that is incorrect`;
            this.scoreChange({
                who: from,
                value: -value
            });
            badNoAnswer.play();
            this.read(script, this.gameUpdate,
                {
                    state: 'awaiting buzzer',
                });
        }
    }
}

class contestant extends abstractPerson {
    constructor(hook) {
        super();
        this.myHook = hook;
        this.properties = {};
        this.properties.role = "Contestant";
        this.properties.score = 0;
        this.properties.player = this.whatPlayerAmI();
        this.gameState = {};
        this.properties.onPenalty = false;
        this.resetPen = function () { this.properties.onPenalty = false; }
        this.penaltyTimer = new timer(this.resetPen, 250);

    }
    build() {
        super.build();
        this.appendAsChildOf(this.myHook);
        this.displayScore = this.elem.children[3];
        this.displayScore.innerText = "$0";
        if (this.properties.name) {
            this.elem.children[2].innerText = this.properties.name;
        }
        return this;
    }

    setName(name) {
        super.setName(name);
        if (this.elem) {
            this.elem.children[2].innerText = name;
        }
        return this;
    }

    setPictureSource(src) {
        this.elem.children[0].src = src;
        return this;
    }

    whatPlayerAmI() {
        switch (this.myHook) {
            case contestantOneHook:
                return "Player 1";
            case contestantTwoHook:
                return "Player 2";
            case contestantThreeHook:
                return "Player 3";
            default:
        }
    }

    updateScore({ who, value }) {
        if (this.properties.name === who) {
            this.properties.score += value;
            this.displayScore.innerText = `$${this.properties.score}`;
        }
    }
    //need to implement these methods in decendant class.
    eventConstructor() {
        super.eventConstructor();
        const scoreChange = {
            eventType: 'scoreChange',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.updateScore(event.detail);
            },
        };
        this.addEvent(scoreChange);
    }

    actionConstructor() {
        super.actionConstructor();
        const buzzIn = {
            fnName: "buzzIn",
            sender: this.elem,
            type: 'buzzer',
            dataObj: {},
        };

        //add your custom event

        this.addAction(buzzIn);
    }

    constructorTemplate() {
        // create any templates for elements

        const root = {
            tag: 'div',
            options: { classList: "contestant-background" },
        };
        const contestant = {
            tag: 'img',
            options: { classList: "contestant-image" },
        };
        const podium = {
            tag: 'img',
            options: { classList: "contestant-podium" },
        };
        const displayName = {
            tag: 'p',
            options: { classList: "contestant-name" },
        };
        const displayScore = {
            tag: 'p',
            options: { classList: "contestant-score" },
        };

        // add root and any children to template tree how you want them organized
        // as html tags.

        const template = new tree(root);
        template
            .addChild(contestant)
            .addChild(podium)
            .addChild(displayName)
            .addChild(displayScore);

        // return the template

        return template;
    }
}

class humanPlayer extends contestant {
    constructor(hook) {
        super(hook);
    }

    eventConstructor() {
        super.eventConstructor();
        const saySomething = {
            eventType: 'keyup',
            eventTarget: chatInput,
            eventFunction: (event, type, target) => {
                if (event.key === 'Enter' && event.target === target) {
                    this.utter(chatInput.value);
                    chatInput.value = '';
                }
            },
        };
        const boardClick = {
            eventType: 'click',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                if (this.gameState.state === 'awaitingChoice'
                    && this.gameState.chooser === this.properties.name) {
                    this.boardClickEvent(event, type, target);
                }
            },
        };
        const buzzIn = {
            eventType: 'keydown',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                if (event.key === ' ') {
                    this.buzzFunc();
                }
            },
        };

        this.addEvent(buzzIn);
        this.addEvent(saySomething);
        this.addEvent(boardClick);

    }
    gameStateUpdated(gameStateObj) {
        super.gameStateUpdated(gameStateObj);
        this.highlightBoard(false);
        if (this.gameState.state === 'awaitingChoice' &&
            this.gameState.chooser === this.properties.name) {
            this.highlightBoard(true);
        }
        if (this.gameState.state === 'awaiting answer'
            && this.gameState.from === this.properties.name) {
            chatInput.focus();
        }
    }
    highlightBoard(bool) {
        if (bool) {
            boardHook.classList.add("choose");
        } else {
            boardHook.classList.remove("choose");
        }
    }
    buzzFunc() {
        switch (this.gameState.state) {
            case 'reading':
                this.properties.onPenalty = true;
                this.penaltyTimer.start();
                break;
            case 'awaiting buzzer':
                if (this.properties.onPenalty === false) {
                    const myBuzzer = new Audio("./media/sounds/Player_Buzz.mp3");
                    myBuzzer.play();
                    this.buzzIn({ who: this.properties.name });
                }
                break;
            default:
        }
    }

    boardClickEvent(event, type, target) {
        if (event.target.classList.contains("question-front")) {
            //get the question value
            const val = event.target.firstElementChild.innerText;
            //get the catagory
            const cat = event.target.firstElementChild.getAttribute('data-catagory');
            const phrase = `I would like ${cat} for ${val}, please.`;
            this.utter(phrase);
            boardHook.focus();
        }
    }

    actionConstructor() {
        super.actionConstructor();
    }

    constructorTemplate() {
        return super.constructorTemplate();
    }
}
class computerPlayer extends contestant {
    constructor(parent) {
        super(parent);
        this.actionTimer = new timer(() => { this.tryBuzz(); });
        this.properties.attempted = false;
    }
    setAttributes({ int, dex, wis, con }) {
        this.attributes = { int, dex, wis, con };
        return this;
    }
    roll(attribute) {
        const modifier = Math.floor((attribute - 10) / 2);
        const diceRoll = Math.floor(Math.random() * 20) + 1;
        const total = diceRoll + modifier;
        return { diceRoll, total };
    }
    rollWithAdvantage(attribute) {
        const r1 = this.roll(attribute);
        const r2 = this.roll(attribute);
        const r1r = r1.diceRoll;
        const r2r = r2.diceRoll;
        const larger = Math.max([r1r, r2r]);
        if (larger === r1r) return r1;
        return r2;
    }
    rollWithDisadvantage(attribute) {
        const r1 = this.roll(attribute);
        const r2 = this.roll(attribute);
        const r1r = r1.diceRoll;
        const r2r = r2.diceRoll;
        const smaller = Math.min([r1r, r2r]);
        if (smaller === r1r) return r1;
        return r2;
    }

    DCCheck(rollResult, DC) {
        let result = "";

        if (rollResult.total >= DC) result = 'Success';
        if (rollResult.total < DC) result = 'Fail';
        if (rollResult.diceRoll === 1) result = 'Critical Fail';
        if (rollResult.diceRoll === 20) result = 'Critical Success';

        return { result, total: rollResult.total };
    }

    chooseQuestion() {
        const ACArr = this.availableCatagories();
        const catIdx = Math.floor(Math.random() * ACArr.length);
        const cataChoice = ACArr[catIdx];
        const AVArr = this.availValues(cataChoice);
        const AVIdx = Math.floor(Math.random() * AVArr.length);
        const valChoice = AVArr[AVIdx];

        const phrase = `I will take ${cataChoice} for ${valChoice} please.`;
        this.utter(phrase);
    }

    gameStateUpdated(gameStateObj) {
        for (let key in gameStateObj) {
            this.gameState[key] = gameStateObj[key];
        }
        const { state, chooser, from } = { ...this.gameState };
        const me = this.properties.name;
        switch (state) {
            case 'introductions':
                this.intoduceSelf(this.properties);
                break;
            case 'awaiting buzzer':
                this.wisdomRoll();
                break;
            case 'awaitingChoice':
                if (chooser === me) {
                    this.chooseQuestion();
                }
                break;
            case 'awaiting answer':
                console.log("From", from);
                console.log("Me", me);
                this.actionTimer.reset();
                if (from === me); {
                    this.conRoll();
                }
                break;
            case 'resume buzzin':
                if (!this.properties.attempted) {
                    this.wisdomRoll();
                }
                break;
            case 'top of the round':
                this.actionTimer.reset();
                this.properties.attempted = false;
                break;
            default:

        }
    }

    wisdomRoll() {
        const { wis } = { ...this.attributes };
        this.thinksKnows = this.DCCheck(this.roll(wis), 10);
        switch (this.thinksKnows.result) {
            case 'Critical Fail':
                //trys to buzz in, disadvantage on int roll
                this.dexRoll();
                break;
            case 'Critical Success':
                //trys to buzz in, advantage on int roll
                this.dexRoll();
                break;
            case 'Success':
                //trys to buzz in
                this.dexRoll();
                break;
            case 'Fail':
                //does not buzz in
                break;
            default:
        }
    }

    intRoll() {
        const { int } = { ...this.attributes };
        let r;
        switch (this.thinksKnows.result) {
            case 'Critical Fail':
                r = this.rollWithDisadvantage(int);
                break;
            case 'Critical Success':
                r = this.rollWithAdvantage(int);
                break;
            default:
                r = this.roll(int);
                break;
        }
        this.knowsAnswer = this.DCCheck(r, 10);
        let phrase;
        switch (this.knowsAnswer.result) {
            case 'Critical Success':
                phrase = `what is ${this.gameState.answer}`;
                break;
            case 'Success':
                phrase = `what is ${this.gameState.answer}`;
                break;
            case 'Critical Fail':
                phrase = "It's one of them bird-things, right?";
                break;
            case 'Fail':
                phrase = "It's one of them bird-things, right?";
                break;
            default:
        }
        this.utter(phrase);

    }

    conRoll() {
        const { con } = { ...this.attributes };
        this.willAnswer = this.DCCheck(this.roll(con), 10);
        let phrase;
        switch (this.willAnswer.result) {
            case 'Critical Success':
                this.intRoll();
                break;
            case 'Success':
                this.intRoll();
                break;
            case 'Critical Fail':
                phrase = "Your mother is a hampster, and your father smelt of elderberries!";
                this.utter(phrase);
            case 'Fail':
                phrase = "Your mother is a hampster, and your father smelt of elderberries!";
                this.utter(phrase);
                break;
            default:
        }


    }

    dexRoll() {
        const { dex } = { ...this.attributes };
        this.buzzerClick = this.DCCheck(this.roll(dex), 10);
        const sv = Math.floor(Math.random() * 50);
        const mod = (10 - this.buzzerClick.total);
        const res = this.buzzerClick.result;

        if (res === 'Critical Fail') {
            this.actionTimer.delay = 4500;
        } else if (res === 'Critical Success') {
            this.actionTimer.delay = 50;
        } else if (res === 'Fail') {
            this.actionTimer.delay = 2500;
        } else if (res === 'Success') {
            this.actionTimer.delay = 400 - (10 * mod);
        }
        this.actionTimer.delay += sv;

        console.log(this.properties.name, "dex roll", this.buzzerClick);
        console.log("Delay", this.actionTimer.delay);
        this.actionTimer.start();
    }

    tryBuzz() {
        if (this.gameState.state === 'awaiting buzzer') {
            const myBuzzer = new Audio("./media/sounds/other_Buzz.wav");
            myBuzzer.play();
            this.buzzIn({ who: this.properties.name });
            this.properties.attempted = true;
        }
    }



    //need to implement these methods in decendant class.
    eventConstructor() {
        super.eventConstructor();
    }

    actionConstructor() {
        super.actionConstructor();
    }

    constructorTemplate() {
        return super.constructorTemplate();
    }
}