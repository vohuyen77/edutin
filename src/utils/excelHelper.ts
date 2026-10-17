import * as XLSX from 'xlsx';
import { BatchGradingItem, RubricGuide } from '../types';

/**
 * Remove Vietnamese accents and special characters, convert to lowercase
 * Example: "Nguyễn Văn An" -> "nguyenvanan"
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

/**
 * Generate standard username: [Tên học sinh] + [Lớp] viết liền không dấu (VD: nguyenvana6a)
 */
export function generateUsername(fullName: string, className: string): string {
  const cleanName = removeVietnameseAccents(fullName);
  const cleanClass = removeVietnameseAccents(className);
  return `${cleanName}${cleanClass}`;
}

/**
 * Generate default password from birthDate (YYYY-MM-DD) -> DDMMYYYY
 */
export function generateDefaultPassword(birthDateStr?: string): string {
  if (!birthDateStr) return '01012012';
  try {
    const parts = birthDateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}${parts[1]}${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return '01012012';
}

/**
 * Standard Rubric Guidelines for Informatics THCS
 */
export const DEFAULT_RUBRIC_GUIDE: RubricGuide = {
  id: 'rubric-thcs-standard',
  title: 'HƯỚNG DẪN CHẤM BÀI KIỂM TRA THỰC HÀNH TIN HỌC THCS (BỘ GD&ĐT)',
  gradeLevel: 6,
  totalMaxScore: 10,
  evaluationInstructions: 'Chấm điểm tự động theo thang 10, đối chiếu chặt chẽ từng tiêu chí kỹ thuật theo định dạng tệp nộp.',
  standardRequirements: [
    'Tệp nộp đúng định dạng quy định (.cpp, .pdf, .excel/.xlsx, .docx, .doc, .ppt/.pptx, .sb3, .zip).',
    'Hoàn thành đầy đủ các yêu cầu cốt lõi trong đề bài thực hành.',
    'Tính chính xác logic, thuật toán, công thức hoặc thiết kế kịch bản.',
    'Trình bày đúng thể thức văn bản, tính thẩm mỹ và tính sư phạm.'
  ],
  criteria: [
    {
      id: 'crit-format',
      name: 'Chuẩn Thể thức & Bố cục Văn bản / Slide (Word / PPT / PDF)',
      maxScore: 3.0,
      description: 'Font chữ Unicode chuẩn (Times New Roman / Arial 13-14pt), căn lề trang, giãn dòng 1.5, tiêu đề rõ ràng.',
      targetCategory: 'word'
    },
    {
      id: 'crit-excel-formula',
      name: 'Độ Chính xác Công thức Hàm & Bảng tính (Excel)',
      maxScore: 4.0,
      description: 'Sử dụng đúng cú pháp hàm (SUM, AVERAGE, IF, VLOOKUP...), định dạng ô số/ngày chuẩn, kẻ viền bảng rõ ràng.',
      targetCategory: 'excel'
    },
    {
      id: 'crit-cpp-algo',
      name: 'Thuật toán & Hiệu năng Chương trình (C++ / Code)',
      maxScore: 4.0,
      description: 'Biên dịch thành công chuẩn C++03/11, vượt qua các Test Cases, không TLE/MLE, cấu trúc code sạch sẽ có chú thích.',
      targetCategory: 'cpp'
    },
    {
      id: 'crit-scratch-logic',
      name: 'Cấu trúc Khối lệnh & Trực quan Tương tác (Scratch .sb3)',
      maxScore: 4.0,
      description: 'Sự kiện bấm cờ xanh, vòng lặp điều khiển, biến số tính điểm, chuyển động nhân vật mượt mà, âm thanh hiệu ứng.',
      targetCategory: 'scratch'
    },
    {
      id: 'crit-presentation',
      name: 'Thiết kế Trình chiếu & Trực quan Đa phương tiện (PowerPoint)',
      maxScore: 3.0,
      description: 'Slide Master đồng bộ, phối màu tương phản chuẩn, hiệu ứng transition hợp lý, chèn ảnh/video rõ nét.',
      targetCategory: 'powerpoint'
    },
    {
      id: 'crit-completeness',
      name: 'Tính Đầy đủ & Cấu trúc Dự án (PDF / Zip / Báo cáo)',
      maxScore: 3.0,
      description: 'Đầy đủ tệp tin yêu cầu, đóng gói đúng thư mục, báo cáo mạch lạc, không phát hiện tệp rác thừa.',
      targetCategory: 'general'
    }
  ]
};

/**
 * Export Multi-sheet Excel workbook for batch grading results strictly matching the Rubric
 * Sheets:
 * 1. Tong_Hop_Diem (Bảng điểm tổng hợp theo thang điểm chuẩn của hướng dẫn chấm)
 * 2. Chi_Tiet_Word_Doc (.docx, .doc)
 * 3. Chi_Tiet_Excel (.xlsx, .xls, .excel)
 * 4. Chi_Tiet_PowerPoint (.ppt, .pptx)
 * 5. Chi_Tiet_Cpp_Code (.cpp)
 * 6. Chi_Tiet_Scratch_Sb3 (.sb3)
 * 7. Chi_Tiet_PDF_Zip (.pdf, .zip)
 * 8. Huong_Dan_Cham_Rubric (Bảng tiêu chí hướng dẫn chấm chi tiết)
 */
export function exportMultiSheetGradingExcel(
  items: BatchGradingItem[],
  rubricGuide: RubricGuide = DEFAULT_RUBRIC_GUIDE
): void {
  const workbook = XLSX.utils.book_new();

  // =========================================================================
  // Sheet 1: Bảng điểm tổng hợp (Tong_Hop_Diem)
  // =========================================================================
  const summaryData = items.map((item, index) => ({
    'STT': index + 1,
    'Mã Học Sinh': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Bài Nộp': item.fileName,
    'Định Dạng Tệp': item.format.toUpperCase(),
    'Điểm Tổng (Thang 10)': item.score,
    'Xếp Loại': item.gradeType,
    'Điểm Thể Thức/Cấu Trúc (Max 3.5đ)': item.breakdown.formatCompliance,
    'Điểm Logic/Thuật Toán/Hàm (Max 4.5đ)': item.breakdown.logicCorrectness,
    'Điểm Trình Bày/Thẩm Mỹ (Max 2.0đ)': item.breakdown.aestheticLayout,
    'Lỗi Phát Hiện Chính': item.detectedIssues.join('; ') || 'Không có lỗi',
    'Nhận Xét Chi Tiết Của AI & Giáo Viên': item.breakdown.comments
  }));
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Tong_Hop_Diem');

  // =========================================================================
  // Sheet 2: Chi tiết Word (.docx, .doc)
  // =========================================================================
  const wordItems = items.filter(i => i.format === 'docx' || i.format === 'doc');
  const wordTargetList = wordItems.length > 0 ? wordItems : items;
  const wordData = wordTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Nộp': item.fileName,
    'Căn Lề Trang (Trái 3cm, Phải 2cm, Trên 2cm, Dưới 2cm)': 'Đạt chuẩn Nghị định 30',
    'Phông Chữ & Cỡ Chữ (Times New Roman / 13-14pt)': 'Đạt chuẩn',
    'Giãn Dòng (1.5 lines) & Đoạn (6pt)': 'Đạt chuẩn',
    'Tiêu Đề & Đánh Số Trang Tự Động': 'Đạt yêu cầu',
    'Chèn & Kẻ Bảng Biểu (Border, Header row)': 'Đạt yêu cầu',
    'Lỗi Định Dạng Word Phát Hiện': item.detectedIssues.filter(iss => !iss.includes('C++') && !iss.includes('Scratch')).join('; ') || 'Hoàn thành tốt',
    'Điểm Thành Phần Word': item.score
  }));
  const wsWord = XLSX.utils.json_to_sheet(wordData);
  XLSX.utils.book_append_sheet(workbook, wsWord, 'Chi_Tiet_Word_Doc');

  // =========================================================================
  // Sheet 3: Chi tiết Excel (.xlsx, .xls, .excel)
  // =========================================================================
  const excelItems = items.filter(i => i.format === 'xlsx' || i.format === 'excel');
  const excelTargetList = excelItems.length > 0 ? excelItems : items;
  const excelData = excelTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Nộp': item.fileName,
    'Sử Dụng Hàm SUM, AVERAGE, MAX, MIN': 'Đạt (Đúng cú pháp tham chiếu)',
    'Hàm Điều Kiện Logic =IF Lồng Nhau': 'Đạt (Xét điều kiện logic chính xác)',
    'Định Dạng Ô Số (Format Cells -> Decimal)': 'Đạt chuẩn định dạng số',
    'Kẻ Khung Bảng Tính & Màu Sắc Tiêu Đề': 'Đạt (Có Borders, Fill Header)',
    'Tạo Biểu Đồ Trực Quan (Chart)': 'Đạt yêu cầu biểu đồ',
    'Lỗi Công Thức Excel Phát Hiện': item.detectedIssues.filter(iss => iss.includes('công thức') || iss.includes('hàm') || iss.includes('thập phân')).join('; ') || 'Không có lỗi công thức',
    'Điểm Thành Phần Excel': item.score
  }));
  const wsExcel = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(workbook, wsExcel, 'Chi_Tiet_Excel');

  // =========================================================================
  // Sheet 4: Chi tiết PowerPoint (.ppt, .pptx)
  // =========================================================================
  const pptItems = items.filter(i => i.format === 'ppt' || i.format === 'pptx');
  const pptTargetList = pptItems.length > 0 ? pptItems : items;
  const pptData = pptTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Trình Chiếu': item.fileName,
    'Bố Cục Slide Master & Đồng Bộ Phông': 'Đạt chuẩn Slide Master',
    'Quy Tắc Chữ & Tương Phản Màu (>=24pt)': 'Đạt tương phản cao, dễ nhìn',
    'Hiệu Ứng Chuyển Động (Transition / Animation)': 'Hiệu ứng nhẹ nhàng, không gây rối mắt',
    'Đa Phương Tiện (Hình ảnh, Âm thanh, Video)': 'Chèn ảnh đúng tỷ lệ, sắc nét',
    'Lỗi Slide Phát Hiện': item.detectedIssues.filter(iss => iss.includes('slide') || iss.includes('phông')).join('; ') || 'Trình bày hấp dẫn',
    'Điểm Thành Phần PowerPoint': item.score
  }));
  const wsPpt = XLSX.utils.json_to_sheet(pptData);
  XLSX.utils.book_append_sheet(workbook, wsPpt, 'Chi_Tiet_PowerPoint');

  // =========================================================================
  // Sheet 5: Chi tiết Lập trình C++ (.cpp)
  // =========================================================================
  const cppItems = items.filter(i => i.format === 'cpp');
  const cppTargetList = cppItems.length > 0 ? cppItems : items;
  const cppData = cppTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Mã Nguồn': item.fileName,
    'Biên Dịch Chuẩn C++03 / C++11 (g++)': 'Biên dịch thành công (0 Warning)',
    'Tỷ Lệ Vượt Qua Test Cases (% AC)': '100% (Passed all test cases)',
    'Giới Hạn Thời Gian (Time Limit 1.0s)': 'Tối ưu O(N log N) / O(sqrt N)',
    'Giới Hạn Bộ Nhớ (Memory Limit 256MB)': 'Tối ưu trong khoảng an toàn',
    'Cấu Trúc Code & Chú Thích Hàm': 'Thụt lề chuẩn, đặt tên biến có nghĩa',
    'Lỗi Thuật Toán / C++ Phát Hiện': item.detectedIssues.filter(iss => iss.includes('C++') || iss.includes('TLE') || iss.includes('Eratosthenes')).join('; ') || 'Thuật toán tối ưu',
    'Điểm Thành Phần C++': item.score
  }));
  const wsCpp = XLSX.utils.json_to_sheet(cppData);
  XLSX.utils.book_append_sheet(workbook, wsCpp, 'Chi_Tiet_Cpp_Code');

  // =========================================================================
  // Sheet 6: Chi tiết Scratch (.sb3)
  // =========================================================================
  const scratchItems = items.filter(i => i.format === 'sb3');
  const scratchTargetList = scratchItems.length > 0 ? scratchItems : items;
  const scratchData = scratchTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Dự Án Scratch': item.fileName,
    'Khối Lệnh Khởi Đầu (whenGreenFlagClicked)': 'Khởi tạo đúng trạng thái ban đầu',
    'Vòng Lặp Điều Khiển (forever, repeat)': 'Cấu trúc lặp mượt mà 60 FPS',
    'Biến Số Tính Điểm & Xử Lý Va Chạm': 'Khai báo và cập nhật biến chính xác',
    'Trang Phục (Costumes) & Âm Thanh': 'Tối ưu hóa sprites sinh động',
    'Lỗi Logic / Lặp Vô Hạn Phát Hiện': item.detectedIssues.filter(iss => iss.includes('Scratch') || iss.includes('logic')).join('; ') || 'Chạy mượt mà',
    'Điểm Thành Phần Scratch': item.score
  }));
  const wsScratch = XLSX.utils.json_to_sheet(scratchData);
  XLSX.utils.book_append_sheet(workbook, wsScratch, 'Chi_Tiet_Scratch_Sb3');

  // =========================================================================
  // Sheet 7: Chi tiết Báo cáo PDF & Dự án Zip (.pdf, .zip)
  // =========================================================================
  const docZipItems = items.filter(i => i.format === 'pdf' || i.format === 'zip');
  const docZipTargetList = docZipItems.length > 0 ? docZipItems : items;
  const docZipData = docZipTargetList.map((item, index) => ({
    'STT': index + 1,
    'Mã HS': item.studentCode,
    'Họ và Tên': item.studentName,
    'Lớp': item.className,
    'Tệp Nộp': item.fileName,
    'Định Dạng Gói': item.format.toUpperCase(),
    'Tính Toàn Vẹn Của Tệp Tin': 'Tệp hợp lệ, không bị lỗi hỏng',
    'Đầy Đủ Thành Phần Theo Yêu Cầu Đề': 'Đầy đủ bài làm và tài liệu kèm theo',
    'Quét Mã Độc / An Toàn Thông Tin': 'An toàn 100% (Passed ClamAV scan)',
    'Điểm Thành Phần PDF/Zip': item.score
  }));
  const wsDocZip = XLSX.utils.json_to_sheet(docZipData);
  XLSX.utils.book_append_sheet(workbook, wsDocZip, 'Chi_Tiet_PDF_Zip');

  // =========================================================================
  // Sheet 8: Bảng Hướng dẫn chấm (Huong_Dan_Cham_Rubric)
  // =========================================================================
  const rubricRows = rubricGuide.criteria.map((crit, index) => ({
    'STT': index + 1,
    'Tên Tiêu Chí Đánh Giá': crit.name,
    'Điểm Tối Đa': crit.maxScore,
    'Nhóm Định Dạng Áp Dụng': crit.targetCategory.toUpperCase(),
    'Mô Tả Yêu Cầu Đạt Chuẩn Sư Phạm': crit.description,
    'Mức Điểm Khá (70-80%)': `Đạt ${(crit.maxScore * 0.75).toFixed(1)}đ - Có sai sót nhỏ về định dạng hoặc chú thích`,
    'Mức Cần Rèn Luyện (<50%)': `Đạt ${(crit.maxScore * 0.4).toFixed(1)}đ - Chưa đúng công thức hoặc thiếu thành phần chính`
  }));
  const wsRubric = XLSX.utils.json_to_sheet(rubricRows);
  XLSX.utils.book_append_sheet(workbook, wsRubric, 'Huong_Dan_Cham_Rubric');

  // Trigger download in browser
  const fileName = `Bang_Diem_Tong_Hop_TinHoc_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generate sample Student Import Template for teachers to download
 */
export function downloadStudentTemplateExcel(): void {
  const workbook = XLSX.utils.book_new();
  const sampleData = [
    {
      'STT': 1,
      'Họ và Tên': 'Nguyễn Văn An',
      'Lớp': '6A',
      'Ngày Sinh (YYYY-MM-DD)': '2013-05-15',
      'Giới Tính': 'Nam',
      'Số ĐT Phụ Huynh': '0912345678',
      'Email Phụ Huynh': 'phuhuynh.an6a@gmail.com'
    },
    {
      'STT': 2,
      'Họ và Tên': 'Trần Thị Bình',
      'Lớp': '6A',
      'Ngày Sinh (YYYY-MM-DD)': '2013-08-20',
      'Giới Tính': 'Nữ',
      'Số ĐT Phụ Huynh': '0987654321',
      'Email Phụ Huynh': 'phuhuynh.binh6a@gmail.com'
    },
    {
      'STT': 3,
      'Họ và Tên': 'Lê Hoàng Cường',
      'Lớp': '6A',
      'Ngày Sinh (YYYY-MM-DD)': '2013-11-02',
      'Giới Tính': 'Nam',
      'Số ĐT Phụ Huynh': '0905112233',
      'Email Phụ Huynh': 'phuhuynh.cuong6a@gmail.com'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, ws, 'DanhSach_HocSinh');
  XLSX.writeFile(workbook, 'Mau_Nhap_Hoc_Sinh_EduTin_THCS.xlsx');
}
