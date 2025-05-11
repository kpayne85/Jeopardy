class catagory {
    constructor(parent, column) {
        this.data = new Map();
        this.questionState = new Map();
        this.appendPoint = parent;
        this.column = column;
        this.dblJeopardy = false;
    }

    setTitle(title) {
        const titleElem = new catTitle(this.appendPoint);
        titleElem.setTitle(title)
            .setPosition({ column: this.column, row: 0 });
        this.data.set("Title", titleElem);
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
            this.data.set(value, new question(this.appendPoint));
            this.data.get(value)
                .setValue(value)
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
            this.questionState.set(200, state);
        }
        if (state === "Attempted") {
            this.data.get(value).setActivity(false).attempt();
            this.questionState.set(200, state);
        }
    }
}