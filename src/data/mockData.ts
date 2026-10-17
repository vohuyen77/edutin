import { User, BatchGradingItem, NotificationItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-teacher-1',
    name: 'Thầy Nguyễn Văn Bình',
    role: 'teacher',
    username: 'nguyenvanbinh_gv',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'binh.nguyen@thcs-edu.vn',
    phone: '0912.888.999'
  },
  {
    id: 'usr-student-1',
    name: 'Nguyễn Văn An',
    role: 'student',
    username: 'nguyenvana6a',
    className: '6A',
    gradeLevel: 6,
    birthDate: '2013-05-15',
    isFirstLogin: false,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    points: 480,
    streakDays: 7
  },
  {
    id: 'usr-student-2',
    name: 'Trần Thị Bình',
    role: 'student',
    username: 'tranthibinh6a',
    className: '6A',
    gradeLevel: 6,
    birthDate: '2013-08-20',
    isFirstLogin: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    points: 620,
    streakDays: 14
  },
  {
    id: 'usr-student-3',
    name: 'Lê Hoàng Cường',
    role: 'student',
    username: 'lehoangcuong9a',
    className: '9A',
    gradeLevel: 9,
    birthDate: '2010-11-02',
    isFirstLogin: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    points: 1350,
    streakDays: 24
  },
  {
    id: 'usr-parent-1',
    name: 'Bác Nguyễn Văn Thành',
    role: 'parent',
    username: 'phuhuynh_nguyenvana',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    linkedStudentId: 'usr-student-1',
    email: 'phuhuynh.thanh@gmail.com',
    phone: '0988.765.432'
  }
];

