export default class {
    constructor() {
        this.errors = {};
    }

    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    hasAny(...fields) {
        for (let field of _.flatten(fields)) {
            if (this.has(field)) return true;
        }

        return false;
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    all() {
        const errors = [];
        for (let error in this.errors) {
            errors.push(this.get(error));
        }
        return errors;
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
    }

    record(errors) {
        this.errors = errors;
    }

    clear(field) {
        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }
}
