-- ============================================================
-- CodeFlow — Complete 56-Lesson Curriculum (8 per stage × 7 stages)
-- Run in the Supabase SQL Editor AFTER all previous migrations.
-- Replaces ALL existing lesson data.
-- ============================================================

-- Clear existing data (CASCADE removes associated progress rows)
TRUNCATE public.lessons CASCADE;


-- ============================================================
-- STAGE 1: Home Row Only (a s d f g h j k l ;)
-- Pure home-row drills, increasing length
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000001-0001-0000-0000-000000000000',
    'Home Row Pairs',
    $body$ff jj dd kk ss ll aa ;;
ff jj dd kk ss ll aa ;;
jj ff kk dd ll ss ;; aa$body$,
    'drill', 'beginner', 1, 0
  ),
  (
    '30000001-0002-0000-0000-000000000000',
    'Mirror Fingers',
    $body$fj fj dk dk sl sl a; a;
fj dk sl a; fj dk sl a;
a; sl dk fj a; sl dk fj
fj dk sl a; a; sl dk fj$body$,
    'drill', 'beginner', 1, 1
  ),
  (
    '30000001-0003-0000-0000-000000000000',
    'Center Reach — G and H',
    $body$fg fg hj hj fg hj fg hj
fgf hjh fgf hjh fgf hjh
ghfj ghfj dksl a;gh dksl
fghj fghj ghfj dksl a;gh$body$,
    'drill', 'beginner', 1, 2
  ),
  (
    '30000001-0004-0000-0000-000000000000',
    'Full Home Row Sequences',
    $body$asdf jkl; asdf jkl; asdf jkl;
;lkj fdsa ;lkj fdsa ;lkj fdsa
asdf ;lkj fdsa jkl; asdf ;lkj
jkl; fdsa ;lkj asdf jkl; fdsa$body$,
    'drill', 'beginner', 1, 3
  ),
  (
    '30000001-0005-0000-0000-000000000000',
    'Alternating Hands',
    $body$aj sk dl f; gh aj sk dl f;
ja ks ld ;f hg ja ks ld ;f
ajsk dlf; ghja ksdl f;gh aj
f;dl skaj ghf; dlsk jaaj sk$body$,
    'drill', 'beginner', 1, 4
  ),
  (
    '30000001-0006-0000-0000-000000000000',
    'Home Row Words',
    $body$ask dad had lad fall gash
add hall dash fads lash glad
a dad had a lad; a gal had
a lass said; half a salad$body$,
    'drill', 'beginner', 1, 5
  ),
  (
    '30000001-0007-0000-0000-000000000000',
    'Home Row Sentences',
    $body$a lad had a flask; a lass had a glass
add half a dash; a salad shall fall
dad shall ask a lass; a glad lad had
a sad gal adds a flag; haggard alas$body$,
    'drill', 'beginner', 1, 6
  ),
  (
    '30000001-0008-0000-0000-000000000000',
    'Home Row Speed',
    $body$fj dk sl a; gh fj dk sl a; gh
a;sldkfj ghfjdksla; fjdksla;
ghfj dksl a;gh fjdk sla; ghfj
ask a lad; add a gash; a flask had
all had a hall; a glad dad shall add
flags fall; a lass dashes; salads shall$body$,
    'drill', 'beginner', 1, 7
  );


-- ============================================================
-- STAGE 2: Home + Top Row (adds q w e r t y u i o p)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000002-0001-0000-0000-000000000000',
    'Top Row Intro',
    $body$qq ww ee rr tt yy uu ii oo pp
