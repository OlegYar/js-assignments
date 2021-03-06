'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    
    const numbers = [' _ | ||_|','     |  |',' _  _||_ ',' _  _| _|',
    '   |_|  |',' _ |_  _|',' _ |_ |_|',' _   |  |', ' _ |_||_|',' _ |_| _|'];
    
    bankAccount = bankAccount.split('\n');
    let arr = [];
    for (let i = 0; i < bankAccount[0].length; i+= 3) {
        arr.push(bankAccount.reduce((a, b) => a + b.substr(i, 3), ''));
    }
    return +arr.map(a => numbers.indexOf(a)).reduce((a, b) => a + b, '');
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    const words = text.split(' ');
    let row = '';
    for (let i = 0; i < words.length; i++) {
        if (row.length + words[i].length > columns) {
            yield row.slice(0, -1);
            row = words[i] + ' ';
        } else {
            row += words[i] + ' ';
        }
    }
    yield row.slice(0, -1);
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    function Get(hand) {
        
        const _ranks = 'A234567891JQKA',
              suits = [],
              ranks = {
                  count: [],
                  values: [],
                  sorted: []
              };
        
        for (let v of hand) {
            
            if (ranks.values.indexOf(v[0]) < 0) {
                ranks.values.push(v[0]);
                ranks.count.push(1);
            } else
                ranks.count[ranks.values.indexOf(v[0])]++;
            
            if (suits.indexOf(v.slice(-1)) < 0)
                suits.push(v.slice(-1));
        }
        ranks.sorted = ranks.values.sort((a, b) => _ranks.indexOf(a) - _ranks.indexOf(b));
        if (ranks.sorted[0] === 'A' && ranks.sorted[1] !== '2') {
            ranks.sorted.splice(0, 1);
            ranks.sorted.push('A');
        }
        
        this.getCount = function (cnt) {
            let res = 0;
            for (let v of ranks.count)
                if (v === cnt)
                    res++;
            return res;
        }
        
        this.isFlush = function() {
            return suits.length === 1;
        };
        
        this.isStraight = function() {
            if (ranks.sorted.length < 5)
                return false;
            for (let i = 1; i < 5; i++)
                if (
                    _ranks.indexOf(ranks.sorted[i - 1]) + 1 !== _ranks.indexOf(ranks.sorted[i]) &&
                    _ranks.indexOf(ranks.sorted[i - 1]) + 1 !== _ranks.lastIndexOf(ranks.sorted[i])
                )
                    return false;
            return true;
        };
    }
    
    hand = new Get(hand);
    
    if (hand.isFlush() && hand.isStraight())
        return PokerRank.StraightFlush;
    else if (hand.getCount(4))
        return PokerRank.FourOfKind;
    else if (hand.getCount(3) && hand.getCount(2))
        return PokerRank.FullHouse;
    else if (hand.isFlush())
        return PokerRank.Flush;
    else if (hand.isStraight())
        return PokerRank.Straight;
    else if (hand.getCount(3))
        return PokerRank.ThreeOfKind;
    else if (hand.getCount(2) == 2)
        return PokerRank.TwoPairs;
    else if (hand.getCount(2))
        return PokerRank.OnePair;
    else
        return PokerRank.HighCard;;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let arr = figure.split('\n'),
    pluses = [];

    arr.map((cur, line)=> {
        let i = cur.indexOf('+');

        while(i !== -1) {
            pluses.push([line, i]);
            i = cur.indexOf('+', i + 1);
        }
    });

    for (let current = 0; current < pluses.length - 1; current++) {

        let next = current + 1;

        while (pluses[next][0] === pluses[current][0]) {

            let y = pluses[current][0],
                x = pluses[current][1],
                x2 = pluses[next][1],
                width = arr[y].slice(x + 1, x2).length,
                height = 1;

            while (arr[y + height][x]  === '|' && arr[y + height][x2] === '|') {
                height++;
            }

            if (arr[y + height][x]  === '+' && arr[y + height][x2] === '+') {
                yield formRectangle({h: height - 1, w: width});   
                break;      
            }

            next++;
            if (next >= pluses.length) {
                break;
            }
        }
    }

    function formRectangle(rect) {
        let topAndBottom = '+'.concat('-'.repeat(rect.w), '+\n');
        let filler = '|'.concat(' '.repeat(rect.w), '|\n');
        return topAndBottom.concat(filler.repeat(rect.h), topAndBottom);
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
