"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignKey = void 0;
class ForeignKey {
    constructor(name, key, foreignKey) {
        if (key.unique === false) {
            throw Error(`Key ${key.name} must have a unique constrain for ForeignKey ${name} to refer to it.`);
        }
        this.name = name;
        this.key = key; // TODO: more work required here to find the Key instane in the parent table when reconstituting from json
        this.index = foreignKey ? foreignKey.index : [];
        this.convert = (value) => value;
    }
    as(name) {
        return new ForeignKey(name, this.key, this);
    }
    to(convert) {
        this.convert = convert;
        return this;
    }
    insert(value, indexes) {
        const position = this.key.values.indexOf(value);
        if (position === -1) {
            throw Error(`Foreign key ${value} does not exist in ${this.key.name} while inserting into ${this.name}`);
        }
        for (const index of indexes) {
            this.index[index] = position;
        }
    }
    value(index) {
        return this.convert(this.key.values[this.index[index]]);
    }
    equals(value) {
        return () => {
            const position = this.key.values.indexOf(value);
            return (index) => {
                return this.index[index] === position;
            };
        };
    }
    in(values) {
        return () => {
            const indexes = [];
            for (let i = values.length; i--;) {
                const index = this.key.values.indexOf(values[i]);
                if (index !== -1) {
                    indexes.push(index);
                }
            }
            return (index) => {
                return indexes.indexOf(this.index[index]) !== -1;
            };
        };
    }
}
exports.ForeignKey = ForeignKey;
