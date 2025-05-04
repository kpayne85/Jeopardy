class forrest {
    constructor(data, { parent, next, prev, children = [] } = {}) {
        this.data = data;
        this.parent = parent;
        this.next = next;
        this.prev = prev;
        this.children = children;
    }

    addChild(data) {
        const arrLen = this.children.length;
        const newChildParams = { parent: this };
        if (arrLen > 0) {
            newChildParams.prev = this.children[arrLen - 1];
        }
        this.children.push(new forrest(data, newChildParams));
        if (newChildParams.prev) {
            newChildParams.prev.next = this.children[arrLen];
        }
        return this;
    }

    addNext(data) {
        const nextParams = { parent: this.parent, prev: this };
        this.next = new forrest(data, nextParams);
        return this;
    }

    addPrev(data) {
        const prevParams = { parent: this.parent, next: this };
        this.prev = new forrest(data, prevParams);
        return this;
    }
}
