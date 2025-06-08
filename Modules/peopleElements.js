class abstractPerson extends abstractElemCollection {
    constructor() {
        if (new.target === abstractPerson) {
            throw new ErrorEvent("This class cannot be instantiated");
        }
        super();
        this.properties = {};
    }
    setName(name) {
        this.properties.name = name;
        return this;
    }

    conversationListener(e) {
        const { name } = { ...this.properties };
        if (e.detail.who !== name) {
            const lettersPerSecond = 21;
            const additionalTime = 1;
            const promptLength = e.detail.said.length;
            const timeToListen = Math.floor(((promptLength / lettersPerSecond)
                + additionalTime) * 1000) + 80;
            const listenTimer = new timer((e) => { this.heard(e); }, timeToListen, e);

            listenTimer.start();
        }
    }

    heard(e) { }

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
        // const catArr = [...this.availcat.values()];


        const catArr = [...gs.gameBoard.catagories.values()];
        const isAvail = catArr.map((c) => {
            const qs = [...c.questionState.values()];
            return qs.includes('Available');
        });
        // const catTitles = [...this.availcat.keys()];
        const catTitles = [...gs.gameBoard.catagories.keys()];
        const availCata = catTitles.filter((v, i) => {
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
        // const workingCat = this.availcat.get(catName);
        const workingCat = gs.gameBoard.catagories.get(catName);
        const vals = [...workingCat.questionState.keys()];
        const availVals = vals.filter((v) => {
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

        const listen = {
            eventType: 'chat',
            eventTarget: globalThis.document,
            eventFunction: (event, type, target) => {
                this.conversationListener(event);
            },
        };
        const gameUpdate = {
            eventType: 'gameUpdate',
            eventTarget: globalThis,
            eventFunction: () => {
                this.gameStateUpdated();
            },
        };

        // pass your event handler object to add event

        this.addEvent(listen);
        this.addEvent(gameUpdate);

    }
    gameStateUpdated() {

    }

    actionConstructor() {

        //make action constructor object

        const say = {
            fnName: "say",
            sender: this.elem,
            type: "chat",
            dataObj: {},
        };

        //add your custom event

        this.addAction(say);
    }

    constructorTemplate() {
        throw new ErrorEvent("This method needs to be implemented in decendant");
    }
}

class host extends abstractPerson {
    constructor() {
        super();
        this.properties.role = "Host";
        this.setName("Alex");

    }

    build() {
        super.build(hostHook);
        this.readingTimer = new timer(
            (x) => { gs.change(x); },
            0,
            { state: 'awaiting buzzer' }
        );
        this.buzzerTimer = new timer(
            (x) => { gs.change(x); },
            5000,
            { state: 'buzzer expired' }
        );
        this.answerTimer = new timer(
            (x) => { gs.change(x); },
            15000,
            { state: 'resume buzzin' }
        );
        displayPic.src = "./media/images/AlexTrebek.png";
        return this;
    }


    heard(e) {
        const me = gs.gameHost.properties.name;
        const { who, said } = e.detail;
        const { state, chooser, from } = { ...gs };
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
                if (gs.state === 'awaiting buzzer') {
                    gs.change({
                        state: 'awaiting answer',
                        from: event.detail.who
                    });
                }
            },
        };
        this.addEvent(hearBuzzer);
    }

    actionConstructor() {
        super.actionConstructor();

        const scoreChange = {
            fnName: "scoreChange",
            sender: globalThis.document,
            type: "scoreChange",

            //inside options.detail you can pass your custom information
            //and will be the variable required when you call the function.
            dataObj: {},
        };
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

    gameStateUpdated() {
        switch (gs.state) {
            case 'question chosen':
                this.gs3();
                break;
            case 'end game':
                this.gs0();
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
                this.utter(`${gs.from}?`);
                gs.gameBoard.buzzable(false);
                this.buzzerTimer.pause();
                this.answerTimer.start();
                break;
            case 'resume buzzin':
                this.scoreChange({
                    who: gs.from,
                    value: -gs.value,
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
        const script1 = "Welcome to Jeopardy!";
        this.read(script1, () => {
            const script2 = "Use your space bar as your buzzer, and type in any answers to the prompts. Remember to give your answers in the form of a question!";
            this.read(script2, () => {
                let p1;
                for (let key of gs.people.keys()) {
                    const val = gs.people.get(key);
                    if (val.player === "Player 1") p1 = key;
                }
                const script2 = ` When the game started, ${p1} was selected as the first player to choose a question.`;
                this.read(script2, (x) => { gs.change(x); },
                    {
                        state: "top of the round",
                        chooser: p1,
                        gameStart: true
                    });
            });
        });
    }
    gs0() {
        let highestScore = 0;
        let winner;
        for (let person in gs.people) {
            if (person.properties.score > highestScore) {
                winner = person.properties.name;
                highestScore = person.properties.score;
            }
        }
        const script = `Congradulations to ${winner}, who has won the game with a score of $${score}.`;
        this.read(script);
    }

    gs1() {
        const questionAvailable = this.availableCatagories().length === 0;
        if (!questionAvailable) gs.change({ state: "end game" });
        //get whoever is the current chooser
        const { chooser } = { ...gs };
        const script = `${chooser}, please tell me the catagory and value of the clue you want me to read.`;
        this.read(script, (x) => { gs.change(x); }, { state: "awaitingChoice" });
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
        const { catagories } = { ...gs.gameBoard };
        const { prevCatagory } = { ...gs };

        if (chosenCatagory !== 'no match') hasCatagory = true;
        if (chosenVal) hasValue = true;
        if (hasCatagory && hasValue) {
            isAvailable = catagories.get(chosenCatagory).isAvailable(chosenVal);
        }
        if (!hasCatagory && hasValue) {
            if (prevCatagory) {
                if (catagories.get(prevCatagory).isAvailable(chosenVal)) {
                    chosenCatagory = prevCatagory;
                    hasCatagory = true;
                    isAvailable = true;
                }
            }
        }
        if (hasCatagory && !hasValue) {
            prevCatagory = chosenCatagory;
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
        // gs.gameBoard.choose({ catagory: chosenCatagory, value: chosenVal });
        const theCat = gs.gameBoard.catagories.get(chosenCatagory);
        const { prompt, answer } = { ...theCat.data.get(chosenVal) };


        const script = `${gs.chooser} has chosen ${chosenCatagory} for ${chosenVal}.`;
        this.read(script, (x) => { gs.change(x); }, {
            state: 'question chosen',
            catagory: chosenCatagory,
            value: chosenVal,
            prompt,
            answer,
        })
    }

    gs3() {
        gs.change({ state: 'reading' });
        this.read(gs.prompt, (x) => { gs.change(x); }, { state: 'awaiting buzzer' });
    }
    gs4() {
        const alertSound = new Audio("./media/sounds/alert.wav");
        alertSound.play();
        gs.gameBoard.buzzable(true);
        const activeCat = gs.gameBoard.catagories.get(gs.catagory);
        if (this.buzzerTimer.status === "Paused") {
            this.buzzerTimer.resume();
        } else {
            this.buzzerTimer.reset();
            this.buzzerTimer.start();
        }

    }
    gs4a() {
        const badNoAnswer = new Audio("./media/sounds/wrong.wav");
        badNoAnswer.play();
        gs.change({ state: "reading answer" });
        const script = `I am sorry the answer was ${gs.answer}`;
        gs.gameBoard.finishQuestion();
        this.read(script, (x) => { gs.change(x); },
            {
                state: 'top of the round',
                prevCatagory: gs.catagory,
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
        const answerReg = new RegExp(gs.answer, "i");
        return answerReg.test(userInput);
    }
    gs5(attemptedAnswer) {

        const badNoAnswer = new Audio("./media/sounds/wrong.wav");
        const success = new Audio("./media/sounds/success.mp3");
        const formOfQuestion = this.#hasQuestionWord(attemptedAnswer);
        const containsAnswer = this.#hasAnswer(attemptedAnswer);
        let script;
        const { from, value } = { ...gs };
        this.answerTimer.reset();

        if (!formOfQuestion) {
            script = "I am sorry that was not in the form of a question.";
            this.scoreChange({
                who: from,
                value: -value
            });
            badNoAnswer.play();
            this.read(script, (x) => { gs.change(x); },
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
            gs.gameBoard.finishQuestion();
            this.read(script, (x) => { gs.change(x); },
                {
                    state: 'top of the round',
                    prevCatagory: gs.catagory,
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
            this.read(script, (x) => { gs.change(x); },
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
        this.properties.onPenalty = false;
        this.resetPen = function () { this.properties.onPenalty = false; }
        this.penaltyTimer = new timer(this.resetPen, 250);

    }
    build() {
        super.build();
        this.appendAsChildOf(this.myHook);
        this.displayScore = this.elem.children[1].children[0];
        this.displayScore.innerText = "$0";
        this.podium = this.elem.children[1];
        this.podium.src = "./media/images/Podium.png";
        if (this.properties.name) {
            this.elem.children[1].children[1].innerText = this.properties.name;
        }
        return this;
    }

    setName(name) {
        super.setName(name);
        if (this.elem) {
            this.elem.children[1].children[1].innerText = name;
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
            tag: 'div',
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
        template.children[1]
            .addChild(displayScore)
            .addChild(displayName);

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
                if (gs.state === 'awaitingChoice'
                    && gs.chooser === this.properties.name) {
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
        if (gs.state === 'awaitingChoice' &&
            gs.chooser === this.properties.name) {
            this.highlightBoard(true);
        }
        if (gs.state === 'awaiting answer'
            && gs.from === this.properties.name) {
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
        switch (gs.state) {
            // case 'reading':
            //     this.properties.onPenalty = true;
            //     this.penaltyTimer.start();
            //     break;
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
        this.knowsAnswer = false;
        this.thinksKnows = false;
        this.dexBonus = '';
        this.conBonus = '';
        this.wisBonus = '';
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
        const me = this.properties.name;
        const { chooser, state } = { ...gs };
        if (state === 'awaitingChoice' && chooser === me) {
            const retryTimer = new timer(() => { this.chooseQuestion(); }, 10000);
            retryTimer.start();

            const ACArr = this.availableCatagories();
            const catIdx = Math.floor(Math.random() * ACArr.length);
            const cataChoice = ACArr[catIdx];
            const AVArr = this.availValues(cataChoice);
            const AVIdx = Math.floor(Math.random() * AVArr.length);
            const valChoice = AVArr[AVIdx];

            const phrase = `I will take ${cataChoice} for ${valChoice} please.`;
            this.utter(phrase);
        }
    }

    gameStateUpdated() {

        const { state, chooser, from } = { ...gs };
        const me = this.properties.name;
        switch (state) {
            case 'awaiting buzzer':
                this.attemptToBuzz();
                break;
            case 'awaitingChoice':
                if (chooser === me) {
                    this.chooseQuestion();
                }
                break;
            case 'awaiting answer':
                this.actionTimer.reset();
                if (from === me) {
                    this.attemptToAnswer();
                }
                break;
            case 'resume buzzin':
                if (!this.properties.attempted) {
                    this.attemptToBuzz();
                }
                break;
            case 'top of the round':
                this.actionTimer.reset();
                this.properties.attempted = false;
                this.wisBonus = '';
                this.dexBonus = '';
                this.conBonus = '';
                break;
            default:

        }
    }
    attemptToAnswer() {
        let conRoll;
        switch (this.conBonus) {
            case 'Advantage':
                conRoll = this.rollWithAdvantage(this.attributes.con);
                break;
            case 'Disadvantage':
                conRoll = this.rollWithDisadvantage(this.attributes.con);
                break;
            default:
                conRoll = this.roll(this.attributes.con);
        }
        const conCheck = this.DCCheck(conRoll, 10);
        if (conCheck.result === 'Success' || conCheck.result === 'Critical Success') {
            if (this.knowsAnswer) {
                this.utter(`what is ${gs.answer}.`);
            }
            else {
                this.utter("forty-two?");
            }
        }
    }
    attemptToBuzz() {
        const { wis, dex, int, con } = { ...this.attributes };
        const intRoll = this.roll(int);
        const intDCCheck = this.DCCheck(intRoll, 10);
        switch (intDCCheck.result) {
            case 'Critical Success':
                this.knowsAnswer = true;
                this.wisBonus = "Advantage";
                break;
            case 'Critical Fail':
                this.knowsAnswer = false;
                this.wisBonus = "Disadvantage";
                this.dexBonus = "Advantage";
                break;
            case 'Success':
                this.knowsAnswer = true;
                break;
            case 'Fail':
                this.knowsAnswer = false;
                break;
        }
        let wisRoll;
        switch (this.wisBonus) {
            case 'Advantage':
                wisRoll = this.rollWithAdvantage(wis);
                break;
            case 'Disadvantage':
                wisRoll = this.rollWithDisadvantage(wis);
                break;
            default:
                wisRoll = this.roll(wis);
        }
        const wisDCCheck = this.DCCheck(wisRoll, 10);
        switch (wisDCCheck.result) {
            case 'Critical Success':
                this.thinksKnows = this.knowsAnswer;
                this.conBonus = "Advantage";
                break;
            case 'Critical Fail':
                this.thinksKnows = !this.knowsAnswer;
                if (this.knowsAnswer) this.dexBonus = "Disadvantage";
                if (!this.knowsAnswer) this.dexBonus = "Advantage";
                break;
            case 'Success':
                this.thinksKnows = this.knowsAnswer;
                break;
            case 'Fail':
                this.thinksKnows = !this.knowsAnswer;
                break;
        }
        let dexRoll = false;
        switch (this.dexBonus) {
            case 'Advantage':
                dexRoll = this.rollWithAdvantage(dex);
                break;
            case 'Disadvantage':
                dexRoll = this.rollWithDisadvantage(dex);
                break;
            default:
                dexRoll = this.roll(dex);
                break;
        }
        let delay = 0;
        if (this.thinksKnows) {
            const dexDCCheck = this.DCCheck(dexRoll, 10)
            switch (dexDCCheck.result) {
                case 'Critical Success':
                    delay = 50
                    break;
                case 'Critical Fail':
                    delay = 6000;
                    break;
                case 'Success':
                    delay = 400 - (dexRoll.total * 10) + Math.floor(Math.random() * 20);
                    break;
                case 'Fail':
                    delay = 2500;
                    break;
            }
            this.actionTimer.delay = delay;
            this.actionTimer.start();
        }

    }

    tryBuzz() {
        if (gs.state === 'awaiting buzzer') {
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