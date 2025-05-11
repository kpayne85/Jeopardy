const questionBuilder = questionFactory();
class question {
    constructor(parent) {
        this.questionRoot = questionBuilder(parent);
        this.valueLink = this.questionRoot
            .children[0].children[0].children[0];
        this.promptLink = this.questionRoot
            .children[0].children[1].children[0].children[0];
        this.innerLink = this.questionRoot.children[0];
    }
    setValue(val) {
        this.valueLink.innerText = val;
        return this;
    }
    setPrompt(prompt) {
        this.promptLink.innerText = prompt;
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
}