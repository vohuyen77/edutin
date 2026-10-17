import { LessonMaterial } from '../types';
import { DEFAULT_RUBRIC_GUIDE } from '../utils/excelHelper';

export const ALL_SUPPORTED_FORMATS = [
  '.cpp',
  '.pdf',
  '.xlsx',
  '.excel',
  '.docx',
  '.doc',
  '.ppt',
  '.pptx',
  '.sb3',
  '.zip'
];

export const CURRICULUM_DATA: LessonMaterial[] = [
  // ==========================================
  // KHỐI 6
  // ==========================================
  {
    id: 'tin6-bai1',
    gradeLevel: 6,
    chapter: 'Chủ đề A: Máy tính và cộng đồng',
    title: 'Bài 1: Thông tin và Thu nhận dữ liệu trong thời đại số',
    description: 'Phân biệt thông tin và dữ liệu, cách con người và máy tính thu nhận, xử lý, lưu trữ và truyền đạt thông tin.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Thông tin và Dữ liệu
- **Dữ liệu (Data):** Là các số, văn bản, hình ảnh, âm thanh,... được lưu trữ trong máy tính.
- **Thông tin (Information):** Là những hiểu biết của con người về thế giới xung quanh sau khi tiếp nhận và xử lý dữ liệu.
- **Vật mang tin:** Là vật chứa hoặc lưu trữ dữ liệu (sách vở, thẻ nhớ, ổ cứng, USB, đĩa quang).

### 2. Tầm quan trọng của thông tin
- Thông tin đúng lúc, chính xác giúp con người đưa ra quyết định đúng đắn.
- Ví dụ: Dự báo thời tiết giúp nông dân chuẩn bị thu hoạch, học sinh mang theo áo mưa.

### 3. Quy trình xử lý thông tin trong máy tính
1. **Thu nhận thông tin (Input):** Bàn phím, chuột, máy quét, micro, camera.
2. **Xử lý thông tin (Processing):** Bộ vi xử lý (CPU) tính toán và điều khiển.
3. **Lưu trữ thông tin (Storage):** Bộ nhớ trong (RAM, ROM), bộ nhớ ngoài (SSD, HDD).
4. **Xuất thông tin (Output):** Màn hình, máy in, loa.
    `,
    practiceType: 'quiz',
    quizQuestions: [
      {
        id: 1,
        question: 'Dữ liệu trong máy tính có thể ở dạng nào sau đây?',
        options: ['Chỉ ở dạng văn bản', 'Chỉ ở dạng số', 'Văn bản, chữ số, hình ảnh và âm thanh', 'Chỉ ở dạng hình ảnh'],
        correctIndex: 2,
        explanation: 'Máy tính xử lý dữ liệu đa phương tiện gồm văn bản, số liệu, hình ảnh, âm thanh và video được mã hóa dưới dạng dãy bit 0 và 1.'
      },
      {
        id: 2,
        question: 'Thiết bị nào sau đây đóng vai trò là "vật mang tin"?',
        options: ['Bộ nhớ USB', 'Bàn phím máy tính', 'Màn hình hiển thị', 'Con chuột không dây'],
        correctIndex: 0,
        explanation: 'USB, thẻ nhớ, ổ đĩa cứng là các vật mang tin dùng để lưu trữ dữ liệu lâu dài.'
      },
      {
        id: 3,
        question: 'Bộ phận nào của máy tính thực hiện chức năng xử lý thông tin chính?',
        options: ['Màn hình (Monitor)', 'Bộ vi xử lý (CPU)', 'Bàn phím (Keyboard)', 'Chuột (Mouse)'],
        correctIndex: 1,
        explanation: 'CPU (Central Processing Unit) được xem là bộ não của máy tính, đảm nhiệm xử lý mọi dữ liệu và điều khiển các thiết bị khác.'
      }
    ],
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Tạo sơ đồ tư duy tóm tắt 4 bước xử lý thông tin của máy tính. Chấp nhận nộp tệp Word (.docx/.doc), PowerPoint (.pptx/.ppt), bảng tính (.xlsx/.excel), sơ đồ PDF hoặc mã nguồn C++/Scratch/ZIP dự án.',
    dueDate: '2026-10-25',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },
  {
    id: 'tin6-bai2',
    gradeLevel: 6,
    chapter: 'Chủ đề B: Mạng máy tính và Internet',
    title: 'Bài 2: Mạng máy tính và Khái niệm Internet',
    description: 'Tìm hiểu mạng máy tính là gì, lợi ích của việc kết nối mạng và các thành phần chính của mạng không dây/có dây.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Khái niệm Mạng máy tính
- Mạng máy tính là một tập hợp các máy tính và thiết bị được kết nối với nhau để truyền thông tin và chia sẻ tài nguyên (máy in, tệp tin).

### 2. Các thành phần chính của mạng
- **Thiết bị đầu cuối:** Máy tính để bàn, laptop, điện thoại thông minh, máy in mạng.
- **Thiết bị kết nối:** Cáp mạng, bộ chuyển mạch (Switch), bộ định tuyến không dây (Wi-Fi Router).
- **Phần mềm mạng:** Hệ điều hành mạng, trình duyệt web, giao thức mạng.

### 3. Lợi ích của mạng Internet
- Chia sẻ tài nguyên phần cứng và dữ liệu.
- Trao đổi thông tin tức thời qua email, chat, gọi video.
- Học tập trực tuyến, tra cứu kho tàng kiến thức nhân loại.
    `,
    practiceType: 'office',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Viết bài thu hoạch phân tích 3 lợi ích và 2 nguy cơ tiềm ẩn khi học sinh THCS sử dụng Internet. Hỗ trợ nộp qua Word (.docx, .doc), PowerPoint (.pptx, .ppt), PDF (.pdf), hoặc tệp nén dự án (.zip).',
    dueDate: '2026-10-28',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },

  // ==========================================
  // KHỐI 7
  // ==========================================
  {
    id: 'tin7-bai1',
    gradeLevel: 7,
    chapter: 'Chủ đề E: Ứng dụng tin học',
    title: 'Bài 1: Giới thiệu Bảng tính điện tử Microsoft Excel',
    description: 'Làm quen với giao diện bảng tính, hàng, cột, ô tính và cách nhập dữ liệu số liệu, văn bản.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Giao diện trang tính Excel
- **Hàng (Row):** Đánh số từ 1, 2, 3...
- **Cột (Column):** Ký hiệu bằng chữ cái A, B, C...
- **Ô tính (Cell):** Giao nhau giữa một cột và một hàng, ví dụ: \`B4\`, \`C10\`.
- **Khối ô (Range):** Tập hợp các ô liền kề, ví dụ: \`A1:D10\`.

### 2. Nhập và định dạng dữ liệu
- Dữ liệu ký tự: Tự động căn lề trái.
- Dữ liệu số, ngày tháng: Tự động căn lề phải.
- Định dạng kẻ viền khung (Borders), màu nền (Fill color) và in đậm tiêu đề (Bold).
    `,
    practiceType: 'office',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Tạo bảng tính "Bảng điểm tổng kết học kỳ 1 lớp 7A" gồm ít nhất 5 học sinh và 4 môn học, căn lề và kẻ bảng đẹp mắt. Chấp nhận tệp .xlsx, .excel, .pdf, .docx, .zip.',
    dueDate: '2026-10-22',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },
  {
    id: 'tin7-bai2',
    gradeLevel: 7,
    chapter: 'Chủ đề E: Ứng dụng tin học',
    title: 'Bài 2: Tính toán tự động với các hàm SUM, AVERAGE, MAX, MIN, IF',
    description: 'Sử dụng công thức và các hàm cơ bản trong Excel để tự động hóa xử lý số liệu học sinh và báo cáo tài chính gia đình.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Cú pháp các hàm thống kê cơ bản
- \`=SUM(A1:A10)\`: Tính tổng các giá trị trong khối ô.
- \`=AVERAGE(B2:B20)\`: Tính trung bình cộng các giá trị.
- \`=MAX(C1:C30)\` và \`=MIN(C1:C30)\`: Tìm giá trị lớn nhất và nhỏ nhất.

### 2. Hàm điều kiện IF
- Cú pháp: \`=IF(điều_kiện, giá_trị_nếu_đúng, giá_trị_nếu_sai)\`
- Ví dụ xét học lực: \`=IF(E2 >= 8.0, "Giỏi", IF(E2 >= 6.5, "Khá", "Đạt"))\`
    `,
    practiceType: 'office',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Hoàn thiện công thức tính Điểm Trung Bình, xếp loại học lực bằng hàm IF, và tìm điểm cao nhất bằng hàm MAX. Hỗ trợ tệp .xlsx, .excel, .pptx, .docx, .zip.',
    dueDate: '2026-10-26',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },

  // ==========================================
  // KHỐI 8
  // ==========================================
  {
    id: 'tin8-bai1',
    gradeLevel: 8,
    chapter: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    title: 'Bài 1: Làm quen với Môi trường lập trình trực quan Scratch 3.0',
    description: 'Hiểu khái niệm nhân vật (Sprite), sân khấu (Stage), tọa độ (X, Y) và các khối lệnh điều khiển cơ bản.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Giao diện Scratch 3.0
- **Khu vực khối lệnh (Block Palette):** Chuyển động (Motion), Hiển thị (Looks), Âm thanh (Sound), Sự kiện (Events), Điều khiển (Control), Cảm biến (Sensing), Các phép toán (Operators), Các biến số (Variables).
- **Khu vực kịch bản (Script Area):** Nơi kéo thả ghép các khối lệnh logic.
- **Sân khấu (Stage):** Hệ tọa độ Descartes với tâm là (0,0), chiều rộng từ -240 đến 240, chiều cao từ -180 đến 180.

### 2. Sự kiện khởi đầu
- Khối lệnh \`Khi bấm vào cờ xanh (when green flag clicked)\`: Kích hoạt kịch bản toàn hệ thống.
    `,
    practiceType: 'scratch',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Lập trình dự án Scratch điều khiển chú mèo Scratch di chuyển qua lại trên sân khấu và kêu "Meow" khi chạm vào cạnh. Chấp nhận tệp .sb3, .zip, .pdf hoặc bài thuyết trình .pptx.',
    dueDate: '2026-10-24',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },
  {
    id: 'tin8-bai2',
    gradeLevel: 8,
    chapter: 'Chủ đề F: Lập trình trực quan',
    title: 'Bài 2: Vòng lặp và Biến số trong Scratch: Trò chơi hứng táo rơi',
    description: 'Sử dụng biến số tính điểm, khối lệnh lặp liên tục (forever) và điều kiện cảm biến (touching) để tạo trò chơi tương tác thú vị.',
    duration: '90 phút',
    videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Khái niệm Biến số (Variables)
- Là vùng nhớ được đặt tên để lưu trữ giá trị có thể thay đổi trong quá trình chạy chương trình (ví dụ: biến \`DiemSo\`, biến \`ThoiGian\`).

### 2. Thuật toán Trò chơi Hứng Táo:
1. Khi cờ xanh bật: Đặt \`DiemSo = 0\`.
2. Quả táo xuất hiện ở tọa độ Y = 180, X ngẫu nhiên từ -200 đến 200.
3. Quả táo rơi xuống: Giảm Y liên tục 5 đơn vị.
4. Nếu quả táo chạm vào Chiếc Bát (Bowl):
   - Tăng \`DiemSo\` thêm 1 điểm.
   - Phát âm thanh Pop.
   - Đặt lại quả táo về đỉnh màn hình.
    `,
    practiceType: 'scratch',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Nộp dự án Scratch .sb3 hoàn chỉnh trò chơi "Hứng Táo Rơi" có tính điểm, màn hình Game Over. Chấp nhận nộp .sb3, .zip, .docx hướng dẫn, hoặc video/slide trình chiếu .pptx.',
    dueDate: '2026-10-30',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },

  // ==========================================
  // KHỐI 9
  // ==========================================
  {
    id: 'tin9-bai1',
    gradeLevel: 9,
    chapter: 'Chủ đề F: Lập trình C++ cơ bản và nâng cao',
    title: 'Bài 1: Cấu trúc chương trình C++ và Kiểu dữ liệu số học',
    description: 'Cài đặt môi trường GCC, cú pháp chuẩn C++03/C++11, thư viện iostream, khai báo biến và cấu trúc rẽ nhánh if/else.',
    duration: '45 phút',
    videoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Khung chương trình C++ chuẩn
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Thân chương trình
    cout << "Xin chao cac ban hoc sinh Tin hoc 9!" << endl;
    return 0;
}
\`\`\`

### 2. Các kiểu dữ liệu cơ bản
- \`int\`: Số nguyên (khoảng -2*10^9 đến 2*10^9).
- \`long long\`: Số nguyên lớn 64-bit (đến 9*10^18, rất quan trọng trong thi HSG).
- \`double\`, \`float\`: Số thực.
- \`char\`: Ký tự đơn.
- \`bool\`: Giá trị logic (\`true\` hoặc \`false\`).

### 3. Nhập xuất dữ liệu
- Nhập: \`cin >> a >> b;\`
- Xuất: \`cout << a + b << "\\n";\`
    `,
    practiceType: 'cpp',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Viết chương trình C++ kiểm tra 3 cạnh của tam giác và tính diện tích theo công thức Heron. Chấp nhận tệp .cpp, .pdf, .docx, .zip.',
    dueDate: '2026-10-27',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  },
  {
    id: 'tin9-bai2',
    gradeLevel: 9,
    chapter: 'Chủ đề F: Ôn luyện HSG C++',
    title: 'Bài 2: Vòng lặp, Mảng một chiều và Thuật toán Sàng nguyên tố Eratosthenes',
    description: 'Phương pháp tối ưu hóa thời gian chạy, sàng nguyên tố O(N log log N) và giải các bài toán chuyên sâu trong kỳ thi HSG cấp Quận/Tỉnh.',
    duration: '90 phút',
    videoUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    theoryContent: `
### 1. Thuật toán kiểm tra số nguyên tố cơ bản
- Kiểm tra từ 2 đến \`sqrt(n)\` với độ phức tạp \`O(sqrt(n))\`.

### 2. Sàng nguyên tố Eratosthenes (Tối ưu cho N <= 10^7)
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

const int MAX = 10000000;
bool isPrime[MAX + 1];

void sieve() {
    fill(isPrime, isPrime + MAX + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= MAX; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= MAX; i += p)
                isPrime[i] = false;
        }
    }
}
\`\`\`
- Ứng dụng: Trả lời truy vấn nguyên tố trong \`O(1)\`, phân tích thừa số nguyên tố cực nhanh.
    `,
    practiceType: 'cpp',
    acceptedFormats: ALL_SUPPORTED_FORMATS,
    assignmentPrompt: 'Nộp mã nguồn C++ giải bài toán Sàng nguyên tố và đếm số lượng số nguyên tố đối xứng trong đoạn [A, B]. Chấp nhận .cpp, .pdf, .zip, .docx báo cáo.',
    dueDate: '2026-10-31',
    rubricGuide: DEFAULT_RUBRIC_GUIDE
  }
];
