class catTitle {
    constructor(parent) {
        this.root = titleBuilder(parent);
        this.innerLink = this.root.children[0];


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