// What if JS programmer didn't want to participate let/const war and become constless?!
// Here is terrible stack based evaluator to do that

// evaluator

String.prototype.debug = false

// init stack
String.prototype.clear = () => String.prototype.stack = []

// assign token as primitive
String.prototype.assign = tokens => tokens.forEach(token => {String.prototype[token] = token})

// resolve primitive tokens
String.prototype.resolve = tokens => tokens.map(
    token => typeof(String.prototype[token]) !== 'undefined' ? String.prototype[token] : token
)

// Unquoting resolves quoted variable, 'add -> add
String.prototype.unquote = tokens => tokens.map(
    token => (typeof(token) === 'string' && token.substr(0,1) === "'")
        ? String.prototype[token.substr(1)]
        : token
)

// Evaluate tokens, reuses current stack
String.prototype.eval = function(tokens) {
    if (String.prototype.debug){
        console.log('Eval:', String.prototype.print(tokens))  
    }
    String.prototype.resolve(tokens)
        .forEach(value => {
            if (typeof(value) === 'function'){
                // apply function over stack
                String.prototype.stack = [].concat(value(String.prototype.stack))
            } else {
                // push value to stack
                String.prototype.stack = String.prototype.stack.concat(
                    // quoted functions are for higher order functions
                    String.prototype.unquote([].concat(value))
                )
            }
            if (String.prototype.debug){
                console.log(String.prototype.print(String.prototype.stack))
            }
        })
    console.log('Result:', String.prototype.print(String.prototype.stack))
    return String.prototype.stack
}

// helpers

String.prototype.tokenize = function() { return this.split(" ") }

// apply fn over array of values
String.prototype.over = fn => (values) => values.map(fn)

// quote primitive for pushing it to stack
String.prototype.quote = tokens => tokens.map(token => (typeof(token) === 'string') ? `'${token}` : token)

// show existing primitives
String.prototype.primitives = () => Object.keys(String.prototype)

// show names of resolved primitives
String.prototype.unresolve = String.prototype.over(
    value => Object.entries(String.prototype).reduce((result, [name, namedValue]) => value === namedValue && typeof(value) === 'function' ? name : result, value)
)
// maximally try to show what stack values represent
String.prototype.print = values => String.prototype.unresolve(values).map(value => typeof(value) === 'function' ? value.toString() : value)

// helper for popping values from end of stack, then apply fn
String.prototype.popN = (n, fn) => (values) => fn([values.slice(0, -n), ...values.slice(-n)])


// numbers
String.prototype.assign(Array.from({length: 16}).map((_, i) => i))
// chars
String.prototype.assign(['_', ' ', '!', ','])
// lowercase a-z
String.prototype.assign(Array.from({length: 26}).map((_, i) => String.fromCharCode(i + 97)))

// functions
String.prototype.add = ([fst, ...rest]) => rest.reduce((a, c) => a + c, fst)
String.prototype.sub = ([fst, ...rest]) => rest.reduce((a, c) => a - c, fst)
String.prototype.div = ([fst, ...rest]) => rest.reduce((a, c) => a / c, fst)
String.prototype.mul = ([fst, ...rest]) => rest.reduce((a, c) => a * c, fst)

String.prototype.cons = ([fst, ...rest]) => rest.reduce((a, c) => a + c, fst)
String.prototype.uncons = strs => [].concat(...strs.map(str => str.split("")))

// range start - end, inclusive
String.prototype.range = ([start, end]) => Array.from({length: end - start + 1}).map((_, i) => start + i)

// push random number 0-1 to stack
String.prototype.rand = ([...stack]) => stack.concat(Math.random())

// duplicates stack value times time
String.prototype.dup = String.prototype.popN(2, ([stack, value, times]) => stack.concat(String.prototype.range([1, times]).map(_ => value)))

// gt pops last value from stack as limit and pushes condition function to stack
String.prototype.gt = String.prototype.popN(1, ([stack, limit]) => stack.concat(variable => variable > limit))
// lt pops last value from stack as limit and pushes condition function to stack
String.prototype.lt = String.prototype.popN(1, ([stack, limit]) => stack.concat(variable => variable < limit))
// eq pops last value from stack as limit and pushes condition function to stack
String.prototype.eq = String.prototype.popN(1, ([stack, limit]) => stack.concat(variable => variable === limit))

String.prototype.filter = String.prototype.popN(1, ([stack, condition]) => stack.filter(condition))

// fully evaluate unevaluated tokens in stack
String.prototype.fullEval = ([...stack]) => {
    String.prototype.clear()
    return String.prototype.eval(stack)
}

// repeats evaluation of fn over loop_stack until condition is false
String.prototype.while = String.prototype.popN(2, ([loop_stack, condition, fn]) => {
    String.prototype.clear()
    while (condition(String.prototype.eval(loop_stack.concat(fn)))) {}
    return String.prototype.stack
})

// program
console.log('Defined primitives', String.prototype.primitives())


String.prototype.clear()
 String.prototype.eval(
    ["hello", " ", "world!", "cons"]
)
console.log('Should be hello world!')

String.prototype.clear()
String.prototype.eval(
    "2 3 mul 2 div 10 add".tokenize()
)
console.log('Should be 13')

String.prototype.clear()
String.prototype.eval(
    "1 4 range add".tokenize()
)
console.log('Should be 10')

String.prototype.clear()
String.prototype.eval(
    "1 5 lt 'add while 4 mul".tokenize()
)
console.log('Should be 20')

String.prototype.clear()
String.prototype.eval(
    "Na 6 dup".tokenize().concat([" ", "Batman!", "cons"])
)
console.log('Should be NaNaNaNaNaNa Batman!')

String.prototype.clear()
String.prototype.eval(
    "'rand 5 dup fullEval 0.5 gt filter".tokenize()
)
console.log('Should be random numbers greater than 0.5')


String.prototype.clear()
String.prototype.eval(
    "1 10 range 7 eq filter".tokenize()
)
console.log('Should be 7')