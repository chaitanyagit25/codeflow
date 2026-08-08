-- ============================================================
-- CodeFlow — Full 7-Stage Lesson Curriculum
-- Run AFTER 003_add_stage_column.sql
-- Replaces ALL existing lesson data with a progressive curriculum
-- ============================================================

-- Clear existing data (CASCADE removes associated progress rows)
TRUNCATE public.lessons CASCADE;


-- ============================================================
-- STAGE 1: Home Row Only  (a s d f g h j k l ;)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000001-0001-0000-0000-000000000000',
    'Home Row Basics',
    $body$ff jj dd kk ss ll aa ;; ff jj
dd kk ss ll aa ;; ff jj dd kk
ss ll aa ;; ff jj dd kk ss ll
aa ;; ff jj dd kk ss ll aa ;;$body$,
    'drill', 'beginner', 1, 0
  ),
  (
    '20000001-0002-0000-0000-000000000000',
    'Finger Pairs',
    $body$fj fj dk dk sl sl a; a; fj dk
sl a; fj dk sl a; fj dk sl a;
a; sl dk fj a; sl dk fj a; sl
fj dk sl a; a; sl dk fj fj dk$body$,
    'drill', 'beginner', 1, 1
  ),
  (
    '20000001-0003-0000-0000-000000000000',
    'Center Reach — G and H',
    $body$fg fg fg hj hj hj fg hj fg hj
fgf hjh fgf hjh dkg sla hjf gdk
fghj fghj dksl a;gh dksl fghj
ghfj ghfj sla; ghdk sla; ghfj$body$,
    'drill', 'beginner', 1, 2
  ),
  (
    '20000001-0004-0000-0000-000000000000',
    'Mixed Sequences',
    $body$asdf jkl; asdf jkl; asdf jkl;
;lkj fdsa ;lkj fdsa ;lkj fdsa
asdf ;lkj fdsa jkl; asdf ;lkj
jkl; fdsa ;lkj asdf jkl; fdsa$body$,
    'drill', 'beginner', 1, 3
  ),
  (
    '20000001-0005-0000-0000-000000000000',
    'Alternating Hands',
    $body$aj sk dl f; gh aj sk dl f;
ja ks ld ;f hg ja ks ld ;f
ajsk dlf; ghja ksdl ;fgh aj
f;dl skaj ghf; dlsk jaaj sk$body$,
    'drill', 'beginner', 1, 4
  ),
  (
    '20000001-0006-0000-0000-000000000000',
    'Home Row Speed',
    $body$fj dk sl a; gh fj dk sl a; gh
a;sldkfj ghfjdksla; fjdksla;
fjdksla; ghfjdk sla;gh fjdk
a;gh fjdk sla; gh fjdksl a;gh$body$,
    'drill', 'beginner', 1, 5
  );


-- ============================================================
-- STAGE 2: Home + Top Row  (adds q w e r t y u i o p)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000002-0001-0000-0000-000000000000',
    'Top Row Intro',
    $body$qq ww ee rr tt yy uu ii oo pp
qw er ty ui op qw er ty ui op
po iu yt re wq po iu yt re wq
qwer tyui op po iuyt rewq op$body$,
    'drill', 'beginner', 2, 0
  ),
  (
    '20000002-0002-0000-0000-000000000000',
    'Home-to-Top Reach',
    $body$aq sw de fr gt hy ju ki lo ;p
aq sw de fr gt hy ju ki lo ;p
p; ol ki ju yh tg rf ed ws qa
qa ws ed rf tg yh ju ki ol p;$body$,
    'drill', 'beginner', 2, 1
  ),
  (
    '20000002-0003-0000-0000-000000000000',
    'Finger Columns',
    $body$aqa sws ded frf ftf jyj juj kik lol ;p;
;p; lol kik juj jyj ftf frf ded sws aqa
aqa sws ded frf ftf jyj juj kik lol ;p;
;p; lol kik juj jyj ftf frf ded sws aqa$body$,
    'drill', 'beginner', 2, 2
  ),
  (
    '20000002-0004-0000-0000-000000000000',
    'Row Alternating',
    $body$af sf df rf tf uj ij kj oj pj
aq sw de fr gt hy ju ki lo ;p
qas wsd edf rfg tgh yhj uji iko olp
plokijuhygtfrdeswqa plokijuhyg$body$,
    'drill', 'beginner', 2, 3
  ),
  (
    '20000002-0005-0000-0000-000000000000',
    'Top Row Combos',
    $body$qwer tyui op qwer tyui op qwer
poiu ytre wq poiu ytre wq poiu
qwerty uiop poiuyt rewq qwerty
uiop rewq tyui asdf jkl; qwer$body$,
    'drill', 'beginner', 2, 4
  ),
  (
    '20000002-0006-0000-0000-000000000000',
    'Two Row Speed',
    $body$frf juj ded kik sws lol aqa ;p;
ftf jyj fgf jhj frf juj ded kik
qsa wsd edf rtg tgh yhj uji olp
frf juj sws kik aqa ;p; ftf jyj$body$,
    'drill', 'beginner', 2, 5
  );


