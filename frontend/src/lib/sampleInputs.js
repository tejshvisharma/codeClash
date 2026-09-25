// Sample inputs and code examples for each language
export const sampleInputsByLanguage = {
  cpp: {
    basicArray: {
      name: "Basic Array",
      description: "Simple array input/output",
      input: `5
10 20 30 40 50`,
      code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n];
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    cout << "Array: ";
    for(int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    return 0;
}`,
    },
    sumArray: {
      name: "Sum of Array",
      description: "Calculate sum of array elements",
      input: `5
10 20 30 40 50`,
      code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    int arr[n], sum = 0;
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
        sum += arr[i];
    }
    
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,
    },
    matrix: {
      name: "2D Matrix",
      description: "Read and print a matrix",
      input: `3 3
1 2 3
4 5 6
7 8 9`,
      code: `#include <iostream>
using namespace std;

int main() {
    int rows, cols;
    cin >> rows >> cols;
    
    int matrix[rows][cols];
    
    // Read matrix
    for(int i = 0; i < rows; i++) {
        for(int j = 0; j < cols; j++) {
            cin >> matrix[i][j];
        }
    }
    
    // Print matrix
    cout << "Matrix:" << endl;
    for(int i = 0; i < rows; i++) {
        for(int j = 0; j < cols; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}`,
    },
    multipleInputs: {
      name: "Multiple Inputs",
      description: "Read multiple values on same line",
      input: `3
5 10
Alice`,
      code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    int a, b;
    string name;
    
    cin >> age;
    cin >> a >> b;
    cin >> name;
    
    cout << "Age: " << age << endl;
    cout << "Sum: " << (a + b) << endl;
    cout << "Name: " << name << endl;
    
    return 0;
}`,
    },
  },

  c: {
    basicArray: {
      name: "Basic Array",
      description: "Simple array input/output",
      input: `5
10 20 30 40 50`,
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int arr[n];
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("Array: ");
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    return 0;
}`,
    },
    sumArray: {
      name: "Sum of Array",
      description: "Calculate sum of array elements",
      input: `5
10 20 30 40 50`,
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    
    int arr[n], sum = 0;
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }
    
    printf("Sum: %d\\n", sum);
    
    return 0;
}`,
    },
    stringInput: {
      name: "String Input",
      description: "Read and print strings",
      input: `Hello
World`,
      code: `#include <stdio.h>

int main() {
    char str1[100], str2[100];
    
    scanf("%s", str1);
    scanf("%s", str2);
    
    printf("First: %s\\n", str1);
    printf("Second: %s\\n", str2);
    
    return 0;
}`,
    },
  },

  java: {
    basicArray: {
      name: "Basic Array",
      description: "Simple array input/output",
      input: `5
10 20 30 40 50`,
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        int[] arr = new int[n];
        
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.print("Array: ");
        for(int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
        
        sc.close();
    }
}`,
    },
    sumArray: {
      name: "Sum of Array",
      description: "Calculate sum of array elements",
      input: `5
10 20 30 40 50`,
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        int sum = 0;
        
        for(int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        
        System.out.println("Sum: " + sum);
        
        sc.close();
    }
}`,
    },
    stringInput: {
      name: "String Input",
      description: "Read and concatenate strings",
      input: `2
Hello
World`,
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();
        sc.nextLine(); // Consume newline
        
        String[] words = new String[n];
        for(int i = 0; i < n; i++) {
            words[i] = sc.nextLine();
        }
        
        System.out.println("Words: " + String.join(" ", words));
        
        sc.close();
    }
}`,
    },
  },

  python: {
    basicArray: {
      name: "Basic Array",
      description: "Simple array input/output",
      input: `5
10 20 30 40 50`,
      code: `n = int(input())
arr = list(map(int, input().split()))

print(f"Array: {' '.join(map(str, arr))}")`,
    },
    sumArray: {
      name: "Sum of Array",
      description: "Calculate sum of array elements",
      input: `5
10 20 30 40 50`,
      code: `n = int(input())
arr = list(map(int, input().split()))

total = sum(arr)
print(f"Sum: {total}")`,
    },
    multipleLines: {
      name: "Multiple Lines",
      description: "Read multiple text lines",
      input: `3
Hello
World
Python`,
      code: `n = int(input())
lines = []

for i in range(n):
    lines.append(input())

print("Lines:")
for line in lines:
    print(f"  {line}")`,
    },
    multipleValues: {
      name: "Multiple Values",
      description: "Read multiple values at once",
      input: `5 10
Alice 25`,
      code: `a, b = map(int, input().split())
name, age = input().split()

print(f"Sum: {a + b}")
print(f"Name: {name}, Age: {age}")`,
    },
  },

  javascript: {
    basicArray: {
      name: "Basic Array",
      description: "Simple array input/output",
      input: `5
10 20 30 40 50`,
      code: `const input = require('fs').readFileSync(0, 'utf8').trim().split('\\n');

const n = parseInt(input[0]);
const arr = input[1].split(' ').map(Number);

console.log(\`Array: \${arr.join(' ')}\`);`,
    },
    sumArray: {
      name: "Sum of Array",
      description: "Calculate sum of array elements",
      input: `5
10 20 30 40 50`,
      code: `const input = require('fs').readFileSync(0, 'utf8').trim().split('\\n');

const n = parseInt(input[0]);
const arr = input[1].split(' ').map(Number);

const sum = arr.reduce((a, b) => a + b, 0);
console.log(\`Sum: \${sum}\`);`,
    },
    multipleLines: {
      name: "Multiple Lines",
      description: "Read multiple text lines",
      input: `3
Hello
World
JavaScript`,
      code: `const input = require('fs').readFileSync(0, 'utf8').trim().split('\\n');

const n = parseInt(input[0]);
const lines = input.slice(1, n + 1);

console.log("Lines:");
lines.forEach(line => console.log(\`  \${line}\`));`,
    },
  },
};

// Get samples for a specific language
export const getSamplesForLanguage = (language) => {
  return sampleInputsByLanguage[language.toLowerCase()] || {};
};