export const INITIAL_BATCH_ITEMS: BatchGradingItem[] = [
  {
    id: 'sub-01',
    studentName: 'Nguyễn Văn An',
    studentCode: 'HS-6A-01',
    className: '6A',
    fileName: 'BaiTap1_SoanThaoVanBan.docx',
    format: 'docx',
    score: 9.0,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Thể thức căn lề (Nghị định 30)', score: 3.5, maxScore: 3.5, comment: 'Đạt chuẩn lề trái 3cm, phải 2cm, trên/dưới 2cm.' },
      { name: 'Phông chữ Unicode & Cỡ chữ (14pt)', score: 3.5, maxScore: 4.5, comment: 'Phông Times New Roman chuẩn, đồng bộ văn bản.' },
      { name: 'Bảng biểu & Đánh số trang', score: 2.0, maxScore: 2.0, comment: 'Kẻ bảng viền rõ ràng, có tiêu đề bảng in đậm.' }
    ],
    breakdown: {
      formatCompliance: 3.5,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Định dạng chuẩn văn bản hành chính THCS, căn lề và thụt đầu dòng hoàn hảo.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-02',
    studentName: 'Vũ Thu Hà',
    studentCode: 'HS-6A-09',
    className: '6A',
    fileName: 'Don_GiaNhap_CLB_TinHoc.doc',
    format: 'doc',
    score: 8.5,
    gradeType: 'Giỏi',
    criteriaScores: [
      { name: 'Thể thức căn lề (Nghị định 30)', score: 3.0, maxScore: 3.5, comment: 'Lề phải còn hơi hẹp (1.5cm).' },
      { name: 'Phông chữ Unicode & Cỡ chữ (14pt)', score: 3.5, maxScore: 4.5, comment: 'Đạt chuẩn thể thức văn bản.' },
      { name: 'Bảng biểu & Đánh số trang', score: 2.0, maxScore: 2.0, comment: 'Đầy đủ thông tin người làm đơn.' }
    ],
    breakdown: {
      formatCompliance: 3.0,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Bài làm trình bày mạch lạc, cần chỉnh lại lề phải thành 2cm theo đúng quy chuẩn.'
    },
    detectedIssues: ['Lề phải chưa đủ 2cm chuẩn Nghị định 30']
  },
  {
    id: 'sub-03',
    studentName: 'Trần Thị Bình',
    studentCode: 'HS-7A-04',
    className: '7A',
    fileName: 'BangDiem_TongKet_HamIF.xlsx',
    format: 'xlsx',
    score: 8.5,
    gradeType: 'Giỏi',
    criteriaScores: [
      { name: 'Cú pháp hàm SUM, AVERAGE, IF', score: 4.0, maxScore: 4.5, comment: 'Sử dụng đúng hàm lồng IF để xếp loại học sinh.' },
      { name: 'Định dạng ô số & Thập phân', score: 2.5, maxScore: 3.5, comment: 'Chưa cố định định dạng 1 chữ số thập phân cho Điểm TB.' },
      { name: 'Kẻ viền khung bảng & Biểu đồ', score: 2.0, maxScore: 2.0, comment: 'Bảng tính kẻ khung rõ ràng, tiêu đề in đậm.' }
    ],
    breakdown: {
      formatCompliance: 3.0,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Công thức lồng IF chính xác, đã kẻ khung viền đẹp, thiếu định dạng số thập phân 1 chữ số.'
    },
    detectedIssues: ['Cần định dạng cột Điểm TB với 1 chữ số thập phân (Format Cells -> Number)']
  },
  {
    id: 'sub-04',
    studentName: 'Hoàng Kim Ngân',
    studentCode: 'HS-7B-19',
    className: '7B',
    fileName: 'BaoCao_TaiChinhGiaDinh.excel',
    format: 'excel',
    score: 9.5,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Cú pháp hàm SUM, AVERAGE, IF', score: 4.5, maxScore: 4.5, comment: 'Tính toán chính xác tổng chi tiêu và tỷ trọng.' },
      { name: 'Định dạng ô số & Tiền tệ', score: 3.0, maxScore: 3.5, comment: 'Định dạng số có dấu phẩy phân cách hàng nghìn.' },
      { name: 'Biểu đồ trực quan (Pie Chart)', score: 2.0, maxScore: 2.0, comment: 'Vẽ biểu đồ tròn phân tích cơ cấu chi tiêu tuyệt vời.' }
    ],
    breakdown: {
      formatCompliance: 4.0,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Vẽ thêm biểu đồ hình tròn (Pie chart) trực quan hóa chi tiêu rất ấn tượng.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-05',
    studentName: 'Nguyễn Bảo Nam',
    studentCode: 'HS-7A-15',
    className: '7A',
    fileName: 'ThuyetTrinh_AnToanMang.pptx',
    format: 'pptx',
    score: 9.0,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Bố cục Slide Master & Cỡ chữ (>=24pt)', score: 3.5, maxScore: 3.5, comment: 'Font chữ to, rõ ràng, tương phản cao trên nền tối.' },
      { name: 'Hiệu ứng Transition & Animation', score: 3.5, maxScore: 4.5, comment: 'Hiệu ứng chuyển slide nhẹ nhàng, chuyên nghiệp.' },
      { name: 'Đa phương tiện (Ảnh & Biểu tượng)', score: 2.0, maxScore: 2.0, comment: 'Chèn infographic trực quan, cảnh báo rủi ro an toàn mạng.' }
    ],
    breakdown: {
      formatCompliance: 3.5,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Bài thuyết trình thiết kế hiện đại, thông điệp an toàn thông tin rất thuyết phục.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-06',
    studentName: 'Lê Mai Linh',
    studentCode: 'HS-7B-08',
    className: '7B',
    fileName: 'ThietBi_PhanCung_MayTinh.ppt',
    format: 'ppt',
    score: 8.5,
    gradeType: 'Giỏi',
    criteriaScores: [
      { name: 'Bố cục Slide Master & Cỡ chữ', score: 3.0, maxScore: 3.5, comment: 'Slide 3 có một đoạn văn bản hơi nhỏ (18pt).' },
      { name: 'Hiệu ứng Transition & Animation', score: 3.5, maxScore: 4.5, comment: 'Animation xuất hiện đúng thứ tự bài thuyết trình.' },
      { name: 'Đa phương tiện (Hình ảnh CPU/RAM)', score: 2.0, maxScore: 2.0, comment: 'Hình ảnh minh họa thiết bị chân thực.' }
    ],
    breakdown: {
      formatCompliance: 3.0,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Hình ảnh thiết bị rõ nét, lưu ý tăng cỡ chữ ở slide giới thiệu bo mạch chủ.'
    },
    detectedIssues: ['Slide 3 cần tăng font size nội dung lên tối thiểu 24pt']
  },
  {
    id: 'sub-07',
    studentName: 'Lê Hoàng Cường',
    studentCode: 'HS-9A-03',
    className: '9A',
    fileName: 'Sang_Eratosthenes_HSG.cpp',
    format: 'cpp',
    score: 10.0,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Biên dịch chuẩn C++03 / C++11 (g++)', score: 3.5, maxScore: 3.5, comment: 'Biên dịch hoàn hảo 0 cảnh báo.' },
      { name: 'Thuật toán & Kiểm thử Test Cases', score: 4.5, maxScore: 4.5, comment: 'Vượt qua 100% test cases (kể cả N = 10^7 trong 0.25s).' },
      { name: 'Tối ưu Time Limit & Memory Limit', score: 2.0, maxScore: 2.0, comment: 'Time 24ms, Memory 18.4MB (rất tối ưu).' }
    ],
    breakdown: {
      formatCompliance: 3.5,
      logicCorrectness: 4.5,
      aestheticLayout: 2.0,
      comments: 'Thuật toán sàng nguyên tố tối ưu tuyệt đối, áp dụng kỹ thuật bitset tiết kiệm RAM.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-08',
    studentName: 'Đỗ Tuấn Kiệt',
    studentCode: 'HS-8B-12',
    className: '8B',
    fileName: 'Game_HungTao_CapDo2.sb3',
    format: 'sb3',
    score: 9.5,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Cấu trúc khối lệnh & Vòng lặp forever', score: 4.5, maxScore: 4.5, comment: 'Sử dụng vòng lặp 60 FPS mượt mà.' },
      { name: 'Biến số tính điểm & Va chạm sensing', score: 3.5, maxScore: 3.5, comment: 'Tính điểm chính xác và có màn hình Game Over.' },
      { name: 'Âm thanh & Trang phục sprite', score: 1.5, maxScore: 2.0, comment: 'Âm thanh hứng trúng táo vui nhộn.' }
    ],
    breakdown: {
      formatCompliance: 4.0,
      logicCorrectness: 4.0,
      aestheticLayout: 1.5,
      comments: 'Dự án Scratch sáng tạo, có âm thanh khi hứng trúng và biến tính điểm tăng tốc độ rơi.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-09',
    studentName: 'Phạm Phương Thảo',
    studentCode: 'HS-9A-22',
    className: '9A',
    fileName: 'BaoCao_HeQuanTri_CSDL.pdf',
    format: 'pdf',
    score: 9.0,
    gradeType: 'Xuất sắc',
    criteriaScores: [
      { name: 'Tính toàn vẹn & Định dạng PDF chuẩn', score: 3.5, maxScore: 3.5, comment: 'Tệp xuất chuẩn PDF/A, bố cục khoa học.' },
      { name: 'Nội dung cốt lõi CSDL quan hệ', score: 3.5, maxScore: 4.5, comment: 'Sơ đồ thực thể ERD vẽ rất chuẩn xác.' },
      { name: 'Trình bày & Tính sư phạm', score: 2.0, maxScore: 2.0, comment: 'Hình vẽ minh họa rõ ràng, có tài liệu tham khảo.' }
    ],
    breakdown: {
      formatCompliance: 3.5,
      logicCorrectness: 3.5,
      aestheticLayout: 2.0,
      comments: 'Báo cáo CSDL thiết kế sạch đẹp, phân tích chuẩn hóa 1NF, 2NF, 3NF rất tốt.'
    },
    detectedIssues: []
  },
  {
    id: 'sub-10',
    studentName: 'Phạm Minh Đức',
    studentCode: 'HS-9A-08',
    className: '9A',
    fileName: 'DeThi_HSG_SoNguyenTo.zip',
    format: 'zip',
    score: 8.0,
    gradeType: 'Giỏi',
    criteriaScores: [
      { name: 'Cấu trúc thư mục gói nén ZIP', score: 3.0, maxScore: 3.5, comment: 'Đầy đủ file mã nguồn .cpp và tệp dữ liệu I/O.' },
      { name: 'Tính đúng đắn của giải thuật', score: 3.0, maxScore: 4.5, comment: 'Vượt qua 4/5 test cases, test 5 bị vượt quá thời gian.' },
      { name: 'Quét an toàn & Phong cách lập trình', score: 2.0, maxScore: 2.0, comment: 'Mã nguồn sạch, có chú thích giải thuật.' }
    ],
    breakdown: {
      formatCompliance: 3.0,
      logicCorrectness: 3.0,
      aestheticLayout: 2.0,
      comments: 'Đầy đủ file .cpp và file test I/O, tuy nhiên thuật toán cần đổi sang Sàng Eratosthenes để đạt 10/10.'
    },
    detectedIssues: ['Cần thay thuật toán O(sqrt(N)) bằng Sàng Eratosthenes để tránh TLE test 5']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '⏰ Nhắc hạn nộp bài tập Tin học',
    message: 'Bài tập 2 "Bảng tính Excel & Hàm IF" hạn chót vào 23:59 ngày mai. Hãy nộp tệp .xlsx đúng hạn!',
    type: 'deadline',
    timestamp: '15 phút trước',
    read: false,
    targetRole: 'student'
  },
  {
    id: 'notif-2',
    title: '📊 Báo cáo Học tập Tháng 10',
    message: 'Thầy Bình đã xuất Báo cáo Tiến độ Học tập môn Tin học tháng 10 của em An. Quý phụ huynh vui lòng xem chi tiết.',
    type: 'parent',
    timestamp: '1 giờ trước',
    read: false,
    targetRole: 'parent'
  },
  {
    id: 'notif-3',
    title: '⚡ Lịch kiểm tra HSG Tin 9',
    message: 'Đội tuyển HSG Tin 9 có buổi thi thử trực tuyến thuật toán C++ lúc 14:00 Thứ Bảy trên hệ thống Auto-grader.',
    type: 'schedule',
    timestamp: 'Hôm qua',
    read: true,
    targetRole: 'all'
  }
];