-- ============================================================
-- STAGE 3: Home + Bottom Row  (adds z x c v b n m , .)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000003-0001-0000-0000-000000000000',
    'Bottom Row Intro',
    $body$zz xx cc vv bb nn mm ,, .. zz
zx cv bn m, m. zx cv bn m, m.
., mn bv cx zx ., mn bv cx zx
zxcv bnm,. .,mnb vcxz zxcv bn$body$,
    'drill', 'beginner', 3, 0
  ),
  (
    '20000003-0002-0000-0000-000000000000',
    'Home-to-Bottom Reach',
    $body$az sx dc fv fb jn jm k, l. az
az sx dc fv fb jn jm k, l. az
.l ,k mj nj bf vf cd xs za .l
za xs cd vf bf nj mj k, l. za$body$,
    'drill', 'beginner', 3, 1
  ),
  (
    '20000003-0003-0000-0000-000000000000',
    'Finger Columns — Bottom',
    $body$aza sxs dcd fvf fbf jnj jmj k,k l.l
l.l k,k jmj jnj fbf fvf dcd sxs aza
aza sxs dcd fvf fbf jnj jmj k,k l.l
l.l k,k jmj jnj fbf fvf dcd sxs aza$body$,
    'drill', 'beginner', 3, 2
  ),
  (
    '20000003-0004-0000-0000-000000000000',
    'Bottom Combos',
    $body$zxcv bnm, zxcv bnm, zxcv bnm,
.,mn bvcx z .,mn bvcx z .,mn bv
zxcv bnm,. .,mnb vcxz zxcv bnm
mn bv cx zx ., mn bv cx zx .,m$body$,
    'drill', 'beginner', 3, 3
  ),
  (
    '20000003-0005-0000-0000-000000000000',
    'Cross-Row Patterns',
    $body$fvf njn dck k,k sxs l.l azg hbj
azg hbj fvd slx knm ., fvdc sx
fvdc sxza jnmk l.,; fvdc sxza
hbjn azgk fvsl dck, sxl. aza;$body$,
    'drill', 'beginner', 3, 4
  ),
  (
    '20000003-0006-0000-0000-000000000000',
    'All Three Rows',
    $body$aqz swe drc fvt gbh ynj umj ik, ol.
zqa exs drc fvt gbh ynj umj ik, ol.
.lo ,ki jmu jny hbg tvf crd wes zqa
aqz swe drc fvt gbh ynj umj ik, ol.$body$,
    'drill', 'beginner', 3, 5
  );


-- ============================================================
-- STAGE 4: Numbers Row  (1 2 3 4 5 6 7 8 9 0)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000004-0001-0000-0000-000000000000',
    'Number Basics',
    $body$11 22 33 44 55 66 77 88 99 00
12 34 56 78 90 12 34 56 78 90
09 87 65 43 21 09 87 65 43 21
10 20 30 40 50 60 70 80 90 00$body$,
    'drill', 'intermediate', 4, 0
  ),
  (
    '20000004-0002-0000-0000-000000000000',
    'Number Sequences',
    $body$123 456 789 012 345 678 901
987 654 321 098 765 432 109
135 246 357 468 579 680 791
111 222 333 444 555 666 777$body$,
    'drill', 'intermediate', 4, 1
  ),
  (
    '20000004-0003-0000-0000-000000000000',
    'Numbers with Letters',
    $body$a1 s2 d3 f4 f5 j6 j7 k8 l9 ;0
1a 2s 3d 4f 5f 6j 7j 8k 9l 0;
f4r d3e s2w a1q j7u j6y k8i l9o
q1a w2s e3d r4f t5f y6j u7j i8k$body$,
    'drill', 'intermediate', 4, 2
  ),
  (
    '20000004-0004-0000-0000-000000000000',
    'Mixed Digit Patterns',
    $body$100 200 300 400 500 600 700 800
1234567890 0987654321 1234567890
10 20 30 40 50 60 70 80 90 100
255 128 064 032 016 008 004 002$body$,
    'drill', 'intermediate', 4, 3
  ),
  (
    '20000004-0005-0000-0000-000000000000',
    'Common Dev Numbers',
    $body$255 1024 4096 8080 3000 443
192 168 127 001 255 080 022
1920 1080 1440 2560 3840 7680
8888 9999 3306 5432 6379 2181$body$,
    'drill', 'intermediate', 4, 4
  ),
  (
    '20000004-0006-0000-0000-000000000000',
    'Number Speed',
    $body$42 17 83 96 50 24 71 38 69 05
192 837 465 019 283 746 501 928
3141 5926 5358 9793 2384 6264
1001 2002 3003 4004 5005 6006$body$,
    'drill', 'intermediate', 4, 5
  );


-- ============================================================
-- STAGE 5: Common Dev Symbols  ( () {} [] ; : = > < etc. )
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000005-0001-0000-0000-000000000000',
    'Brackets Drill',
    $body$() {} [] <> () {} [] <>
