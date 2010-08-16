/**
 * Class: Serializable
 * The <Serializable> class allows classes to be serialized to a 
 * JSON object, and unserialized back to a functional instance of
 * the class.
 *
 * Note the unusual way of creating this class. This creates a
 * completely static class that can not be instansiated.
 */
var Serializable = new (function() {

    /**
     * Variable: classes
     * A hash of serializable classes
     */
    var classes = {};

    return {
        /**
         * Function: addClass
         *
         * Adds a class to the <Serializables> class registry. Should only
         * be called from <Class.Mutators.Serializable>.
         *
         * Paramaters
         *      key - The unique key for this class.
         *      class - The class to add
         */
        addClass: function(key, c) {
            classes[key] = c;
        },

        /**
         * Function: serialize
         *
         * Serializes an instance of a class to a JSON object. Instances serialized
         * using this function can be unserialized by calling <Serializable.unserialize>
         *
         * Paramaters:
         *      instance - The instance of a <Serializable> class to serialize
         */
        serialize: function(instance) {
            var data = {
                key: instance.$serialization_key,
                data: instance.serialize()
            };
            return data;
        },
        /**
         * Function: unserialize
         *
         * Unserializes an instance of a class from a JSON object. Accepts objects serialized
         * by <Serializable.serialize>.
         *
         * Paramaters:
         *      data - A JSON object produced by <Serializable.serialize>
         *      args - An array of aditional arguments to send to the classes unserialize method
         */
        unserialize: function(data, args) {
            args = $pick(args, []);
            args.unshift(data.data);
            return classes[data.key].unserialize.apply(classes[data.key], args);
        }
    };
})();

/**
 * Class: Class.Mutators.Serializable
 * 
 * Classes implementing this mutator are serializable. Classes have to implement two methods:
 * serialize and unserialize. Serialize should return a JSON ready object. Unserialize should
 * be a static method for the class that accepts a JSON object and returns a new instance of
 * the class.
 *
 * Implement this like so:
 * (start code)
var Foo = new Class({
    Serializable: 'Foo',
    // ...
    serialize: function() {
        return {
            bar: this.bar,
            baz: this.baz
        };
    }
});
Foo.unserialize = function(data, args) {
    return new Foo(data.bar, data.baz);
};
 * (end code)
 */
Class.Mutators.Serializable = function(key) {
    Serializable.addClass(key, this);
    this.implement({'$serialization_key': key});
};