qw er ty ui op qw er ty ui op
po iu yt re wq po iu yt re wq$body$,
    'drill', 'beginner', 2, 0
  ),
  (
    '30000002-0002-0000-0000-000000000000',
    'Home-to-Top Reach',
    $body$aq sw de fr gt hy ju ki lo ;p
aq sw de fr gt hy ju ki lo ;p
p; ol ki ju yh tg rf ed ws qa
qa ws ed rf tg yh ju ki ol p;$body$,
    'drill', 'beginner', 2, 1
  ),
  (
    '30000002-0003-0000-0000-000000000000',
    'Finger Columns',
    $body$aqa sws ded frf ftf jyj juj kik lol ;p;
;p; lol kik juj jyj ftf frf ded sws aqa
aqa sws ded frf jyj juj kik lol ;p;
;p; lol kik juj jyj ftf frf ded sws aqa$body$,
    'drill', 'beginner', 2, 2
  ),
  (
    '30000002-0004-0000-0000-000000000000',
    'Two Row Words',
    $body$power tower quiet equip route
write outer typed proof proper
tired query spite youth update
ropes pious quilt jewel royal$body$,
    'drill', 'beginner', 2, 3
  ),
  (
    '30000002-0005-0000-0000-000000000000',
    'Row Alternating',
    $body$qas wsd edf rfg tgh yhj uji iko olp
plokijuhygtfrdeswqa plokijuhyg
af sf df rf tf uj ij kj oj pj
aq sw de fr gt hy ju ki lo ;p$body$,
    'drill', 'beginner', 2, 4
  ),
  (
    '30000002-0006-0000-0000-000000000000',
    'Two Row Sentences',
    $body$the red quilt sits atop the old desk
tip your top hat to the quiet crowd
wide plots require proper plows here
the ripe fruit drops fast for people$body$,
    'drill', 'beginner', 2, 5
  ),
  (
    '30000002-0007-0000-0000-000000000000',
    'Top Row Combos',
    $body$qwer tyui op qwer tyui op qwer
poiu ytre wq poiu ytre wq poiu
qwerty uiop poiuyt rewq qwerty
uiop rewq tyui asdf jkl; qwer$body$,
    'drill', 'beginner', 2, 6
  ),
  (
    '30000002-0008-0000-0000-000000000000',
    'Two Row Speed',
    $body$the super frog leaped quite well today
power through the wild road with style
the right quote will sharply guide their
quest for the ideal worth of fellowship
please water your purple flowers daily
tidy people type quips properly here$body$,
    'drill', 'beginner', 2, 7
  );


-- ============================================================
-- STAGE 3: All Letter Rows (adds z x c v b n m , .)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000003-0001-0000-0000-000000000000',
    'Bottom Row Intro',
    $body$zz xx cc vv bb nn mm ,, ..
zx cv bn m, m. zx cv bn m,
., mn bv cx zx ., mn bv cx
zxcv bnm,. .,mnb vcxz zxcv$body$,
    'drill', 'beginner', 3, 0
  ),
  (
    '30000003-0002-0000-0000-000000000000',
    'Home-to-Bottom Reach',
    $body$az sx dc fv fb jn jm k, l.
az sx dc fv fb jn jm k, l.
.l ,k mj nj bf vf cd xs za
za xs cd vf bf nj mj k, l.$body$,
    'drill', 'beginner', 3, 1
  ),
  (
    '30000003-0003-0000-0000-000000000000',
    'Three Row Columns',
    $body$aza sxs dcd fvf fbf jnj jmj k,k l.l
l.l k,k jmj jnj fbf fvf dcd sxs aza
qazan swsxs dedcd frfvf jujmj kik,k
lol.l ;p; fbf jnj qazan kik,k dedcd$body$,
    'drill', 'beginner', 3, 2
  ),
  (
    '30000003-0004-0000-0000-000000000000',
    'Bottom Row Words',
    $body$can ban van mix box zen comb
back next verb zinc move name
vex magic cabin bench boxing
blanch cozy climb knack began$body$,
    'drill', 'beginner', 3, 3
  ),
  (
    '30000003-0005-0000-0000-000000000000',
    'Three Row Words',
    $body$the quick brown fox jumps over
a lazy dog packs my box with
five dozen jugs of liquid wax
crazy rhythm of complex typing$body$,
    'drill', 'beginner', 3, 4
  ),
  (
    '30000003-0006-0000-0000-000000000000',
    'Mixed Row Sentences',
    $body$vivid zebras examined my cozy blanket
bring calm, complex voices back now
mix zinc, black dye, and combine more
a brave man can jam next to boxing$body$,
    'drill', 'beginner', 3, 5
  ),
  (
    '30000003-0007-0000-0000-000000000000',
    'Full Alphabet Drill',
    $body$abcdefghijklmnopqrstuvwxyz
zyxwvutsrqponmlkjihgfedcba
the five boxing wizards jump quickly
pack my box with five dozen liquor jugs$body$,
    'drill', 'beginner', 3, 6
  ),
  (
    '30000003-0008-0000-0000-000000000000',
    'Three Row Speed',
    $body$the quick brown fox jumps over the lazy dog
my crazy uncle jack built six towers plain
bold viking captains maximize fuel growth
when zombies come, vex the dwarfs by jogging
quickly packing five frozen boxes with jam
exact brazen lynx jumps over the cozy quilt$body$,
    'drill', 'beginner', 3, 7
  );


