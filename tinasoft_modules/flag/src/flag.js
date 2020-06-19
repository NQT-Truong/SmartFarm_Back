/**
 * Module:    Gắn cờ kiểm soát khởi động
 * Author:    Harian
 * @version:  v2.0.1
 * Create:    2/2020        by @Haian
 * Modified:  dd/mm/yyyy    by @Haian
 *
 */

const FlagType = {
    BOOL: 'bool',
    VARI: 'variant',
    CONF: 'configuration',
};

class Configuration {
    constructor(defaultValue, type=FlagType.CONF) {
        this.value = defaultValue;
        this.type = type;
        this.precheck();
    }

    static isFlagType(object){
        return object.type === FlagType.CONF && !!object.value;
    }

    precheck(){
        if( !Configuration.isFlagType(this) )
            throw new Error("Precheck the constructor");
    }

    get getValue() {
        return this.value;
    }

    set setValue(value) {
        this.value = value;
        return true;
    }

}

class Variant extends Configuration {
    constructor(defaultValue, options, type=FlagType.VARI) {
        super(defaultValue, type);
        if (!options.includes( defaultValue ) )
            options.push(defaultValue);
        this.options = options;
        this.precheck();
        this.precheckOptions();
    }

    static isFlagType(object){
        return object.type === FlagType.VARI && !!object.value;
    }

    precheck(){
        if( !Variant.isFlagType(this))
            throw new Error("Precheck the constructor");
    }

    precheckOptions(options=this.options){
        if( !options || !Array.isArray(options) || !options.includes(this.getValue ) )
            throw new Error('This options is invalid');
        return true;
    }

    get getActiveValue() {
        return this.options;
    }

    set setValue(value) {
        if( !this.options.includes(value) )
            throw new Error('value dont match any options');
        super.setValue = value;
    }

    set peek(value) {
        if(this.getValue === value)
            throw new Error("This value is current value");
        this.options = this.options.filter(e => e!==value);
    }
    set push(value) {
        this.options.push(value)
    }

    set overrider(options) {
        this.precheckOptions(options);
        this.options = options;
    }
}

class Bool extends Variant {
    constructor(defaultValue = false) {
        super(defaultValue ? 'true' : 'false', ['false', 'true'], FlagType.BOOL);
    }

    static isFlagType(object){
        return object.type === FlagType.BOOL && !!object.value;
    }

    precheck(){
        if( !Bool.isFlagType(this))
            throw new Error("Precheck the constructor");
    }

    get isEnabled() {
        return super.getValue === 'true';
    }

    set setValue(value) {
        super.setValue = value ? 'true' : 'false';
    }

}


let data = {};
function isFlagType(object) {
    return Bool.isFlagType(object) || Variant.isFlagType(object) || Configuration.isFlagType(object);
}

function setValue(object) {
    let rollback = Object.assign({}, data);;
    try {
        for (let key in object) {
            if (!data[key])
                continue;
            data[key].setValue = object[key];
        }
        return true;
    } catch(err){
        console.error(err);
        data = Object.assign({}, rollback);;
        return false;
    }
}

function getValue(key) {
    return !!data[key] ? data[key].getValue : undefined;
}

function isEnabled(key) {
    return !!data[key] ? data[key].isEnabled : undefined;
}

function assign(object) {
    for (let key in object) {
        if (isFlagType(object[key]))
            data[key] = object[key];
    }
}

function unassigned(key) {
    delete(data[key]);
}

module.exports = {
    Bool,
    Variant,
    Configuration,

    setValue,
    getValue,
    isEnabled,
    assign,
    unassigned,
}
