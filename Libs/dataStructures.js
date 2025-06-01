class tree {
    constructor(data) {
        this.data = data;
        this.children = [];
    }
    addChild(data) {
        this.children.push(new tree(data));
        return this;
    }
    rmChild(data) {
        const rmIdx = this.children.findIndex((i) => data === i.data);
        if (rmIdx !== -1) this.children.splice(rmIdx, 1);
        return this;
    }
}