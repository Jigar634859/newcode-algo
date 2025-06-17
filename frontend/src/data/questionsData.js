export const questions = [
  {
    id: 1,
    title: "Sum of Two Numbers",
    description: `Given two integers a and b, return the sum of the two integers.\n\nExample 1:\nInput: a = 1, b = 2\nOutput: 3\nExplanation: 1 + 2 = 3\n\nExample 2:\nInput: a = 5, b = 7\nOutput: 12\nExplanation: 5 + 7 = 12\n\nExample 3:\nInput: a = -1, b = 1\nOutput: 0\nExplanation: -1 + 1 = 0\n\nConstraints:\n- -1000 <= a, b <= 1000`,
    difficulty: "Easy",
    testCases: [
      { input: "1\n2\n", expectedOutput: "3\n" },
      { input: "5\n7\n", expectedOutput: "12\n" },
      { input: "-1\n1\n", expectedOutput: "0\n" }
    ],
    starterCode: {
      javascript: "// Write your code here\nfunction add(a, b) {\n  // Your code here\n}\n\n// Read input\nconst a = parseInt(readline());\nconst b = parseInt(readline());\n\n// Print output\nconsole.log(add(a, b));",
      python: "# Write your code here\ndef add(a, b):\n    # Your code here\n    pass\n\n# Read input\na = int(input())\nb = int(input())\n\n# Print output\nprint(add(a, b))",
      cpp: "// Write your code here\n#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    // Your code here\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << add(a, b) << endl;\n    return 0;\n}",
      java: "// Write your code here\nimport java.util.*;\n\npublic class Main {\n    public static int add(int a, int b) {\n        // Your code here\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(add(a, b));\n    }\n}"
    }
  },
  {
    id: 2,
    title: "Find Maximum Number",
    description: `Given three integers a, b, and c, return the maximum of the three numbers.\n\nExample 1:\nInput: a = 1, b = 2, c = 3\nOutput: 3\nExplanation: The maximum of 1, 2, and 3 is 3.\n\nExample 2:\nInput: a = 5, b = 2, c = 1\nOutput: 5\nExplanation: The maximum of 5, 2, and 1 is 5.\n\nExample 3:\nInput: a = 0, b = 0, c = 0\nOutput: 0\nExplanation: The maximum of 0, 0, and 0 is 0.\n\nConstraints:\n- -1000 <= a, b, c <= 1000`,
    difficulty: "Easy",
    testCases: [
      { input: "1\n2\n3\n", expectedOutput: "3\n" },
      { input: "5\n2\n1\n", expectedOutput: "5\n" },
      { input: "0\n0\n0\n", expectedOutput: "0\n" }
    ],
    starterCode: {
      javascript: "// Write your code here\nfunction findMax(a, b, c) {\n  // Your code here\n}\n\n// Read input\nconst a = parseInt(readline());\nconst b = parseInt(readline());\nconst c = parseInt(readline());\n\n// Print output\nconsole.log(findMax(a, b, c));",
      python: "# Write your code here\ndef find_max(a, b, c):\n    # Your code here\n    pass\n\n# Read input\na = int(input())\nb = int(input())\nc = int(input())\n\n# Print output\nprint(find_max(a, b, c))",
      cpp: "// Write your code here\n#include <iostream>\nusing namespace std;\n\nint findMax(int a, int b, int c) {\n    // Your code here\n}\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    cout << findMax(a, b, c) << endl;\n    return 0;\n}",
      java: "// Write your code here\nimport java.util.*;\n\npublic class Main {\n    public static int findMax(int a, int b, int c) {\n        // Your code here\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        System.out.println(findMax(a, b, c));\n    }\n}"
    }
  }
]; 