class host {
    #catagorymatch;
    #valuematch;
    #activeQuestion;
    constructor(parent, chat, gameboard) {
        this.parent = parent;
        this.root = this.#buildLayout();
        this.gameChat = chat;
        this.displayPic = document.getElementById('display-pic');
        this.displayPic.src = img.src;
        this.gameboard = gameboard;
        this.cataRegexes = this.#setCatagoryRegexes();
        this.gamestate = {
            currentTurn: "player",
            awaitingAction: "choose question",
        };

    }

    #inputOnChooseQuestion(userInput) {
        const testCatagory = this.#testCatagoryMatch(userInput);
        const testValue = Number.parseInt(this.#testValuematch(userInput));
        let goodInput = false;
        let phrase = "I am sorry, I did not understand.";

        if (testCatagory && !testValue) {
            this.#catagorymatch = testCatagory;
            phrase = `Alright, you want ${testCatagory}? Please choose a question in that catagory.`;
            this.gamestate.awaitingAction = "choose question - need value";
        }

        if (!testCatagory && testValue) {
            this.#valuematch = testValue;
            phrase = `${testValue} in what catagory?`;
            this.gamestate.awaitingAction = "choose question - need catagory";
        }

        if (testCatagory && testValue) {
            goodInput = this.gameboard.isAvailable({
                catagory: testCatagory,
                value: testValue
            });
            if (goodInput) {
                phrase = `You have selected ${testCatagory} for ${testValue}, which is available.`
                this.#catagorymatch = testCatagory;
                this.#valuematch = testValue;
            }
            else {
                phrase = `I am sorry that question is not available`;
            }
        }

        this.#say(phrase);
        if (goodInput) this.#questionChosen();
    }

    #inputWithPrevCatagory(userInput) {
        //if they have chosen a different catagory, go back to default
        const testCatagory = this.#testCatagoryMatch(userInput);
        if (testCatagory !== this.#catagorymatch && testCatagory) {
            this.gamestate.awaitingAction = 'choose question';
            this.#inputOnChooseQuestion(userInput);
        }
        //if they say next
        else if (this.#saidNext(userInput)) {
            const currCat = this.gameboard.catagories.get(this.#catagorymatch);
            const currCatArr = [...currCat.questionState.entries()];
            const nextq = currCatArr.find((q) => {
                //find the first available question in the current catagory
                return q[1] === 'Available';
            });
            if (nextq) {
                this.gamestate.awaitingAction = 'choose question - need value';
                this.#inputOnChooseQuestionNV(nextq[0]);
            }
            else {
                this.#say("There is no next question, please choose another catagory.");
                this.gamestate.awaitingAction = 'choose question';
            }
        }
        //dont say next or a different catagory, they might have just said a value
        else {
            this.gamestate.awaitingAction = 'choose question - need value';
            this.#inputOnChooseQuestionNV(userInput);
        }
    }
    #saidNext(userInput) {
        const nextReg = /next/i;
        return nextReg.test(userInput);
    }

    //need catagory
    #inputOnChooseQuestionNC(userInput) {
        const testCatagory = this.#testCatagoryMatch(userInput);
        const goodInput = this.gameboard.isAvailable({
            catagory: testCatagory,
            value: this.#valuematch
        });
        let phrase;
        if (goodInput) {
            phrase = `You have selected ${testCatagory} for ${this.#valuematch}, which is available.`
            this.#catagorymatch = testCatagory;
        }
        else {
            phrase = `I am sorry that question is not available`;
            this.gamestate.awaitingAction = 'choose question';
        }

        this.#say(phrase);
        if (goodInput) this.#questionChosen();

    }

    //need value
    #inputOnChooseQuestionNV(userInput) {
        const testValue = Number.parseInt(this.#testValuematch(userInput));
        const goodInput = this.gameboard.isAvailable({
            catagory: this.#catagorymatch,
            value: testValue
        });
        let phrase;
        if (goodInput) {
            phrase = `You have selected ${this.#catagorymatch} for ${testValue}, which is available.`
            this.#valuematch = testValue;
        }
        else {
            phrase = `I am sorry that question is not available`;
            this.gamestate.awaitingAction = 'choose question';
        }

        this.#say(phrase);
        if (goodInput) this.#questionChosen();

    }

    #questionChosen() {
        this.gameboard.choose({
            catagory: this.#catagorymatch,
            value: this.#valuematch
        });
        this.#activeQuestion = this.gameboard
            .catagories.get(this.#catagorymatch)
            .data.get(this.#valuematch);

        this.#say(this.#activeQuestion.prompt);
        this.gamestate.awaitingAction = 'awaiting answer';
    }

    #setCatagoryRegexes() {
        const m = new Map();
        const titles = document.getElementsByClassName('title-element');
        const titlesArr = [...titles];

        const actualTitles = [];
        titlesArr.forEach(t => actualTitles.push(t.innerText));

        actualTitles.forEach((t) => {
            m.set(t, new RegExp(t, 'i'));
        });
        return m;
    }

    #inputOnAwaitingAnswer(userInput) {
        const formOfQuestion = this.#hasQuestionWord(userInput);
        const containsAnswer = this.#hasAnswer(userInput);
        let prompt;

        if (!formOfQuestion) {
            prompt = "I am sorry that was not in the form of a question.";
            //TODO: Subtract from total

        }
        if (formOfQuestion && containsAnswer) {
            prompt = "Correct! Please choose the next question.";
            //TODO: Add to total

        } if (formOfQuestion && !containsAnswer) {
            const a = this.#activeQuestion.answer;
            prompt = `I am sorry, the correct answer was ${a}`;
            //TODO: Subtract from total

        }

        this.#say(prompt);
        this.gamestate.awaitingAction = 'choose question has previous catagory';
        this.gameboard.finishQuestion();
        this.#activeQuestion = undefined;
        this.#valuematch = undefined;
    }

    #say(utterance) {
        this.gameChat.post({ who: "Host", said: utterance });
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
        const answerReg = new RegExp(this.#activeQuestion.answer, "i");
        return answerReg.test(userInput);
    }

    #testCatagoryMatch(userInput) {

        const match = [...this.cataRegexes.entries()].find((entry) => {
            if (entry[1].test(userInput)) {
                return entry[0];
            }
        });
        if (match) {
            return match[0];
        }
        return undefined;
    }

    #testValuematch(userInput) {

        const goodValues = ["200", "400", "600", "800", "1000", "1200", "1600", "2000"];
        const match = goodValues.find((val) => {
            const reg = new RegExp(val, "");
            return reg.test(userInput);
        });
        return match;
    }
    #getLayout() {
        const root = {
            type: 'div',
            id: 'host-root',
        }
        const displayPic = {
            type: 'img',
            id: 'display-pic',
        };


        const template = new forrest(root);
        template
            .addChild(displayPic);


        return template;
    }

    #buildLayout() {
        return builder(this.#getLayout(), this.parent);
    }

    chatPostEvent(e) {
        if (e.detail.who !== "Host") {
            switch (this.gamestate.awaitingAction) {
                case 'choose question':
                    this.#inputOnChooseQuestion(e.detail.said);
                    break;
                case 'choose question has previous catagory':
                    this.#inputWithPrevCatagory(e.detail.said);
                    break;
                case 'choose question - need catagory':
                    this.#inputOnChooseQuestionNC(e.detail.said);
                    break;
                case 'choose question - need value':
                    this.#inputOnChooseQuestionNV(e.detail.said);
                    break;
                case 'awaiting answer':
                    this.#inputOnAwaitingAnswer(e.detail.said);
                    break;


            }
        }

    }
}