-- ============================================================
-- STAGE 4: Numbers Row (adds 1 2 3 4 5 6 7 8 9 0)
-- Letters + digits mixed
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000004-0001-0000-0000-000000000000',
    'Number Basics',
    $body$11 22 33 44 55 66 77 88 99 00
12 34 56 78 90 12 34 56 78 90
09 87 65 43 21 09 87 65 43 21$body$,
    'drill', 'intermediate', 4, 0
  ),
  (
    '30000004-0002-0000-0000-000000000000',
    'Number Sequences',
    $body$123 456 789 012 345 678 901
987 654 321 098 765 432 109
135 246 357 468 579 680 791
111 222 333 444 555 666 777$body$,
    'drill', 'intermediate', 4, 1
  ),
  (
    '30000004-0003-0000-0000-000000000000',
    'Numbers with Letters',
    $body$a1 s2 d3 f4 f5 j6 j7 k8 l9 ;0
1a 2s 3d 4f 5f 6j 7j 8k 9l 0;
f4r d3e s2w a1q j7u j6y k8i l9o
q1a w2s e3d r4f t5f y6j u7j i8k$body$,
    'drill', 'intermediate', 4, 2
  ),
  (
    '30000004-0004-0000-0000-000000000000',
    'IP Addresses and Ports',
    $body$192.168.1.1 10.0.0.1 127.0.0.1
255.255.255.0 172.16.0.1 8.8.8.8
port 8080 port 3000 port 443
port 5432 port 6379 port 27017$body$,
    'drill', 'intermediate', 4, 3
  ),
  (
    '30000004-0005-0000-0000-000000000000',
    'Common Dev Numbers',
    $body$1024 2048 4096 8192 16384 32768
1920x1080 2560x1440 3840x2160
0xff 0x00 0xab 0x1a 0x7f 0xff
chmod 755 chmod 644 chmod 600$body$,
    'drill', 'intermediate', 4, 4
  ),
  (
    '30000004-0006-0000-0000-000000000000',
    'Dates and Times',
    $body$2024-01-15 2025-12-31 2023-06-30
12:30:45 09:15:00 23:59:59
Jan 1, 2024 Feb 14, 2025
03/15/2024 11/28/2025 07/04/2024$body$,
    'drill', 'intermediate', 4, 5
  ),
  (
    '30000004-0007-0000-0000-000000000000',
    'Mixed Alphanumeric',
    $body$user42 admin99 test01 build007
v2.1.0 v10.3.7 v0.9.1 v3.14.1
file001.txt log2024.csv data99.json
sha256 md5sum base64 utf8 ascii$body$,
    'drill', 'intermediate', 4, 6
  ),
  (
    '30000004-0008-0000-0000-000000000000',
    'Number Speed',
    $body$42 17 83 96 50 24 71 38 69 05
192 837 465 019 283 746 501 928
3141 5926 5358 9793 2384 6264
100 200 300 400 500 600 700 800 900
items: 12, price: 4599, tax: 827
order 10042 shipped on 2025-03-14$body$,
    'drill', 'intermediate', 4, 7
  );


-- ============================================================
-- STAGE 5: Common Dev Symbols ( () {} [] ; : = > < etc. )
-- Focus on bracket pairs developers actually use
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000005-0001-0000-0000-000000000000',
    'Bracket Pairs',
    $body$() {} [] <> () {} [] <>
