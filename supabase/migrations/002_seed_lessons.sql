-- ============================================================
-- Seed the lessons table with the 3 hardcoded snippets
-- Run this in the Supabase SQL Editor AFTER 001_create_tables.sql
-- ============================================================

INSERT INTO public.lessons (id, title, snippet_text, language, difficulty, order_index)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'For Loop — C++',
    E'#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        cout << "i = " << i << endl;\n    }\n    return 0;\n}',
    'cpp',
    'beginner',
    0
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Binary Search — C++',
    E'int binarySearch(int arr[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target)\n            return mid;\n        else if (arr[mid] < target)\n            low = mid + 1;\n        else\n            high = mid - 1;\n    }\n    return -1;\n}',
    'cpp',
    'intermediate',
    1
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'FizzBuzz — Python',
    E'def fizzbuzz(n):\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            print("FizzBuzz")\n        elif i % 3 == 0:\n            print("Fizz")\n        elif i % 5 == 0:\n            print("Buzz")\n        else:\n            print(i)',
    'python',
    'beginner',
    2
  )
ON CONFLICT (id) DO NOTHING;
