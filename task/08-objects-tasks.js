"use strict";

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = function () {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  string: "",
  nameArr: [],
  numberArr: [],

  element: function (value) {
    this.string += value;
    this.nameArr.push("element");
    this.numberArr.push(0);
    this.checkUnique("element");
    this.checkNumber();

    return this.newObj(this);
  },

  id: function (value) {
    this.string += `#${value}`;
    this.nameArr.push("id");
    this.numberArr.push(1);
    this.checkUnique("id");
    this.checkNumber();

    return this.newObj(this);
  },

  class: function (value) {
    this.string += `.${value}`;
    this.numberArr.push(2);
    this.checkNumber();

    return this.newObj(this);
  },

  attr: function (value) {
    this.string += `[${value}]`;
    this.numberArr.push(3);
    this.checkNumber();

    return this.newObj(this);
  },

  pseudoClass: function (value) {
    this.string += `:${value}`;
    this.numberArr.push(4);
    this.checkNumber();

    return this.newObj(this);
  },

  pseudoElement: function (value) {
    this.string += `::${value}`;
    this.nameArr.push("pseudo-elem");
    this.numberArr.push(5);
    this.checkUnique("pseudo-elem");
    this.checkNumber();

    return this.newObj(this);
  },

  combine: function (selector1, combinator, selector2) {
    this.string = selector1.string + ` ${combinator} ` + selector2.string;

    return this.newObj(this);
  },

  stringify() {
    const result = this.string;
    this.string = "";

    return result;
  },

  newObj(object) {
    const obj = Object.assign({}, object);
    object.string = "";
    object.nameArr = [];
    object.numberArr = [];

    return obj;
  },

  checkUnique(element) {
    const arr = this.nameArr;

    if (arr.indexOf(element) !== arr.lastIndexOf(element)) {
      throw new Error(
        "Element, id and pseudo-element should not occur " +
          "more then one time inside the selector"
      );
    }
  },

  checkNumber() {
    const sortedArray = this.numberArr.slice().sort((a, b) => a - b);
    sortedArray.forEach((el, i) => {
      if (el !== this.numberArr[i]) {
        throw new Error(
          "Selector parts should be arranged in the following " +
            "order: element, id, class, attribute, pseudo-class, pseudo-element"
        );
      }
    });
  },
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder,
};
