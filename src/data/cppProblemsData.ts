import { CppProblem } from '../types';

export const INITIAL_CPP_PROBLEMS: CppProblem[] = [
  {
    id: 'cpp-prob-1',
    title: 'PRIME: Số nguyên tố đối xứng (Palindromic Prime)',
    difficulty: 'Trung bình',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    statement: `
Cho một số nguyên dương N. Một số được gọi là "Số nguyên tố đối xứng" nếu nó thỏa mãn đồng thời hai điều kiện:
1. N là số nguyên tố (chỉ chia hết cho 1 và chính nó).
2. N đọc từ trái sang phải hay từ phải sang trái đều giống nhau (ví dụ: 11, 101, 131, 929).

Yêu cầu: Viết chương trình kiểm tra xem N có phải là số nguyên tố đối xứng hay không.
    `,
    inputFormat: 'Gồm một dòng duy nhất chứa số nguyên dương N (1 <= N <= 10^7).',
    outputFormat: 'Ghi ra số 1 nếu N là số nguyên tố đối xứng; ngược lại ghi ra số 0.',
    constraints: '1 <= N <= 10^7. Giới hạn thời gian 1.0 giây, bộ nhớ 256MB.',
    starterCode: `#include <iostream>
using namespace std;

// Kiểm tra số nguyên tố
bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

// Kiểm tra số đối xứng
bool isPalindrome(long long n) {
    long long rev = 0, temp = n;
    while (temp > 0) {
        rev = rev * 10 + temp % 10;
        temp /= 10;
    }
    return rev == n;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long n;
    if (cin >> n) {
        if (isPrime(n) && isPalindrome(n)) {
            cout << 1 << "\\n";
        } else {
            cout << 0 << "\\n";
        }
    }
    return 0;
}`,
    standardSolution: `#include <iostream>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

bool isPalindrome(long long n) {
    long long rev = 0, temp = n;
    while (temp > 0) {
        rev = rev * 10 + temp % 10;
        temp /= 10;
    }
    return rev == n;
}

int main() {
    long long n;
    if (cin >> n) {
        cout << (isPrime(n) && isPalindrome(n) ? 1 : 0) << endl;
    }
    return 0;
}`,
    testCases: [
      { id: 1, input: '11', expectedOutput: '1', explanation: '11 là số nguyên tố và đọc ngược lại vẫn là 11', isSample: true },
      { id: 2, input: '13', expectedOutput: '0', explanation: '13 là số nguyên tố nhưng đọc ngược lại là 31 (khác 13)', isSample: true },
      { id: 3, input: '101', expectedOutput: '1', explanation: '101 vừa nguyên tố vừa đối xứng', isSample: false },
      { id: 4, input: '2', expectedOutput: '1', explanation: 'Test biên nhỏ nhất: 2 là số nguyên tố chẵn duy nhất và đối xứng', isSample: false },
      { id: 5, input: '9999999', expectedOutput: '0', explanation: 'Test cận trên N = 10^7, chia hết cho 3 và 9', isSample: false },
      { id: 6, input: '929', expectedOutput: '1', explanation: '929 là số nguyên tố đối xứng', isSample: false }
    ]
  },
  {
    id: 'cpp-prob-2',
    title: 'LIS: Dãy con tăng dài nhất (Longest Increasing Subsequence)',
    difficulty: 'Nâng cao',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    statement: `
Cho một dãy gồm N số nguyên A1, A2, ..., AN. Hãy tìm độ dài của dãy con tăng nghiêm ngặt dài nhất.
Một dãy con là dãy thu được bằng cách xóa đi một số phần tử (hoặc không xóa phần tử nào) và giữ nguyên thứ tự các phần tử còn lại.
    `,
    inputFormat: 'Dòng 1 chứa số nguyên N (1 <= N <= 1000). Dòng 2 chứa N số nguyên A1, A2, ..., AN.',
    outputFormat: 'Ghi ra một số nguyên duy nhất là độ dài dãy con tăng dài nhất tìm được.',
    constraints: '1 <= N <= 1000, 1 <= Ai <= 10^5.',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // Thuật toán Quy hoạch động O(N^2)
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        ans = max(ans, dp[i]);
    }
    cout << ans << "\\n";
    return 0;
}`,
    standardSolution: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }
    cout << ans << endl;
    return 0;
}`,
    testCases: [
      { id: 1, input: '6\n1 2 5 3 4 6', expectedOutput: '5', explanation: 'Dãy con tăng dài nhất: 1, 2, 3, 4, 6 (độ dài 5)', isSample: true },
      { id: 2, input: '5\n5 4 3 2 1', expectedOutput: '1', explanation: 'Dãy giảm dần nên độ dài dài nhất là 1', isSample: true },
      { id: 3, input: '8\n10 22 9 33 21 50 41 60', expectedOutput: '5', explanation: 'Dãy con: 10, 22, 33, 50, 60 hoặc 10, 22, 33, 41, 60', isSample: false },
      { id: 4, input: '1\n42', expectedOutput: '1', explanation: 'Test biên N = 1', isSample: false }
    ]
  },
  {
    id: 'cpp-prob-3',
    title: 'ROBOT: Robot thu thập điểm trên lưới (HSG Cấp Tỉnh)',
    difficulty: 'HSG Cấp Tỉnh',
    timeLimit: '1.0s',
    memoryLimit: '256MB',
    statement: `
Một chú Robot xuất phát từ ô trên cùng bên trái (1, 1) của bảng lưới kích thước M x N ô.
Tại mỗi bước, Robot chỉ có thể di chuyển sang phải (ô lân cận bên phải) hoặc đi xuống dưới (ô lân cận bên dưới).
Mỗi ô (i, j) có một số điểm thưởng A[i][j]. Khi đi qua ô nào, Robot sẽ thu nhận số điểm tại ô đó.
Hãy tìm lộ trình để khi Robot đến ô đích (M, N) thì tổng số điểm thu được là lớn nhất.
    `,
    inputFormat: 'Dòng đầu chứa 2 số nguyên M và N. M dòng tiếp theo, mỗi dòng chứa N số nguyên A[i][j].',
    outputFormat: 'Ghi ra số nguyên duy nhất là tổng điểm lớn nhất có thể thu được.',
    constraints: '1 <= M, N <= 100, 0 <= A[i][j] <= 1000.',
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> a(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }

    vector<vector<long long>> dp(m, vector<long long>(n, 0));
    dp[0][0] = a[0][0];

    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + a[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + a[i][0];

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + a[i][j];
        }
    }

    cout << dp[m-1][n-1] << "\\n";
    return 0;
}`,
    standardSolution: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> a(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) cin >> a[i][j];
    vector<vector<long long>> dp(m, vector<long long>(n, 0));
    dp[0][0] = a[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + a[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + a[i][0];
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + a[i][j];
        }
    }
    cout << dp[m-1][n-1] << endl;
    return 0;
}`,
    testCases: [
      { id: 1, input: '3 3\n1 3 1\n1 5 1\n4 2 1', expectedOutput: '12', explanation: 'Đường đi tối ưu: 1 -> 3 -> 5 -> 2 -> 1 = 12', isSample: true },
      { id: 2, input: '2 2\n5 10\n1 2', expectedOutput: '17', explanation: 'Đường đi: 5 -> 10 -> 2 = 17', isSample: true },
      { id: 3, input: '1 4\n2 4 6 8', expectedOutput: '20', explanation: 'Lưới 1 hàng: 2 + 4 + 6 + 8 = 20', isSample: false }
    ]
  }
];