(()) {{}} [[]] <<>> (()) {{}}
({[]}) ({[]}) ({[]}) ({[]})
[] {} () <> [] {} () <> [] {}$body$,
    'drill', 'intermediate', 5, 0
  ),
  (
    '30000005-0002-0000-0000-000000000000',
    'Operators',
    $body$= == === != !== > < >= <=
+ - * / % += -= *= /= %=
&& || ! ?: => -> :: ..
== != > < >= <= && || !=$body$,
    'drill', 'intermediate', 5, 1
  ),
  (
    '30000005-0003-0000-0000-000000000000',
    'Strings and Quotes',
    $body$"hello" 'world' `template`
"key" 'value' `${name}` "ok"
'single' "double" `backtick`
"a" + 'b' + `c` + "d" + 'e'$body$,
    'drill', 'intermediate', 5, 2
  ),
  (
    '30000005-0004-0000-0000-000000000000',
    'Arrow Functions',
    $body$() => {} () => {} () => {}
(a) => a (b) => b (x) => x
(a, b) => a + b (x, y) => x * y
(...args) => args.map(x => x * 2)$body$,
    'drill', 'intermediate', 5, 3
  ),
  (
    '30000005-0005-0000-0000-000000000000',
    'Object and Array Syntax',
    $body${ key: "value" } { id: 1 }
{ name: "test", age: 25 }
[1, 2, 3] ["a", "b", "c"]
[{ id: 1 }, { id: 2 }, { id: 3 }]$body$,
    'drill', 'intermediate', 5, 4
  ),
  (
    '30000005-0006-0000-0000-000000000000',
    'Ternary and Conditionals',
    $body$x > 0 ? "pos" : "neg"
a === b ? true : false
n % 2 === 0 ? "even" : "odd"
val != null ? val : "default"$body$,
    'drill', 'intermediate', 5, 5
  ),
  (
    '30000005-0007-0000-0000-000000000000',
    'Real Symbol Combos',
    $body$if () {} else {} for (;;) {}
fn() => {} fn() => {} fn()
(a, b) => { return a + b; }
[1, 2, 3].map(n => n * 2);$body$,
    'drill', 'intermediate', 5, 6
  ),
  (
    '30000005-0008-0000-0000-000000000000',
    'Symbol Speed',
    $body$const x = (a > b) ? [a] : [b];
let obj = { ...old, key: val };
arr.filter(x => x !== null);
fn({id: 1}, [2, 3], (a) => a);
if (x && y || !z) { return; }
switch (n) { case 1: break; }$body$,
    'drill', 'intermediate', 5, 7
  );


-- ============================================================
-- STAGE 6: Short Real Code (JS / Python, under 10 lines each)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000006-0001-0000-0000-000000000000',
    'Sum Function — JS',
    $body$function sum(a, b) {
    return a + b;
}

const result = sum(3, 7);
console.log(result);$body$,
    'javascript', 'intermediate', 6, 0
  ),
  (
    '30000006-0002-0000-0000-000000000000',
    'Greet — Python',
    $body$def greet(name):
    message = f"Hello, {name}!"
    return message

print(greet("Alice"))
print(greet("Bob"))$body$,
    'python', 'intermediate', 6, 1
  ),
  (
    '30000006-0003-0000-0000-000000000000',
    'Max of Three — JS',
    $body$function max(a, b, c) {
    if (a >= b && a >= c) {
        return a;
    } else if (b >= c) {
        return b;
    }
    return c;
}$body$,
    'javascript', 'intermediate', 6, 2
  ),
  (
    '30000006-0004-0000-0000-000000000000',
    'Sum a List — Python',
    $body$def total(nums):
    result = 0
    for n in nums:
        result += n
    return result

print(total([10, 20, 30]))$body$,
    'python', 'intermediate', 6, 3
  ),
  (
    '30000006-0005-0000-0000-000000000000',
    'Array Filter — JS',
    $body$const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter(n => {
    return n % 2 === 0;
});

console.log(evens);$body$,
    'javascript', 'intermediate', 6, 4
  ),
  (
    '30000006-0006-0000-0000-000000000000',
    'Factorial — Python',
    $body$def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 8):
    print(f"{i}! = {factorial(i)}")$body$,
    'python', 'intermediate', 6, 5
  ),
  (
    '30000006-0007-0000-0000-000000000000',
    'Object Destructuring — JS',
    $body$const user = {
    name: "Alice",
    age: 30,
    role: "admin",
};

const { name, age } = user;
console.log(`${name} is ${age}`);$body$,
    'javascript', 'intermediate', 6, 6
  ),
  (
    '30000006-0008-0000-0000-000000000000',
    'Dictionary Lookup — Python',
    $body$def get_grade(score):
    grades = {
        "A": 90,
        "B": 80,
        "C": 70,
    }
    for grade, min_score in grades.items():
        if score >= min_score:
            return grade
    return "F"$body$,
    'python', 'intermediate', 6, 7
  );


