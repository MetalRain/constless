// What if JS programmer didn't want to participate let/const war and become constless?!
// Here is terrible stack based evaluator to do that

// evaluator
String.prototype.debug = true
String.prototype.clear = () => String.prototype.stack = []
String.prototype.assign = tokens => tokens.forEach(token => {String.prototype[token] = token})
String.prototype.resolve = tokens => tokens.map(
    token => typeof(String.prototype[token]) !== 'undefined' ? String.prototype[token] : token
)
String.prototype.unquote = tokens => tokens.map(
    token => (typeof(token) === 'string' && token.substr(0,1) === "'")
        ? String.prototype[token.substr(1)]
        : token
)
String.prototype.eval = function(tokens) {
    if (String.prototype.debug){
        console.log('Eval:', String.prototype.print(tokens))  
    }
    String.prototype.resolve(tokens)
        .forEach(value => {
            if (typeof(value) === 'function'){
                String.prototype.stack = [].concat(value(String.prototype.stack))
            } else {
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
String.prototype.quote = tokens => tokens.map(token => (typeof(token) === 'string') ? `'${token}` : token)
String.prototype.primitives = () => Object.keys(String.prototype)
String.prototype.unresolve = values => values.map(
    value => Object.entries(String.prototype).reduce((result, [name, namedValue]) => value === namedValue ? name : result, value)
)
String.prototype.print = values => String.prototype.unresolve(values).map(value => value.toString())

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



// gt pops last value from stack as limit and pushes condition function to stack
String.prototype.gt = String.prototype.popN(1, ([stack, limit]) => stack.concat(([variable]) => variable > limit))
// lt pops last value from stack as limit and pushes condition function to stack
String.prototype.lt = String.prototype.popN(1, ([stack, limit]) => stack.concat(([variable]) => variable < limit))

String.prototype.while = String.prototype.popN(2, ([loop_stack, condition, fn]) => {
    // evaluate stack until contition is not true
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

String.prototype.clear()
String.prototype.eval(
    "2 3 mul 2 div 10 add".split(" ")
)

String.prototype.clear()
String.prototype.eval(
    "1 10 range add".split(" ")
)

String.prototype.clear()
String.prototype.eval(
    "1 5 lt 'add while 4 mul".split(" ")
)