'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    const puzzleWidth = puzzle[0].length,
    puzzleHeight = puzzle.length;

    for (let i = 0; i < puzzleWidth; i++) {
        for (let j = 0; j < puzzleHeight; j++) {
            if (puzzle[j][i] === searchStr[0] && tryNext(i, j, [], searchStr.slice(1))) {
                return true;
            }
        }
    }

    return false;

    function tryNext (i, j, visited, search) {

        const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        visited.push(i.toString() + j.toString());

        for (let num = 0; num < steps.length; num++) {

            let newI = i + steps[num][0],
                newJ = j + steps[num][1],
                str = String.prototype.concat(newI, newJ);

            if (newI >= puzzleWidth || newI < 0 || newJ >= puzzleHeight || newJ < 0 || visited.indexOf(str) !== -1) {
                continue;
            }

            if (puzzle[newJ][newI] === search[0] && (search.length === 1 || tryNext(newI, newJ, visited, search.slice(1)))) {
                return true;       
            }
        }
        return false; 
    }
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    const length = chars.length;
    let stack = [];

    stack.push({string: "", visited: Array(length).fill(false)});

    while (stack.length) {

        let item = stack.pop();

        if (item.string.length === length) {
            yield item.string;
        }

        for (let i = 0; i < length; i++) {
            if (!item.visited[i]) {
                let newVisited = Array.from(item.visited);
                newVisited[i] = true;
                stack.push({string: item.string + chars[i], visited: newVisited});
            }
        }

    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let result = 0; 
    
    while(quotes.length > 1) { 
        let max = Math.max(...quotes);
        let index = quotes.indexOf(max); 
        
        if (index == 0) break; 
        
        quotes.splice(index, 1); 
        
        let sub = quotes.splice(0, index); 
        
        result += sub.reduce((prev, item) => prev += max - item, 0); 
    } 
    
    return result;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        let result = '',
        char = 0;
        for (let i = 0; i < url.length; i++) {
            char = char << 7 | (this.urlAllowedChars.indexOf(url[i]) + 1);
            if (i % 2 || i === url.length - 1) {
                result += String.fromCharCode(char);
                char = 0;
            }
        }
        return result;
    },
    
    decode: function(code) {
        const _AND = ~(~0 << 7);
        let result = '';
        for (let i = 0; i < code.length; i++) {
            let char = code.charCodeAt(i);
            let c = char >> 7 & _AND;
            if (c)
                result += this.urlAllowedChars[c - 1];
            c = char & _AND;
            result += this.urlAllowedChars[c - 1];
        }
        return result;
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
