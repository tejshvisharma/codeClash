// Starter code templates for each supported language
export const starterCodeTemplates = {
  javascript: `// JavaScript Starter Code (Node.js)

// Input Format Example:
// Line 1: n (integer)
// Line 2: n space-separated integers

const input = require('fs').readFileSync(0, 'utf8').trim().split('\\n');

const n = parseInt(input[0]);  // Read array size
const arr = input[1].split(' ').map(Number);  // Read elements

// Process and output
console.log(\`Array size: \${n}\`);
console.log(\`Elements: \${arr.join(' ')}\`);`,

  python: `# Python Starter Code

# Input Format Example:
# Line 1: n (integer)
# Line 2: n space-separated integers

n = int(input())  # Read array size
arr = list(map(int, input().split()))  # Read elements

# Process and output
print(f"Array size: {n}")
print(f"Elements: {' '.join(map(str, arr))}")`,

  java: `// Java Starter Code
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Input Format Example:
        // Line 1: n (integer)
        // Line 2: n space-separated integers
        
        Scanner sc = new Scanner(System.in);
        
        int n = sc.nextInt();  // Read array size
        int[] arr = new int[n];
        
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();  // Read elements
        }
        
        // Process and output
        System.out.println("Array size: " + n);
        System.out.print("Elements: ");
        for(int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
        
        sc.close();
    }
}`,

  cpp: `// C++ Starter Code
#include <iostream>
using namespace std;

int main() {
    // Input Format Example:
    // Line 1: n (integer)
    // Line 2: n space-separated integers
    
    int n;
    cin >> n;  // Read array size
    
    int arr[n];
    for(int i = 0; i < n; i++) {
        cin >> arr[i];  // Read elements
    }
    
    // Process and output
    cout << "Array size: " << n << endl;
    cout << "Elements: ";
    for(int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    return 0;
}`,

  c: `// C Starter Code
#include <stdio.h>

int main() {
    // Input Format Example:
    // Line 1: n (integer)
    // Line 2: n space-separated integers
    
    int n;
    scanf("%d", &n);  // Read array size
    
    int arr[n];
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);  // Read elements
    }
    
    // Process and output
    printf("Array size: %d\\n", n);
    printf("Elements: ");
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    return 0;
}`,
};

// Get starter code for a specific language
export const getStarterCode = (language) => {
  return (
    starterCodeTemplates[language.toLowerCase()] ||
    starterCodeTemplates.javascript
  );
};