(()) {{}} [[]] <<>> (()) {{}}
({[]}) ({[]}) ({[]}) ({[]})
[] {} () <> [] {} () <> [] {}$body$,
    'drill', 'intermediate', 5, 0
  ),
  (
    '20000005-0002-0000-0000-000000000000',
    'Operators',
    $body$= == === != !== > < >= <=
+ - * / % += -= *= /= %=
&& || ! ?: => -> :: ..
== != > < >= <= && || !=$body$,
    'drill', 'intermediate', 5, 1
  ),
  (
    '20000005-0003-0000-0000-000000000000',
    'Strings and Quotes',
    $body$"" '' `` "" '' `` "" '' ``
'a' "b" `c` 'a' "b" `c`
"hello" 'world' `test` "ok"
"key" 'val' "name" 'type' `id`$body$,
    'drill', 'intermediate', 5, 2
  ),
  (
    '20000005-0004-0000-0000-000000000000',
    'Code Symbol Patterns',
    $body$(); {}; []; (); {}; [];
=> => -> -> :: :: .. ..
@attr #id %mod &ref *ptr
$var @dec #tag %fmt &val *fn$body$,
    'drill', 'intermediate', 5, 3
  ),
  (
    '20000005-0005-0000-0000-000000000000',
    'Real Symbol Combos',
    $body$if () {} else {} for (;;) {}
fn() => {} fn() => {} fn()
(a, b) => { return a + b; }
[1, 2, 3].map(n => n * 2);$body$,
    'drill', 'intermediate', 5, 4
  ),
  (
    '20000005-0006-0000-0000-000000000000',
    'Symbol Speed',
    $body$!@#$%^&*() !@#$%^&*()
{}[]();:'" {}[]();:'"
<>/\|?-_=+ <>/\|?-_=+
~`!@#$%^&*()-_=+[]{}\|$body$,
    'drill', 'intermediate', 5, 5
  );


-- ============================================================
-- STAGE 6: Short Code Snippets  (JS / Python)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000006-0001-0000-0000-000000000000',
    'Add Function — JS',
    $body$function add(a, b) {
    return a + b;
}$body$,
    'javascript', 'intermediate', 6, 0
  ),
  (
    '20000006-0002-0000-0000-000000000000',
    'Greet — Python',
    $body$def greet(name):
    return "Hello, " + name$body$,
    'python', 'intermediate', 6, 1
  ),
  (
    '20000006-0003-0000-0000-000000000000',
    'Max of Two — JS',
    $body$function max(a, b) {
    if (a > b) {
        return a;
    }
    return b;
}$body$,
    'javascript', 'intermediate', 6, 2
  ),
  (
    '20000006-0004-0000-0000-000000000000',
    'Sum List — Python',
    $body$def total(nums):
    result = 0
    for n in nums:
        result += n
    return result$body$,
    'python', 'intermediate', 6, 3
  ),
  (
    '20000006-0005-0000-0000-000000000000',
    'Is Even — JS',
    $body$const isEven = (n) => {
    return n % 2 === 0;
};$body$,
    'javascript', 'intermediate', 6, 4
  ),
  (
    '20000006-0006-0000-0000-000000000000',
    'Factorial — Python',
    $body$def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)$body$,
    'python', 'intermediate', 6, 5
  ),
  (
    '20000006-0007-0000-0000-000000000000',
    'Swap Elements — JS',
    $body$function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}$body$,
    'javascript', 'intermediate', 6, 6
  );


-- ============================================================
-- STAGE 7: Longer Code Snippets  (React, C++, Python, JS)
-- ============================================================
INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, stage, order_index)
VALUES
  (
    '20000007-0001-0000-0000-000000000000',
    'For Loop — C++',
    $body$#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 10; i++) {
        cout << "i = " << i << endl;
    }
    return 0;
}$body$,
    'cpp', 'advanced', 7, 0
  ),
  (
    '20000007-0002-0000-0000-000000000000',
    'Binary Search — C++',
    $body$int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}$body$,
    'cpp', 'advanced', 7, 1
  ),
  (
    '20000007-0003-0000-0000-000000000000',
    'FizzBuzz — Python',
    $body$def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)$body$,
    'python', 'advanced', 7, 2
  ),
  (
    '20000007-0004-0000-0000-000000000000',
    'React Counter — JSX',
    $body$import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}$body$,
    'javascript', 'advanced', 7, 3
  ),
  (
    '20000007-0005-0000-0000-000000000000',
    'Array Filter Map — JS',
    $body$function getActiveUserNames(users) {
    return users
        .filter(user => user.isActive)
        .map(user => user.name)
        .sort();
}$body$,
    'javascript', 'advanced', 7, 4
  ),
  (
    '20000007-0006-0000-0000-000000000000',
    'Linked List — Python',
    $body$class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def to_list(self):
        result = []
        node = self
        while node:
            result.append(node.val)
            node = node.next
        return result$body$,
    'python', 'advanced', 7, 5
  ),
  (
    '20000007-0007-0000-0000-000000000000',
    'Async Fetch — JS',
    $body$async function fetchUsers() {
    try {
        const response = await fetch("/api/users");
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}$body$,
    'javascript', 'advanced', 7, 6
  );
