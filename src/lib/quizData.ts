import { Language } from './i18n';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

type TopicKey = 'variables' | 'loops' | 'functions' | 'arrays' | 'debugging' | 'objects' | 'async' | 'dom' | 'es6' | 'algorithms' | 'closures' | 'prototypes' | 'promises' | 'generators' | 'modules' | 'regex' | 'performance' | 'security' | 'patterns' | 'testing' | 'typescript' | 'webpack' | 'react' | 'nodejs' | 'graphql' | 'microservices' | 'docker' | 'cicd' | 'cloud' | 'architecture';

const quizData: Record<Language, Record<TopicKey, QuizQuestion[]>> = {
  en: {
    variables: [
      { question: 'What keyword is used to declare a constant in JavaScript?', options: ['var', 'let', 'const', 'static'], correctIndex: 2 },
      { question: 'Which data type stores true or false?', options: ['String', 'Number', 'Boolean', 'Object'], correctIndex: 2 },
      { question: 'What is the result of: typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctIndex: 2 },
      { question: 'Which is NOT a valid variable name?', options: ['_name', '$value', '2ndPlace', 'myVar'], correctIndex: 2 },
      { question: 'What does let x = 5; x += 3; result in?', options: ['5', '3', '8', '53'], correctIndex: 2 },
    ],
    loops: [
      { question: 'Which loop runs at least once?', options: ['for', 'while', 'do...while', 'for...in'], correctIndex: 2 },
      { question: 'What does "break" do in a loop?', options: ['Skips iteration', 'Exits loop', 'Restarts loop', 'Pauses loop'], correctIndex: 1 },
      { question: 'How many times does: for(let i=0; i<3; i++) run?', options: ['2', '3', '4', '1'], correctIndex: 1 },
      { question: 'Which loop iterates over object keys?', options: ['for', 'for...of', 'for...in', 'while'], correctIndex: 2 },
      { question: 'What does "continue" do?', options: ['Exits loop', 'Skips to next iteration', 'Stops program', 'Restarts loop'], correctIndex: 1 },
    ],
    functions: [
      { question: 'What keyword defines a function?', options: ['func', 'def', 'function', 'method'], correctIndex: 2 },
      { question: 'What is an arrow function syntax?', options: ['=> ()', '() =>', 'function =>', '-> ()'], correctIndex: 1 },
      { question: 'What does "return" do?', options: ['Logs value', 'Sends value back', 'Deletes function', 'Creates variable'], correctIndex: 1 },
      { question: 'What is a callback function?', options: ['A function passed as argument', 'A recursive function', 'A constructor', 'A generator'], correctIndex: 0 },
      { question: 'What is the default return value of a function?', options: ['0', 'null', 'undefined', 'false'], correctIndex: 2 },
    ],
    arrays: [
      { question: 'How to add an element to the end of an array?', options: ['.pop()', '.push()', '.shift()', '.unshift()'], correctIndex: 1 },
      { question: 'What does .map() return?', options: ['Boolean', 'New array', 'Number', 'String'], correctIndex: 1 },
      { question: 'How to get the length of array [1,2,3]?', options: ['.size', '.length', '.count', '.total'], correctIndex: 1 },
      { question: 'What does .filter() do?', options: ['Sorts array', 'Returns matching elements', 'Removes duplicates', 'Reverses array'], correctIndex: 1 },
      { question: 'What is the index of the first element?', options: ['1', '0', '-1', 'null'], correctIndex: 1 },
    ],
    debugging: [
      { question: 'Which tool shows runtime errors in the browser?', options: ['Terminal', 'Console', 'Editor', 'Git'], correctIndex: 1 },
      { question: 'What does console.log() do?', options: ['Saves to file', 'Prints to console', 'Creates alert', 'Sends email'], correctIndex: 1 },
      { question: 'What is a breakpoint?', options: ['A syntax error', 'A code pause point', 'A loop exit', 'A function call'], correctIndex: 1 },
      { question: 'What causes a ReferenceError?', options: ['Wrong syntax', 'Using undeclared variable', 'Division by zero', 'Missing semicolon'], correctIndex: 1 },
      { question: 'What does try...catch do?', options: ['Loops code', 'Handles errors gracefully', 'Declares variables', 'Imports modules'], correctIndex: 1 },
    ],
    objects: [
      { question: 'How to access object property?', options: ['obj[key]', 'obj.key', 'Both A and B', 'obj->key'], correctIndex: 2 },
      { question: 'What does Object.keys() return?', options: ['Values', 'Array of keys', 'Object', 'String'], correctIndex: 1 },
      { question: 'How to add a property to object?', options: ['obj.new = value', 'obj->new', 'obj::new', 'add(obj, new)'], correctIndex: 0 },
      { question: 'What is object destructuring?', options: ['Delete property', 'Extract properties', 'Merge objects', 'Clone object'], correctIndex: 1 },
      { question: 'What does JSON.stringify() do?', options: ['Parse JSON', 'Convert to string', 'Create object', 'Delete object'], correctIndex: 1 },
    ],
    async: [
      { question: 'What keyword makes function asynchronous?', options: ['await', 'async', 'promise', 'then'], correctIndex: 1 },
      { question: 'What does await do?', options: ['Stops program', 'Waits for promise', 'Creates promise', 'Deletes promise'], correctIndex: 1 },
      { question: 'What is a Promise?', options: ['Loop', 'Async operation result', 'Variable type', 'Function'], correctIndex: 1 },
      { question: 'How to handle promise rejection?', options: ['.then()', '.catch()', '.finally()', '.reject()'], correctIndex: 1 },
      { question: 'What does Promise.all() do?', options: ['Run one promise', 'Wait for all promises', 'Cancel promises', 'Create promise'], correctIndex: 1 },
    ],
    dom: [
      { question: 'How to select element by ID?', options: ['getElement()', 'getElementById()', 'selectId()', 'findById()'], correctIndex: 1 },
      { question: 'What does querySelector() return?', options: ['All elements', 'First matching element', 'Array', 'String'], correctIndex: 1 },
      { question: 'How to change element text?', options: ['.text', '.innerHTML', '.value', '.content'], correctIndex: 1 },
      { question: 'What is an event listener?', options: ['CSS rule', 'Function for events', 'HTML tag', 'Variable'], correctIndex: 1 },
      { question: 'How to create new element?', options: ['new Element()', 'createElement()', 'addElement()', 'makeElement()'], correctIndex: 1 },
    ],
    es6: [
      { question: 'What is template literal syntax?', options: ['"text"', "'text'", '`text`', '<text>'], correctIndex: 2 },
      { question: 'What does spread operator ... do?', options: ['Delete items', 'Expand array/object', 'Create loop', 'Define function'], correctIndex: 1 },
      { question: 'What is default parameter?', options: ['Required param', 'Param with default value', 'First param', 'Last param'], correctIndex: 1 },
      { question: 'What is class in ES6?', options: ['Function', 'Blueprint for objects', 'Variable', 'Loop'], correctIndex: 1 },
      { question: 'What does import/export do?', options: ['Delete code', 'Share code between files', 'Run code', 'Debug code'], correctIndex: 1 },
    ],
    algorithms: [
      { question: 'What is Big O notation?', options: ['Variable name', 'Algorithm complexity', 'Loop type', 'Function name'], correctIndex: 1 },
      { question: 'What is binary search?', options: ['Linear search', 'Divide and conquer search', 'Random search', 'Bubble sort'], correctIndex: 1 },
      { question: 'What is recursion?', options: ['Loop', 'Function calling itself', 'Variable', 'Array method'], correctIndex: 1 },
      { question: 'What is time complexity of bubble sort?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctIndex: 1 },
      { question: 'What is a stack data structure?', options: ['FIFO', 'LIFO', 'Random access', 'Sorted list'], correctIndex: 1 },
    ],
    closures: [
      { question: 'What is a closure?', options: ['Loop end', 'Function with access to outer scope', 'Class method', 'Variable type'], correctIndex: 1 },
      { question: 'When is a closure created?', options: ['Function declaration', 'Function execution', 'Variable assignment', 'Loop iteration'], correctIndex: 0 },
      { question: 'What does closure preserve?', options: ['Global variables', 'Outer function scope', 'Loop counter', 'Class properties'], correctIndex: 1 },
      { question: 'Which creates a closure?', options: ['for loop', 'if statement', 'Nested function', 'switch case'], correctIndex: 2 },
      { question: 'What is closure useful for?', options: ['Data encapsulation', 'Loop optimization', 'Type checking', 'Error handling'], correctIndex: 0 },
    ],
    prototypes: [
      { question: 'What is prototype in JavaScript?', options: ['Class', 'Object inheritance mechanism', 'Variable type', 'Function'], correctIndex: 1 },
      { question: 'How to access prototype?', options: ['.__proto__', '.prototype', 'Both A and B', '.parent'], correctIndex: 2 },
      { question: 'What is prototype chain?', options: ['Array method', 'Inheritance hierarchy', 'Loop type', 'Variable scope'], correctIndex: 1 },
      { question: 'What does Object.create() do?', options: ['Delete object', 'Create object with prototype', 'Clone object', 'Merge objects'], correctIndex: 1 },
      { question: 'Where are methods stored?', options: ['Each instance', 'Prototype', 'Global scope', 'Constructor'], correctIndex: 1 },
    ],
    promises: [
      { question: 'What are Promise states?', options: ['pending/resolved', 'pending/fulfilled/rejected', 'start/end', 'true/false'], correctIndex: 1 },
      { question: 'What does Promise.race() do?', options: ['Run all', 'Return first settled', 'Cancel all', 'Retry failed'], correctIndex: 1 },
      { question: 'How to chain promises?', options: ['.next()', '.then()', '.chain()', '.after()'], correctIndex: 1 },
      { question: 'What is Promise.allSettled()?', options: ['Wait for all regardless of result', 'Wait for first', 'Cancel all', 'Retry all'], correctIndex: 0 },
      { question: 'Can you cancel a Promise?', options: ['Yes, with .cancel()', 'No, natively', 'Yes, with abort', 'Yes, with stop'], correctIndex: 1 },
    ],
    generators: [
      { question: 'What is generator function syntax?', options: ['function()', 'function*()', 'async function', 'gen function'], correctIndex: 1 },
      { question: 'What does yield do?', options: ['Return and pause', 'Return and exit', 'Loop', 'Throw error'], correctIndex: 0 },
      { question: 'How to iterate generator?', options: ['.forEach()', '.next()', '.map()', '.run()'], correctIndex: 1 },
      { question: 'What does generator return?', options: ['Array', 'Iterator', 'Promise', 'Object'], correctIndex: 1 },
      { question: 'Can generator be infinite?', options: ['No', 'Yes', 'Only with async', 'Only in strict mode'], correctIndex: 1 },
    ],
    modules: [
      { question: 'What is ES6 module syntax?', options: ['require()', 'import/export', 'include()', 'load()'], correctIndex: 1 },
      { question: 'What is default export?', options: ['Multiple exports', 'Single main export', 'Named export', 'All exports'], correctIndex: 1 },
      { question: 'How to import everything?', options: ['import all', 'import * as name', 'import {*}', 'import default'], correctIndex: 1 },
      { question: 'What is tree shaking?', options: ['Remove unused code', 'Optimize loops', 'Compress files', 'Minify code'], correctIndex: 0 },
      { question: 'Can modules be dynamic?', options: ['No', 'Yes, with import()', 'Only with require', 'Only in Node'], correctIndex: 1 },
    ],
    regex: [
      { question: 'What does /^abc/ match?', options: ['Contains abc', 'Starts with abc', 'Ends with abc', 'Exactly abc'], correctIndex: 1 },
      { question: 'What is \\d in regex?', options: ['Letter', 'Digit', 'Whitespace', 'Any character'], correctIndex: 1 },
      { question: 'What does + quantifier mean?', options: ['0 or more', '1 or more', 'Exactly 1', '0 or 1'], correctIndex: 1 },
      { question: 'What is capturing group?', options: ['[]', '()', '{}', '<>'], correctIndex: 1 },
      { question: 'What flag makes regex case-insensitive?', options: ['/g', '/i', '/m', '/s'], correctIndex: 1 },
    ],
    performance: [
      { question: 'What is debouncing?', options: ['Delay execution until pause', 'Execute immediately', 'Execute periodically', 'Cancel execution'], correctIndex: 0 },
      { question: 'What is throttling?', options: ['Delay all', 'Limit execution rate', 'Cancel execution', 'Execute once'], correctIndex: 1 },
      { question: 'What is memoization?', options: ['Cache results', 'Clear cache', 'Optimize loops', 'Compress data'], correctIndex: 0 },
      { question: 'What is lazy loading?', options: ['Load all at once', 'Load on demand', 'Preload everything', 'Never load'], correctIndex: 1 },
      { question: 'What is Web Worker for?', options: ['UI rendering', 'Background threads', 'Network requests', 'Storage'], correctIndex: 1 },
    ],
    security: [
      { question: 'What is XSS?', options: ['Cross-Site Scripting', 'Extra Style Sheet', 'XML Schema', 'Export System'], correctIndex: 0 },
      { question: 'How to prevent XSS?', options: ['Use eval()', 'Sanitize input', 'Disable JavaScript', 'Use HTTP'], correctIndex: 1 },
      { question: 'What is CSRF?', options: ['Cross-Site Request Forgery', 'Client Server Request', 'Cookie Storage', 'Cache System'], correctIndex: 0 },
      { question: 'What is Content Security Policy?', options: ['CSS framework', 'Security header', 'Cookie policy', 'Storage limit'], correctIndex: 1 },
      { question: 'Why avoid eval()?', options: ['Slow', 'Security risk', 'Deprecated', 'Not supported'], correctIndex: 1 },
    ],
    patterns: [
      { question: 'What is Singleton pattern?', options: ['Multiple instances', 'Single instance', 'No instances', 'Factory'], correctIndex: 1 },
      { question: 'What is Observer pattern?', options: ['Watch variables', 'Subscribe to events', 'Create objects', 'Validate data'], correctIndex: 1 },
      { question: 'What is Factory pattern?', options: ['Create objects', 'Destroy objects', 'Clone objects', 'Merge objects'], correctIndex: 0 },
      { question: 'What is Module pattern?', options: ['Import/export', 'Encapsulation with IIFE', 'Class inheritance', 'Async loading'], correctIndex: 1 },
      { question: 'What is MVC?', options: ['Model-View-Controller', 'Module-Variable-Class', 'Method-Value-Constant', 'Main-View-Component'], correctIndex: 0 },
    ],
    testing: [
      { question: 'What is unit test?', options: ['Test whole app', 'Test individual units', 'Test UI', 'Test performance'], correctIndex: 1 },
      { question: 'What is TDD?', options: ['Test-Driven Development', 'Type-Driven Design', 'Test Data Definition', 'Total Debug Duration'], correctIndex: 0 },
      { question: 'What is mocking?', options: ['Real implementation', 'Fake implementation', 'Delete code', 'Optimize code'], correctIndex: 1 },
      { question: 'What is assertion?', options: ['Variable declaration', 'Expected vs actual check', 'Loop condition', 'Function call'], correctIndex: 1 },
      { question: 'What is code coverage?', options: ['Lines tested', 'Lines written', 'Bugs found', 'Performance score'], correctIndex: 0 },
    ],
    typescript: [
      { question: 'What is TypeScript?', options: ['JavaScript library', 'JavaScript superset', 'New language', 'Framework'], correctIndex: 1 },
      { question: 'What does tsc do?', options: ['Run tests', 'Compile TS to JS', 'Bundle files', 'Lint code'], correctIndex: 1 },
      { question: 'What is interface in TS?', options: ['Class', 'Type definition', 'Function', 'Variable'], correctIndex: 1 },
      { question: 'What is any type?', options: ['No type', 'All types', 'String type', 'Number type'], correctIndex: 1 },
      { question: 'What is generic in TS?', options: ['Type variable', 'Class type', 'Function type', 'Object type'], correctIndex: 0 },
    ],
    webpack: [
      { question: 'What is Webpack?', options: ['Test runner', 'Module bundler', 'Compiler', 'Linter'], correctIndex: 1 },
      { question: 'What is entry point?', options: ['Output file', 'Starting file', 'Config file', 'Plugin'], correctIndex: 1 },
      { question: 'What are loaders?', options: ['Transform files', 'Run tests', 'Bundle code', 'Minify code'], correctIndex: 0 },
      { question: 'What is code splitting?', options: ['Delete code', 'Split into chunks', 'Merge files', 'Compress code'], correctIndex: 1 },
      { question: 'What is HMR?', options: ['Hot Module Replacement', 'High Memory Required', 'HTML Module Render', 'HTTP Method Request'], correctIndex: 0 },
    ],
    react: [
      { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax', 'JSON Extended', 'JavaScript Extra'], correctIndex: 0 },
      { question: 'What is useState?', options: ['State hook', 'Effect hook', 'Context hook', 'Ref hook'], correctIndex: 0 },
      { question: 'What is useEffect for?', options: ['State management', 'Side effects', 'Routing', 'Styling'], correctIndex: 1 },
      { question: 'What is Virtual DOM?', options: ['Real DOM', 'In-memory DOM', 'Shadow DOM', 'Document'], correctIndex: 1 },
      { question: 'What is component?', options: ['Function', 'Reusable UI piece', 'Variable', 'Style'], correctIndex: 1 },
    ],
    nodejs: [
      { question: 'What is Node.js?', options: ['Framework', 'JavaScript runtime', 'Library', 'Database'], correctIndex: 1 },
      { question: 'What is npm?', options: ['Node Package Manager', 'New Programming Method', 'Node Process Manager', 'Network Protocol Manager'], correctIndex: 0 },
      { question: 'What is Express.js?', options: ['Database', 'Web framework', 'Testing tool', 'Bundler'], correctIndex: 1 },
      { question: 'What is middleware?', options: ['Database layer', 'Function between request/response', 'Frontend code', 'CSS framework'], correctIndex: 1 },
      { question: 'What is package.json?', options: ['Code file', 'Project metadata', 'Config file', 'Test file'], correctIndex: 1 },
    ],
    graphql: [
      { question: 'What is GraphQL?', options: ['Database', 'Query language for APIs', 'Framework', 'Library'], correctIndex: 1 },
      { question: 'What is schema in GraphQL?', options: ['Database table', 'Type definitions', 'Query', 'Mutation'], correctIndex: 1 },
      { question: 'What is resolver?', options: ['Function to fetch data', 'Database query', 'API endpoint', 'Middleware'], correctIndex: 0 },
      { question: 'What is mutation?', options: ['Read data', 'Write/update data', 'Delete data', 'Query data'], correctIndex: 1 },
      { question: 'GraphQL vs REST?', options: ['Same thing', 'Single endpoint vs multiple', 'Faster', 'Slower'], correctIndex: 1 },
    ],
    microservices: [
      { question: 'What is microservices?', options: ['Small functions', 'Independent services', 'Micro frontend', 'Small database'], correctIndex: 1 },
      { question: 'What is API Gateway?', options: ['Database', 'Entry point for services', 'Frontend', 'Testing tool'], correctIndex: 1 },
      { question: 'What is service discovery?', options: ['Find services', 'Create services', 'Delete services', 'Test services'], correctIndex: 0 },
      { question: 'What is circuit breaker?', options: ['Stop all services', 'Prevent cascade failures', 'Load balancer', 'Database'], correctIndex: 1 },
      { question: 'Microservices vs Monolith?', options: ['Same', 'Distributed vs single', 'Faster', 'Cheaper'], correctIndex: 1 },
    ],
    docker: [
      { question: 'What is Docker?', options: ['VM', 'Containerization platform', 'Cloud provider', 'Database'], correctIndex: 1 },
      { question: 'What is container?', options: ['VM', 'Isolated process', 'Server', 'Database'], correctIndex: 1 },
      { question: 'What is Dockerfile?', options: ['Config file', 'Container blueprint', 'Image', 'Volume'], correctIndex: 1 },
      { question: 'What is Docker image?', options: ['Running container', 'Container template', 'Volume', 'Network'], correctIndex: 1 },
      { question: 'What is docker-compose?', options: ['Single container', 'Multi-container tool', 'Image builder', 'Registry'], correctIndex: 1 },
    ],
    cicd: [
      { question: 'What is CI/CD?', options: ['Testing tool', 'Continuous Integration/Deployment', 'Cloud service', 'Database'], correctIndex: 1 },
      { question: 'What is pipeline?', options: ['Database', 'Automated workflow', 'API', 'Framework'], correctIndex: 1 },
      { question: 'What is Jenkins?', options: ['Language', 'CI/CD tool', 'Database', 'Framework'], correctIndex: 1 },
      { question: 'What is deployment?', options: ['Write code', 'Release to production', 'Test code', 'Debug code'], correctIndex: 1 },
      { question: 'What is rollback?', options: ['Update', 'Revert to previous version', 'Delete', 'Backup'], correctIndex: 1 },
    ],
    cloud: [
      { question: 'What is cloud computing?', options: ['Local server', 'Internet-based computing', 'Desktop app', 'Mobile app'], correctIndex: 1 },
      { question: 'What is AWS?', options: ['Database', 'Cloud platform', 'Framework', 'Language'], correctIndex: 1 },
      { question: 'What is serverless?', options: ['No servers', 'Managed servers', 'Local hosting', 'Desktop app'], correctIndex: 1 },
      { question: 'What is S3?', options: ['Database', 'Object storage', 'Compute service', 'Network'], correctIndex: 1 },
      { question: 'What is load balancer?', options: ['Database', 'Distribute traffic', 'Storage', 'Cache'], correctIndex: 1 },
    ],
    architecture: [
      { question: 'What is MVC?', options: ['Model-View-Controller', 'Module-Variable-Class', 'Main-View-Component', 'Method-Value-Constant'], correctIndex: 0 },
      { question: 'What is scalability?', options: ['Speed', 'Handle growth', 'Security', 'Testing'], correctIndex: 1 },
      { question: 'What is caching?', options: ['Delete data', 'Store frequently used data', 'Backup', 'Compress'], correctIndex: 1 },
      { question: 'What is CDN?', options: ['Database', 'Content Delivery Network', 'Cloud service', 'Framework'], correctIndex: 1 },
      { question: 'What is horizontal scaling?', options: ['Bigger server', 'More servers', 'Faster code', 'Better database'], correctIndex: 1 },
    ],
  },
  id: {
    variables: [
      { question: 'Keyword apa untuk mendeklarasikan konstanta di JavaScript?', options: ['var', 'let', 'const', 'static'], correctIndex: 2 },
      { question: 'Tipe data mana yang menyimpan true atau false?', options: ['String', 'Number', 'Boolean', 'Object'], correctIndex: 2 },
      { question: 'Apa hasil dari: typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctIndex: 2 },
      { question: 'Mana yang BUKAN nama variabel valid?', options: ['_name', '$value', '2ndPlace', 'myVar'], correctIndex: 2 },
      { question: 'Apa hasil dari let x = 5; x += 3;?', options: ['5', '3', '8', '53'], correctIndex: 2 },
    ],
    loops: [
      { question: 'Loop mana yang berjalan minimal satu kali?', options: ['for', 'while', 'do...while', 'for...in'], correctIndex: 2 },
      { question: 'Apa fungsi "break" dalam loop?', options: ['Lewati iterasi', 'Keluar dari loop', 'Mulai ulang', 'Jeda loop'], correctIndex: 1 },
      { question: 'Berapa kali for(let i=0; i<3; i++) berjalan?', options: ['2', '3', '4', '1'], correctIndex: 1 },
      { question: 'Loop mana yang iterasi key objek?', options: ['for', 'for...of', 'for...in', 'while'], correctIndex: 2 },
      { question: 'Apa fungsi "continue"?', options: ['Keluar loop', 'Lompat ke iterasi berikutnya', 'Hentikan program', 'Mulai ulang loop'], correctIndex: 1 },
    ],
    functions: [
      { question: 'Keyword apa untuk mendefinisikan fungsi?', options: ['func', 'def', 'function', 'method'], correctIndex: 2 },
      { question: 'Bagaimana sintaks arrow function?', options: ['=> ()', '() =>', 'function =>', '-> ()'], correctIndex: 1 },
      { question: 'Apa fungsi "return"?', options: ['Log nilai', 'Mengembalikan nilai', 'Hapus fungsi', 'Buat variabel'], correctIndex: 1 },
      { question: 'Apa itu callback function?', options: ['Fungsi yang dikirim sebagai argumen', 'Fungsi rekursif', 'Konstruktor', 'Generator'], correctIndex: 0 },
      { question: 'Apa nilai return default sebuah fungsi?', options: ['0', 'null', 'undefined', 'false'], correctIndex: 2 },
    ],
    arrays: [
      { question: 'Cara menambah elemen di akhir array?', options: ['.pop()', '.push()', '.shift()', '.unshift()'], correctIndex: 1 },
      { question: 'Apa yang dikembalikan .map()?', options: ['Boolean', 'Array baru', 'Number', 'String'], correctIndex: 1 },
      { question: 'Cara mendapatkan panjang array [1,2,3]?', options: ['.size', '.length', '.count', '.total'], correctIndex: 1 },
      { question: 'Apa fungsi .filter()?', options: ['Urutkan array', 'Kembalikan elemen yang cocok', 'Hapus duplikat', 'Balik array'], correctIndex: 1 },
      { question: 'Berapa indeks elemen pertama?', options: ['1', '0', '-1', 'null'], correctIndex: 1 },
    ],
    debugging: [
      { question: 'Tool apa yang menampilkan error runtime di browser?', options: ['Terminal', 'Console', 'Editor', 'Git'], correctIndex: 1 },
      { question: 'Apa fungsi console.log()?', options: ['Simpan ke file', 'Cetak ke console', 'Buat alert', 'Kirim email'], correctIndex: 1 },
      { question: 'Apa itu breakpoint?', options: ['Error sintaks', 'Titik jeda kode', 'Keluar loop', 'Panggil fungsi'], correctIndex: 1 },
      { question: 'Apa penyebab ReferenceError?', options: ['Sintaks salah', 'Variabel belum dideklarasi', 'Bagi dengan nol', 'Kekurangan titik koma'], correctIndex: 1 },
      { question: 'Apa fungsi try...catch?', options: ['Loop kode', 'Tangani error dengan baik', 'Deklarasi variabel', 'Import modul'], correctIndex: 1 },
    ],
    objects: [
      { question: 'Cara mengakses properti object?', options: ['obj[key]', 'obj.key', 'Keduanya benar', 'obj->key'], correctIndex: 2 },
      { question: 'Apa yang dikembalikan Object.keys()?', options: ['Values', 'Array of keys', 'Object', 'String'], correctIndex: 1 },
      { question: 'Cara menambah properti ke object?', options: ['obj.new = value', 'obj->new', 'obj::new', 'add(obj, new)'], correctIndex: 0 },
      { question: 'Apa itu object destructuring?', options: ['Hapus properti', 'Ekstrak properti', 'Gabung object', 'Clone object'], correctIndex: 1 },
      { question: 'Apa fungsi JSON.stringify()?', options: ['Parse JSON', 'Ubah ke string', 'Buat object', 'Hapus object'], correctIndex: 1 },
    ],
    async: [
      { question: 'Keyword apa yang membuat fungsi asynchronous?', options: ['await', 'async', 'promise', 'then'], correctIndex: 1 },
      { question: 'Apa fungsi await?', options: ['Stop program', 'Tunggu promise', 'Buat promise', 'Hapus promise'], correctIndex: 1 },
      { question: 'Apa itu Promise?', options: ['Loop', 'Hasil operasi async', 'Tipe variabel', 'Fungsi'], correctIndex: 1 },
      { question: 'Cara handle promise rejection?', options: ['.then()', '.catch()', '.finally()', '.reject()'], correctIndex: 1 },
      { question: 'Apa fungsi Promise.all()?', options: ['Jalankan satu promise', 'Tunggu semua promise', 'Batalkan promise', 'Buat promise'], correctIndex: 1 },
    ],
    dom: [
      { question: 'Cara select element by ID?', options: ['getElement()', 'getElementById()', 'selectId()', 'findById()'], correctIndex: 1 },
      { question: 'Apa yang dikembalikan querySelector()?', options: ['Semua element', 'Element pertama yang cocok', 'Array', 'String'], correctIndex: 1 },
      { question: 'Cara ubah text element?', options: ['.text', '.innerHTML', '.value', '.content'], correctIndex: 1 },
      { question: 'Apa itu event listener?', options: ['CSS rule', 'Fungsi untuk event', 'HTML tag', 'Variabel'], correctIndex: 1 },
      { question: 'Cara buat element baru?', options: ['new Element()', 'createElement()', 'addElement()', 'makeElement()'], correctIndex: 1 },
    ],
    es6: [
      { question: 'Apa sintaks template literal?', options: ['"text"', "'text'", '`text`', '<text>'], correctIndex: 2 },
      { question: 'Apa fungsi spread operator ...?', options: ['Hapus item', 'Expand array/object', 'Buat loop', 'Define fungsi'], correctIndex: 1 },
      { question: 'Apa itu default parameter?', options: ['Param wajib', 'Param dengan nilai default', 'Param pertama', 'Param terakhir'], correctIndex: 1 },
      { question: 'Apa itu class di ES6?', options: ['Fungsi', 'Blueprint untuk object', 'Variabel', 'Loop'], correctIndex: 1 },
      { question: 'Apa fungsi import/export?', options: ['Hapus kode', 'Bagikan kode antar file', 'Jalankan kode', 'Debug kode'], correctIndex: 1 },
    ],
    algorithms: [
      { question: 'Apa itu Big O notation?', options: ['Nama variabel', 'Kompleksitas algoritma', 'Tipe loop', 'Nama fungsi'], correctIndex: 1 },
      { question: 'Apa itu binary search?', options: ['Linear search', 'Divide and conquer search', 'Random search', 'Bubble sort'], correctIndex: 1 },
      { question: 'Apa itu recursion?', options: ['Loop', 'Fungsi memanggil dirinya', 'Variabel', 'Method array'], correctIndex: 1 },
      { question: 'Berapa time complexity bubble sort?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctIndex: 1 },
      { question: 'Apa itu stack data structure?', options: ['FIFO', 'LIFO', 'Random access', 'Sorted list'], correctIndex: 1 },
    ],
    closures: [
      { question: 'Apa itu closure?', options: ['Akhir loop', 'Fungsi dengan akses ke outer scope', 'Method class', 'Tipe variabel'], correctIndex: 1 },
      { question: 'Kapan closure dibuat?', options: ['Deklarasi fungsi', 'Eksekusi fungsi', 'Assignment variabel', 'Iterasi loop'], correctIndex: 0 },
      { question: 'Apa yang dipertahankan closure?', options: ['Variabel global', 'Scope fungsi luar', 'Loop counter', 'Properti class'], correctIndex: 1 },
      { question: 'Mana yang membuat closure?', options: ['for loop', 'if statement', 'Nested function', 'switch case'], correctIndex: 2 },
      { question: 'Untuk apa closure berguna?', options: ['Enkapsulasi data', 'Optimasi loop', 'Type checking', 'Error handling'], correctIndex: 0 },
    ],
    prototypes: [
      { question: 'Apa itu prototype di JavaScript?', options: ['Class', 'Mekanisme inheritance object', 'Tipe variabel', 'Fungsi'], correctIndex: 1 },
      { question: 'Cara akses prototype?', options: ['.__proto__', '.prototype', 'Keduanya benar', '.parent'], correctIndex: 2 },
      { question: 'Apa itu prototype chain?', options: ['Method array', 'Hierarki inheritance', 'Tipe loop', 'Scope variabel'], correctIndex: 1 },
      { question: 'Apa fungsi Object.create()?', options: ['Hapus object', 'Buat object dengan prototype', 'Clone object', 'Gabung object'], correctIndex: 1 },
      { question: 'Dimana method disimpan?', options: ['Setiap instance', 'Prototype', 'Global scope', 'Constructor'], correctIndex: 1 },
    ],
    promises: [
      { question: 'Apa state Promise?', options: ['pending/resolved', 'pending/fulfilled/rejected', 'start/end', 'true/false'], correctIndex: 1 },
      { question: 'Apa fungsi Promise.race()?', options: ['Jalankan semua', 'Return yang pertama selesai', 'Batalkan semua', 'Retry yang gagal'], correctIndex: 1 },
      { question: 'Cara chain promises?', options: ['.next()', '.then()', '.chain()', '.after()'], correctIndex: 1 },
      { question: 'Apa itu Promise.allSettled()?', options: ['Tunggu semua tanpa peduli hasil', 'Tunggu yang pertama', 'Batalkan semua', 'Retry semua'], correctIndex: 0 },
      { question: 'Bisa cancel Promise?', options: ['Ya, dengan .cancel()', 'Tidak, secara native', 'Ya, dengan abort', 'Ya, dengan stop'], correctIndex: 1 },
    ],
    generators: [
      { question: 'Sintaks generator function?', options: ['function()', 'function*()', 'async function', 'gen function'], correctIndex: 1 },
      { question: 'Apa fungsi yield?', options: ['Return dan pause', 'Return dan exit', 'Loop', 'Throw error'], correctIndex: 0 },
      { question: 'Cara iterasi generator?', options: ['.forEach()', '.next()', '.map()', '.run()'], correctIndex: 1 },
      { question: 'Apa yang dikembalikan generator?', options: ['Array', 'Iterator', 'Promise', 'Object'], correctIndex: 1 },
      { question: 'Bisa generator infinite?', options: ['Tidak', 'Ya', 'Hanya dengan async', 'Hanya di strict mode'], correctIndex: 1 },
    ],
    modules: [
      { question: 'Sintaks ES6 module?', options: ['require()', 'import/export', 'include()', 'load()'], correctIndex: 1 },
      { question: 'Apa itu default export?', options: ['Multiple exports', 'Single main export', 'Named export', 'All exports'], correctIndex: 1 },
      { question: 'Cara import semuanya?', options: ['import all', 'import * as name', 'import {*}', 'import default'], correctIndex: 1 },
      { question: 'Apa itu tree shaking?', options: ['Hapus kode tidak terpakai', 'Optimasi loop', 'Kompres file', 'Minify kode'], correctIndex: 0 },
      { question: 'Bisa module dynamic?', options: ['Tidak', 'Ya, dengan import()', 'Hanya dengan require', 'Hanya di Node'], correctIndex: 1 },
    ],
    regex: [
      { question: 'Apa yang cocok dengan /^abc/?', options: ['Mengandung abc', 'Dimulai dengan abc', 'Diakhiri dengan abc', 'Persis abc'], correctIndex: 1 },
      { question: 'Apa itu \\d di regex?', options: ['Huruf', 'Digit', 'Whitespace', 'Karakter apapun'], correctIndex: 1 },
      { question: 'Arti quantifier +?', options: ['0 atau lebih', '1 atau lebih', 'Persis 1', '0 atau 1'], correctIndex: 1 },
      { question: 'Apa itu capturing group?', options: ['[]', '()', '{}', '<>'], correctIndex: 1 },
      { question: 'Flag untuk case-insensitive?', options: ['/g', '/i', '/m', '/s'], correctIndex: 1 },
    ],
    performance: [
      { question: 'Apa itu debouncing?', options: ['Tunda eksekusi sampai jeda', 'Eksekusi langsung', 'Eksekusi periodik', 'Batalkan eksekusi'], correctIndex: 0 },
      { question: 'Apa itu throttling?', options: ['Tunda semua', 'Batasi rate eksekusi', 'Batalkan eksekusi', 'Eksekusi sekali'], correctIndex: 1 },
      { question: 'Apa itu memoization?', options: ['Cache hasil', 'Hapus cache', 'Optimasi loop', 'Kompres data'], correctIndex: 0 },
      { question: 'Apa itu lazy loading?', options: ['Load semua sekaligus', 'Load saat dibutuhkan', 'Preload semuanya', 'Tidak pernah load'], correctIndex: 1 },
      { question: 'Untuk apa Web Worker?', options: ['UI rendering', 'Background threads', 'Network requests', 'Storage'], correctIndex: 1 },
    ],
    security: [
      { question: 'Apa itu XSS?', options: ['Cross-Site Scripting', 'Extra Style Sheet', 'XML Schema', 'Export System'], correctIndex: 0 },
      { question: 'Cara cegah XSS?', options: ['Pakai eval()', 'Sanitasi input', 'Disable JavaScript', 'Pakai HTTP'], correctIndex: 1 },
      { question: 'Apa itu CSRF?', options: ['Cross-Site Request Forgery', 'Client Server Request', 'Cookie Storage', 'Cache System'], correctIndex: 0 },
      { question: 'Apa itu Content Security Policy?', options: ['CSS framework', 'Security header', 'Cookie policy', 'Storage limit'], correctIndex: 1 },
      { question: 'Kenapa hindari eval()?', options: ['Lambat', 'Risiko keamanan', 'Deprecated', 'Tidak didukung'], correctIndex: 1 },
    ],
    patterns: [
      { question: 'Apa itu Singleton pattern?', options: ['Multiple instances', 'Single instance', 'No instances', 'Factory'], correctIndex: 1 },
      { question: 'Apa itu Observer pattern?', options: ['Watch variabel', 'Subscribe ke events', 'Buat objects', 'Validasi data'], correctIndex: 1 },
      { question: 'Apa itu Factory pattern?', options: ['Buat objects', 'Hapus objects', 'Clone objects', 'Gabung objects'], correctIndex: 0 },
      { question: 'Apa itu Module pattern?', options: ['Import/export', 'Enkapsulasi dengan IIFE', 'Class inheritance', 'Async loading'], correctIndex: 1 },
      { question: 'Apa itu MVC?', options: ['Model-View-Controller', 'Module-Variable-Class', 'Method-Value-Constant', 'Main-View-Component'], correctIndex: 0 },
    ],
    testing: [
      { question: 'Apa itu unit test?', options: ['Test seluruh app', 'Test unit individual', 'Test UI', 'Test performance'], correctIndex: 1 },
      { question: 'Apa itu TDD?', options: ['Test-Driven Development', 'Type-Driven Design', 'Test Data Definition', 'Total Debug Duration'], correctIndex: 0 },
      { question: 'Apa itu mocking?', options: ['Implementasi asli', 'Implementasi palsu', 'Hapus kode', 'Optimasi kode'], correctIndex: 1 },
      { question: 'Apa itu assertion?', options: ['Deklarasi variabel', 'Cek expected vs actual', 'Kondisi loop', 'Panggil fungsi'], correctIndex: 1 },
      { question: 'Apa itu code coverage?', options: ['Baris yang ditest', 'Baris yang ditulis', 'Bug yang ditemukan', 'Skor performance'], correctIndex: 0 },
    ],
    typescript: [
      { question: 'Apa itu TypeScript?', options: ['Library JavaScript', 'Superset JavaScript', 'Bahasa baru', 'Framework'], correctIndex: 1 },
      { question: 'Apa fungsi tsc?', options: ['Run tests', 'Compile TS ke JS', 'Bundle files', 'Lint code'], correctIndex: 1 },
      { question: 'Apa itu interface di TS?', options: ['Class', 'Definisi tipe', 'Fungsi', 'Variabel'], correctIndex: 1 },
      { question: 'Apa itu any type?', options: ['Tidak ada tipe', 'Semua tipe', 'Tipe string', 'Tipe number'], correctIndex: 1 },
      { question: 'Apa itu generic di TS?', options: ['Variabel tipe', 'Tipe class', 'Tipe fungsi', 'Tipe object'], correctIndex: 0 },
    ],
    webpack: [
      { question: 'Apa itu Webpack?', options: ['Test runner', 'Module bundler', 'Compiler', 'Linter'], correctIndex: 1 },
      { question: 'Apa itu entry point?', options: ['Output file', 'File awal', 'Config file', 'Plugin'], correctIndex: 1 },
      { question: 'Apa itu loaders?', options: ['Transform files', 'Run tests', 'Bundle code', 'Minify code'], correctIndex: 0 },
      { question: 'Apa itu code splitting?', options: ['Hapus kode', 'Pecah jadi chunks', 'Gabung files', 'Kompres kode'], correctIndex: 1 },
      { question: 'Apa itu HMR?', options: ['Hot Module Replacement', 'High Memory Required', 'HTML Module Render', 'HTTP Method Request'], correctIndex: 0 },
    ],
    react: [
      { question: 'Apa itu JSX?', options: ['JavaScript XML', 'Java Syntax', 'JSON Extended', 'JavaScript Extra'], correctIndex: 0 },
      { question: 'Apa itu useState?', options: ['State hook', 'Effect hook', 'Context hook', 'Ref hook'], correctIndex: 0 },
      { question: 'Untuk apa useEffect?', options: ['State management', 'Side effects', 'Routing', 'Styling'], correctIndex: 1 },
      { question: 'Apa itu Virtual DOM?', options: ['Real DOM', 'In-memory DOM', 'Shadow DOM', 'Document'], correctIndex: 1 },
      { question: 'Apa itu component?', options: ['Fungsi', 'UI yang reusable', 'Variabel', 'Style'], correctIndex: 1 },
    ],
    nodejs: [
      { question: 'Apa itu Node.js?', options: ['Framework', 'JavaScript runtime', 'Library', 'Database'], correctIndex: 1 },
      { question: 'Apa itu npm?', options: ['Node Package Manager', 'New Programming Method', 'Node Process Manager', 'Network Protocol Manager'], correctIndex: 0 },
      { question: 'Apa itu Express.js?', options: ['Database', 'Web framework', 'Testing tool', 'Bundler'], correctIndex: 1 },
      { question: 'Apa itu middleware?', options: ['Database layer', 'Fungsi antara request/response', 'Frontend code', 'CSS framework'], correctIndex: 1 },
      { question: 'Apa itu package.json?', options: ['Code file', 'Metadata project', 'Config file', 'Test file'], correctIndex: 1 },
    ],
    graphql: [
      { question: 'Apa itu GraphQL?', options: ['Database', 'Query language untuk APIs', 'Framework', 'Library'], correctIndex: 1 },
      { question: 'Apa itu schema di GraphQL?', options: ['Tabel database', 'Definisi tipe', 'Query', 'Mutation'], correctIndex: 1 },
      { question: 'Apa itu resolver?', options: ['Fungsi untuk fetch data', 'Query database', 'API endpoint', 'Middleware'], correctIndex: 0 },
      { question: 'Apa itu mutation?', options: ['Baca data', 'Tulis/update data', 'Hapus data', 'Query data'], correctIndex: 1 },
      { question: 'GraphQL vs REST?', options: ['Sama saja', 'Single endpoint vs multiple', 'Lebih cepat', 'Lebih lambat'], correctIndex: 1 },
    ],
    microservices: [
      { question: 'Apa itu microservices?', options: ['Fungsi kecil', 'Service independen', 'Micro frontend', 'Database kecil'], correctIndex: 1 },
      { question: 'Apa itu API Gateway?', options: ['Database', 'Entry point untuk services', 'Frontend', 'Testing tool'], correctIndex: 1 },
      { question: 'Apa itu service discovery?', options: ['Cari services', 'Buat services', 'Hapus services', 'Test services'], correctIndex: 0 },
      { question: 'Apa itu circuit breaker?', options: ['Stop semua services', 'Cegah cascade failures', 'Load balancer', 'Database'], correctIndex: 1 },
      { question: 'Microservices vs Monolith?', options: ['Sama', 'Distributed vs single', 'Lebih cepat', 'Lebih murah'], correctIndex: 1 },
    ],
    docker: [
      { question: 'Apa itu Docker?', options: ['VM', 'Platform containerization', 'Cloud provider', 'Database'], correctIndex: 1 },
      { question: 'Apa itu container?', options: ['VM', 'Proses terisolasi', 'Server', 'Database'], correctIndex: 1 },
      { question: 'Apa itu Dockerfile?', options: ['Config file', 'Blueprint container', 'Image', 'Volume'], correctIndex: 1 },
      { question: 'Apa itu Docker image?', options: ['Container berjalan', 'Template container', 'Volume', 'Network'], correctIndex: 1 },
      { question: 'Apa itu docker-compose?', options: ['Single container', 'Tool multi-container', 'Image builder', 'Registry'], correctIndex: 1 },
    ],
    cicd: [
      { question: 'Apa itu CI/CD?', options: ['Testing tool', 'Continuous Integration/Deployment', 'Cloud service', 'Database'], correctIndex: 1 },
      { question: 'Apa itu pipeline?', options: ['Database', 'Workflow otomatis', 'API', 'Framework'], correctIndex: 1 },
      { question: 'Apa itu Jenkins?', options: ['Bahasa', 'Tool CI/CD', 'Database', 'Framework'], correctIndex: 1 },
      { question: 'Apa itu deployment?', options: ['Tulis kode', 'Release ke production', 'Test kode', 'Debug kode'], correctIndex: 1 },
      { question: 'Apa itu rollback?', options: ['Update', 'Kembali ke versi sebelumnya', 'Hapus', 'Backup'], correctIndex: 1 },
    ],
    cloud: [
      { question: 'Apa itu cloud computing?', options: ['Server lokal', 'Komputasi berbasis internet', 'Desktop app', 'Mobile app'], correctIndex: 1 },
      { question: 'Apa itu AWS?', options: ['Database', 'Platform cloud', 'Framework', 'Bahasa'], correctIndex: 1 },
      { question: 'Apa itu serverless?', options: ['Tidak ada server', 'Server yang dikelola', 'Hosting lokal', 'Desktop app'], correctIndex: 1 },
      { question: 'Apa itu S3?', options: ['Database', 'Object storage', 'Compute service', 'Network'], correctIndex: 1 },
      { question: 'Apa itu load balancer?', options: ['Database', 'Distribusi traffic', 'Storage', 'Cache'], correctIndex: 1 },
    ],
    architecture: [
      { question: 'Apa itu MVC?', options: ['Model-View-Controller', 'Module-Variable-Class', 'Main-View-Component', 'Method-Value-Constant'], correctIndex: 0 },
      { question: 'Apa itu scalability?', options: ['Kecepatan', 'Menangani pertumbuhan', 'Keamanan', 'Testing'], correctIndex: 1 },
      { question: 'Apa itu caching?', options: ['Hapus data', 'Simpan data yang sering dipakai', 'Backup', 'Kompres'], correctIndex: 1 },
      { question: 'Apa itu CDN?', options: ['Database', 'Content Delivery Network', 'Cloud service', 'Framework'], correctIndex: 1 },
      { question: 'Apa itu horizontal scaling?', options: ['Server lebih besar', 'Lebih banyak server', 'Kode lebih cepat', 'Database lebih baik'], correctIndex: 1 },
    ],
  },
};

export function getQuestions(topic: TopicKey, lang: Language): QuizQuestion[] {
  const questions = quizData[lang][topic];
  
  // Shuffle questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  
  // Shuffle options for each question
  return shuffled.map(q => {
    const options = [...q.options];
    const correctAnswer = options[q.correctIndex];
    
    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    // Find new correct index
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      question: q.question,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
}