-- ============================================================
-- STAGE 7: Longer Real Code (React, async, classes, 15-25 lines)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '30000007-0001-0000-0000-000000000000',
    'React Counter — JSX',
    $body$import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(prev => prev + 1);
    };

    const reset = () => {
        setCount(0);
    };

    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={increment}>
                +1
            </button>
            <button onClick={reset}>
                Reset
            </button>
        </div>
    );
}$body$,
    'javascript', 'advanced', 7, 0
  ),
  (
    '30000007-0002-0000-0000-000000000000',
    'Async Fetch — JS',
    $body$async function fetchUsers() {
    try {
        const response = await fetch("/api/users");

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error("Fetch failed:", error);
        return [];
    }
}

const users = await fetchUsers();
console.log(users);$body$,
    'javascript', 'advanced', 7, 1
  ),
  (
    '30000007-0003-0000-0000-000000000000',
    'Class — Python',
    $body$class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance

    def __str__(self):
        return f"{self.owner}: ${self.balance:.2f}"$body$,
    'python', 'advanced', 7, 2
  ),
  (
    '30000007-0004-0000-0000-000000000000',
    'Express Route — JS',
    $body$import express from "express";

const app = express();
app.use(express.json());

const todos = [];

app.get("/api/todos", (req, res) => {
    res.json({ todos });
});

app.post("/api/todos", (req, res) => {
    const { title } = req.body;
    const todo = {
        id: todos.length + 1,
        title,
        done: false,
    };
    todos.push(todo);
    res.status(201).json(todo);
});

app.listen(3000);$body$,
    'javascript', 'advanced', 7, 3
  ),
  (
    '30000007-0005-0000-0000-000000000000',
    'Binary Search — Python',
    $body$def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        guess = arr[mid]

        if guess == target:
            return mid
        elif guess < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
index = binary_search(numbers, 23)
print(f"Found at index: {index}")$body$,
    'python', 'advanced', 7, 4
  ),
  (
    '30000007-0006-0000-0000-000000000000',
    'React Todo List — JSX',
    $body$import { useState } from "react";

export default function TodoList() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState("");

    const addItem = () => {
        if (!text.trim()) return;
        setItems(prev => [
            ...prev,
            { id: Date.now(), text, done: false },
        ]);
        setText("");
    };

    const toggle = (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, done: !item.done }
                    : item
            )
        );
    };

    return (
        <div>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button onClick={addItem}>Add</button>
        </div>
    );
}$body$,
    'javascript', 'advanced', 7, 5
  ),
  (
    '30000007-0007-0000-0000-000000000000',
    'Decorator Pattern — Python',
    $body$import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    total = 0
    for i in range(n):
        total += i
    return total

result = slow_sum(1_000_000)
print(f"Sum: {result}")$body$,
    'python', 'advanced', 7, 6
  ),
  (
    '30000007-0008-0000-0000-000000000000',
    'Promise.all — JS',
    $body$async function loadDashboard(userId) {
    const endpoints = [
        `/api/users/${userId}`,
        `/api/users/${userId}/posts`,
        `/api/users/${userId}/stats`,
    ];

    const requests = endpoints.map(url =>
        fetch(url).then(res => {
            if (!res.ok) {
                throw new Error(`Failed: ${url}`);
            }
            return res.json();
        })
    );

    const [user, posts, stats] = await Promise.all(
        requests
    );

    return {
        name: user.name,
        postCount: posts.length,
        totalViews: stats.views,
    };
}$body$,
    'javascript', 'advanced', 7, 7
  );
