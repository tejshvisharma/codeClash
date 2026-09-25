
export const getStarterCode = (language) => {
    switch(language.toLowerCase()) {
        case "javascript":
            return `console.log("Hello from JavaScript!");
// Write your code here
`;
        case "python":
            return `print("Hello from Python!")
# Write your code here
`;
        case "java":
            return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
`;
        case "cpp":
            return `#include <iostream>

using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}
`;
        default:
            return "// Start coding here...";
    }
};
