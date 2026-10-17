export interface TechArchitecturePart {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  badge: string;
  content: string;
  details: any;
}

export const ARCHITECTURE_PARTS: TechArchitecturePart[] = [
  {
    id: 'part-1-stack',
    number: 1,
    title: 'Tech Stack & High-Level Architecture',
    shortDesc: 'Kiến trúc Full-stack hiện đại, Microservices & AI Gateway',
    badge: 'Hạ tầng & Công nghệ',
    content: `
### 1.1 Khuyến nghị Công nghệ (Recommended Tech Stack)
- **Frontend Web & Mobile Hybrid:**
  - **React 19 + TypeScript + Vite + Tailwind CSS v4:** Giao diện SPA siêu tốc độ, tối ưu rendering, hỗ trợ PWA chuẩn quốc tế cho học sinh và giáo viên trên mọi thiết bị.
  - **Mobile Native/Cross-platform:** React Native / Expo với Expo Router để triển khai Native App cho iOS và Android (chia sẻ chung TypeScript interfaces và API client).
  - **Motion (Framer Motion):** Đảm bảo chuyển cảnh mượt mà, micro-interactions nâng cao hứng thú học tập (Gamification).
  - **Code Editor:** Monaco Editor / CodeMirror 6 hỗ trợ Syntax Highlighting cho C++03, C++11, và Scratch Block Viewer.

- **Backend & Microservices:**
  - **Node.js (Express / Fastify) + TypeScript:** Cung cấp Core LMS RESTful/GraphQL API, WebSocket gateway cho thông báo đẩy thời gian thực và nộp bài.
  - **Python FastAPI (AI & Grader Microservice):** Dành riêng cho xử lý văn bản, bóc tách cấu trúc file Office (.docx, .xlsx via openpyxl/python-docx), giải nén và phân tích cây JSON của dự án Scratch (.sb3).
  - **C++ Auto-Grader Sandbox Service:** Containerized Worker viết bằng Go/Rust kết hợp Docker / gVisor / Isolate (tương tự CMS/Themis) nhằm cách ly an toàn, đo chính xác CPU time, Memory limit (rlimit), và ngăn chặn syscalls độc hại (seccomp).

- **Trí tuệ nhân tạo (AI Engine):**
  - **Google Gemini 2.5 Flash / Gemini 2.0:** Xử lý OCR đề thi PDF, trích xuất yêu cầu, tự động sinh bộ Test Cases phong phú (Sample, Biên, Stress), đối chiếu Rubric chấm bài tự luận và sinh Báo cáo Học tập Phụ huynh cá nhân hóa.

- **Cơ sở dữ liệu & Lưu trữ (Storage & DB):**
  - **PostgreSQL 16:** Lưu trữ dữ liệu quan hệ ACID cốt lõi (Users, Classes, Rubrics, Grades, Submissions).
  - **Redis 7:** Bộ nhớ đệm Token JWT, hàng đợi chấm bài (BullMQ), Pub/Sub realtime notifications.
  - **S3 / Cloud Storage:** Lưu trữ bài tập nộp (.docx, .xlsx, .sb3, .zip, .cpp) với presigned URLs an toàn.
    `,
    details: {
      layers: [
        { name: 'Client Layer', items: ['React 19 Web SPA', 'React Native / Expo Mobile App', 'Monaco C++ Editor', 'Tailwind CSS v4'] },
        { name: 'Gateway Layer', items: ['Nginx / Cloudflare CDN', 'JWT Auth Middleware', 'Rate Limiting', 'WebSocket Gateway'] },
        { name: 'Service Layer', items: ['LMS Core API (Node/TS)', 'AI Gateway (Gemini API)', 'C++ Auto-Grader (Isolate Sandbox)', 'Batch Office/Scratch Analyzer'] },
        { name: 'Data Layer', items: ['PostgreSQL 16 (Relational)', 'Redis Cache & Queue', 'S3 Object Storage'] }
      ]
    }
  },
  {
    id: 'part-2-db',
    number: 2,
    title: 'Database Schema & Relational Models',
    shortDesc: 'Cấu trúc các bảng dữ liệu cốt lõi (Users, Courses, Assignments, Submissions, Grades)',
    badge: 'Cơ sở dữ liệu (PostgreSQL)',
    content: `
### 2.1 Thiết kế Sơ đồ Cơ sở dữ liệu Cốt lõi
Hệ thống sử dụng mô hình cơ sở dữ liệu quan hệ (PostgreSQL) kết hợp JSONB cho các tiêu chí chấm điểm động:

1. **Bảng \`users\` (Người dùng & Định danh):**
   - \`id\` UUID PRIMARY KEY
   - \`username\` VARCHAR(64) UNIQUE (Quy tắc: [ten][lop] không dấu, vd: \`nguyenvana6a\`)
   - \`password_hash\` VARCHAR(255) (Mặc định mã hóa bcrypt từ ngày sinh \`ddmmyyyy\`)
   - \`is_first_login\` BOOLEAN DEFAULT TRUE (Bắt buộc đổi mật khẩu khi đăng nhập lần đầu)
   - \`full_name\` VARCHAR(128)
   - \`role\` ENUM('teacher', 'student', 'parent', 'admin')
   - \`class_id\` UUID REFERENCES classes(id)
   - \`birth_date\` DATE
   - \`points\` INT DEFAULT 0
   - \`streak_days\` INT DEFAULT 0

2. **Bảng \`parent_student_links\` (Quan hệ Phụ huynh - Học sinh):**
   - \`parent_id\` UUID REFERENCES users(id)
   - \`student_id\` UUID REFERENCES users(id)
   - \`relationship\` VARCHAR(32) ('Bố', 'Mẹ', 'Người giám hộ')
   - \`is_verified\` BOOLEAN DEFAULT TRUE

3. **Bảng \`classes\` & \`grade_levels\` (Khối và Lớp):**
   - \`id\` UUID PRIMARY KEY
   - \`grade\` SMALLINT CHECK(grade IN (6, 7, 8, 9))
   - \`name\` VARCHAR(32) ('6A', '7B', '9A_HSG')
   - \`academic_year\` VARCHAR(16) ('2026-2027')
   - \`homeroom_teacher_id\` UUID REFERENCES users(id)

4. **Bảng \`assignments\` & \`rubrics\` (Bài tập & Tiêu chí):**
   - \`id\` UUID PRIMARY KEY
   - \`title\` VARCHAR(255)
   - \`grade_level\` SMALLINT
   - \`accepted_formats\` VARCHAR[] ('.docx', '.xlsx', '.sb3', '.cpp', '.pdf')
   - \`rubric_criteria\` JSONB (Cấu trúc các đầu điểm: format, logic, aesthetic)
   - \`due_date\` TIMESTAMP WITH TIME ZONE

5. **Bảng \`submissions\` & \`test_cases\` (Bài nộp & Auto-grader):**
   - \`id\` UUID PRIMARY KEY
   - \`student_id\` UUID REFERENCES users(id)
   - \`assignment_id\` UUID REFERENCES assignments(id)
   - \`file_url\` VARCHAR(512)
   - \`file_type\` VARCHAR(16)
   - \`status\` ENUM('pending', 'grading', 'graded', 'flagged')
   - \`score\` NUMERIC(3, 1)
   - \`breakdown_json\` JSONB
   - \`teacher_comment\` TEXT
   - \`ai_feedback\` TEXT
    `,
    details: {
      tables: [
        { name: 'users', count: '10 trường', role: 'Định danh RBAC, thông tin học sinh, giáo viên, phụ huynh' },
        { name: 'classes', count: '6 trường', role: 'Quản lý khối 6-9, danh sách lớp học và giáo viên phụ trách' },
        { name: 'parent_student_links', count: '5 trường', role: 'Liên kết giám sát và gửi thông báo phụ huynh' },
        { name: 'assignments', count: '9 trường', role: 'Kho bài tập, lý thuyết, hạn chót và định dạng nộp' },
        { name: 'rubrics', count: '7 trường', role: 'Tiêu chuẩn chấm chi tiết từng định dạng Office, Scratch, C++' },
        { name: 'submissions', count: '12 trường', role: 'Lịch sử nộp bài, tệp đính kèm, điểm AI và nhận xét GV' },
        { name: 'cpp_testcases', count: '8 trường', role: 'Bộ test cases I/O, thời gian thực thi, bộ nhớ cho HSG 9' }
      ]
    }
  },
  {
    id: 'part-3-ux',
    number: 3,
    title: 'UX/UI Flow & User Journeys (Mobile & Web)',
    shortDesc: 'Hành trình người dùng chuẩn mực cho Giáo viên, Học sinh và Phụ huynh',
    badge: 'Trải nghiệm Người dùng',
    content: `
### 3.1 Hành trình Học sinh (Student Workspace)
1. **Đăng nhập & Kích hoạt:** Nhập mã đăng nhập \`[ten][lop]\` (vd: \`nguyenvana6a\`) và mật khẩu ngày sinh \`ddmmyyyy\`. Modal đổi mật khẩu an toàn xuất hiện ngay lần đầu.
2. **Dashboard Gamified:** Hiển thị Chuỗi học tập (Streak), Cúp tích lũy, Lộ trình bài học theo khối 6-9.
3. **Phòng Học & Nộp bài:** Xem video bài giảng, tóm tắt lý thuyết, làm trắc nghiệm lấy điểm nóng, kéo thả file (.docx, .xlsx, .sb3, .cpp) để nhận phản hồi AI tức thì trước khi chốt nộp.
4. **Phòng Luyện HSG C++:** Soạn code trong Monaco Editor, bấm "Chạy thử" với Custom Input, bấm "Chấm bài" xem chi tiết từng Test Case Pass/Fail với thời gian mili-giây.

### 3.2 Hành trình Giáo viên (Teacher Dashboard)
1. **Quản lý Học sinh:** Tải lên file Excel danh sách lớp, hệ thống tự động sinh tài khoản học sinh + phụ huynh, tải file thông báo cấp mã cho học sinh.
2. **Quản lý Đề thi & Tạo Test Cases bằng AI:** Tải đề PDF hoặc nhập yêu cầu, Gemini tự động bóc tách I/O và sinh bộ test mẫu, test biên.
3. **Chấm bài Hàng loạt (Batch Grader):** Tải thư mục bài nộp của lớp, AI chấm đối chiếu theo Rubric, xuất Báo cáo Excel nhiều Sheet chỉ với 1 click.
4. **Theo dõi Tiến độ:** Biểu đồ phân tích độ hiểu bài theo từng lớp, phát hiện học sinh gặp khó khăn để can thiệp kịp thời.

### 3.3 Hành trình Phụ huynh (Parent Portal)
1. **Thông báo đẩy (Push Notifications):** Nhận tin nhắn trên app khi học sinh nộp bài hoặc sắp đến hạn chót.
2. **Báo cáo Tiến độ Tháng bằng AI:** Xem nhận xét chi tiết của giáo viên và phân tích năng lực từ AI, kèm gợi ý thời lượng rèn luyện thêm tại nhà.
    `,
    details: {
      personas: [
        { role: 'Giáo viên', goal: 'Tiết kiệm 80% thời gian chấm bài thực hành, quản lý điểm và học liệu tập trung' },
        { role: 'Học sinh', goal: 'Giao diện trực quan, nhận phản hồi sửa lỗi tức thì, hứng thú với hệ thống tính điểm' },
        { role: 'Phụ huynh', goal: 'Minh bạch tiến độ học tập của con, không bỏ sót bài tập và nhận báo cáo định kỳ' }
      ]
    }
  },
  {
    id: 'part-4-grader-logic',
    number: 4,
    title: 'AI & Auto-Grader Technical Processing Logic',
    shortDesc: 'Cấu trúc luồng xử lý kỹ thuật cho Module C++ và Module chấm file (.sb3, .docx, .zip)',
    badge: 'Thuật toán Auto-Grader',
    content: `
### 4.1 Luồng Xử lý Module Chấm C++ (HSG Tin học 9)
\`\`\`
[Giáo viên: PDF Đề thi]
       │
       ▼ (Gemini Vision OCR / Text Parsing)
[Bóc tách Yêu cầu, Ràng buộc I/O, Giới hạn Thời gian/Bộ nhớ]
       │
       ▼ (AI Test Case Synthesizer)
[Bộ Test Cases: Sample (20%) + Random (40%) + Edge/Stress (40%)]
       │
       ▼ (Học sinh nộp source code .cpp)
[Compiler: g++ -O3 -std=c++11 / c++03] ──(Lỗi biên dịch)──> [CE: Compilation Error]
       │ (Biên dịch thành công)
       ▼
[Isolate Sandbox Execution (Linux cgroups v2, seccomp-bpf)]
       ├── Kiểm tra CPU Time Limit (1.0s) ──> [TLE: Time Limit Exceeded]
       ├── Kiểm tra Memory (256MB) ─────────> [MLE: Memory Limit Exceeded]
       ├── Kiểm tra System Calls (Cấm socket, exec, fork) ──> [RTE: Runtime Error]
       └── So khớp Output với Diff Engine ──> [AC (Accepted) / WA (Wrong Answer)]
       │
       ▼
[Bảng Điểm Chi tiết & Gợi ý Tối ưu Thuật toán bằng AI]
\`\`\`

### 4.2 Luồng Xử lý Module Chấm File Đa Định Dạng (.docx, .xlsx, .sb3, .zip)
1. **Định dạng Word (.docx):**
   - Trích xuất \`word/document.xml\`, \`styles.xml\`.
1. **Định dạng Word (.docx, .doc):**
   - Trích xuất \`word/document.xml\`, \`styles.xml\`.
   - Kiểm tra phông chữ (Unicode Times New Roman/Arial), cỡ chữ (13-14pt), giãn dòng (1.5 lines), lề trang (Trên 2cm, Dưới 2cm, Trái 3cm, Phải 2cm) theo Nghị định 30.
2. **Định dạng Excel (.xlsx, .excel):**
   - Trích xuất \`xl/worksheets/sheet1.xml\`.
   - Phân tích cây cú pháp hàm (Formula Parser) xác thực học sinh dùng đúng hàm \`SUM\`, \`AVERAGE\`, \`IF\`, \`MAX\`, \`VLOOKUP\`.
   - Kiểm tra định dạng số, kẻ viền khung bảng (Borders) và biểu đồ (Chart).
3. **Định dạng PowerPoint (.ppt, .pptx):**
   - Phân tích bố cục Slide Master, độ tương phản màu nền - chữ, cỡ chữ tối thiểu 24pt, hiệu ứng chuyển trang (Transition) và hiệu ứng chuyển động (Animation).
4. **Định dạng C++ (.cpp):**
   - Biên dịch \`g++ -O3 -std=c++11\`, kiểm tra test cases, giới hạn CPU Time Limit (1.0s) và Memory Limit (256MB).
5. **Định dạng Scratch (.sb3):**
   - Tệp \`.sb3\` chứa \`project.json\` và assets. Phân tích cây khối lệnh: sự kiện cờ xanh, vòng lặp forever, biến số tính điểm, cảm biến va chạm, âm thanh.
6. **Định dạng Báo cáo PDF & Gói Dự án ZIP (.pdf, .zip):**
   - Trích xuất văn bản PDF chuẩn hóa, kiểm tra cấu trúc thư mục ZIP và quét mã độc ClamAV.
7. **Tổng hợp & Xuất Báo cáo Excel Nhiều Sheet:**
   - Hệ thống chạy đối chiếu chặt chẽ với Hướng dẫn chấm (Rubric), gộp kết quả vào file Excel 8 Sheet chuyên biệt (Tổng hợp điểm, 6 Sheet chi tiết từng loại tệp, và 1 Sheet Hướng dẫn chấm).
    `,
    details: {
      fileEngines: [
        { type: '.cpp (C++03/11)', engine: 'g++ compiler + Isolate Linux Sandbox + Gemini Code Advisor' },
        { type: '.docx / .doc (Word)', engine: 'OpenXML DOM Inspector + Page Setup Verifier (Nghị định 30)' },
        { type: '.xlsx / .excel (Excel)', engine: 'SheetJS / openpyxl Formula AST Validator & Border Inspector' },
        { type: '.ppt / .pptx (PowerPoint)', engine: 'OpenXML PresentationML Analyzer + Slide Master Inspector' },
        { type: '.sb3 (Scratch 3.0)', engine: 'Zip Decompressor + project.json Block Graph Traverser' },
        { type: '.pdf (Báo cáo)', engine: 'PDF.js Text Extractor + Layout Conformity Verifier' },
        { type: '.zip (Dự án)', engine: 'ClamAV Malware Scanner + Multi-file Directory Tree Evaluator' }
      ]
    }
  },
  {
    id: 'part-5-api',
    number: 5,
    title: 'Comprehensive RESTful & WebSocket API Endpoints',
    shortDesc: 'Danh mục các API RESTful/GraphQL chính phục vụ toàn bộ hệ thống',
    badge: 'API Endpoints',
    content: `
### 5.1 Danh sách Endpoints Chính (RESTful APIs)

| Module | Method | Endpoint | Mô tả chức năng |
|---|---|---|---|
| **Auth** | POST | \`/api/auth/login\` | Đăng nhập bằng username [ten][lop] và mật khẩu ngày sinh |
| **Auth** | POST | \`/api/auth/first-login-change-password\` | Bắt buộc đổi mật khẩu lần đầu đăng nhập |
| **Users** | POST | \`/api/classes/:id/import-students-excel\` | Nhập danh sách học sinh từ file Excel và tự cấp tài khoản |
| **LMS** | GET | \`/api/courses/grade/:gradeLevel\` | Lấy danh sách chuyên đề, bài giảng và bài tập theo khối 6-9 |
| **Submissions** | POST | \`/api/assignments/:id/submit\` | Học sinh nộp bài tập (.docx, .xlsx, .sb3, .cpp, .pdf) |
| **AI Grader** | POST | \`/api/ai/grade-submission\` | AI chấm bài tự động, phân tích rubric và sinh phản hồi |
| **HSG C++** | POST | \`/api/cpp/parse-pdf-problem\` | AI OCR đọc đề thi PDF và sinh tự động bộ Test Cases |
| **HSG C++** | POST | \`/api/cpp/run-testcases\` | Máy chấm sandbox chạy code C++ và kiểm tra bộ Test Cases |
| **Batch** | POST | \`/api/grading/batch-evaluate\` | Chấm hàng loạt tệp nộp theo lớp và rubric |
| **Batch** | GET | \`/api/grading/export-excel/:batchId\` | Xuất file Excel báo cáo nhiều Sheet (Tổng hợp, Word, Excel, Scratch) |
| **Parents** | POST | \`/api/ai/parent-report\` | Tạo báo cáo năng lực học tập định kỳ hàng tháng bằng AI |
| **Push Notif** | POST | \`/api/notifications/send-reminder\` | Bắn thông báo nhắc hạn nộp bài và lịch học tới phụ huynh/học sinh |
    `,
    details: {
      endpointsCount: 12,
      authMethod: 'JWT Bearer Token + Role Claims (Teacher, Student, Parent)'
    }
  }
];
