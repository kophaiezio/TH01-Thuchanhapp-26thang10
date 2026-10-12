import type {Assignment, ScheduleSession, Student, Subject} from '../types';

export const initialStudent: Student = {
  studentId: 'B23DCCC147',
  fullName: 'Đoàn Ngọc Thắng',
  className: 'B23CCPM02',
  major: 'Công nghệ thông tin-UDU',
  email: 'ThangDN.b23cc147@stu.ptit.edu.vn',
  phone: '0911093289',
};

export const initialSubjects: Subject[] = [
  {
    id: 'subject-business-analysis',
    code: 'BA201',
    name: 'Phân tích nghiệp vụ',
    credits: 3,
    room: 'A201',
    color: '#5266D8',
    description:
      'Phân tích yêu cầu, mô hình hóa quy trình nghiệp vụ và xây dựng tài liệu đặc tả cho hệ thống phần mềm.',
  },
  {
    id: 'subject-application-development',
    code: 'AD202',
    name: 'Phát triển ứng dụng',
    credits: 4,
    room: 'B305',
    color: '#1D9B84',
    description:
      'Thực hành phân tích, xây dựng giao diện và triển khai ứng dụng trên các nền tảng phổ biến.',
  },
  {
    id: 'subject-advanced-web-programming',
    code: 'WEB301',
    name: 'Lập trình web nâng cao',
    credits: 3,
    room: 'C205',
    color: '#DA8A32',
    description:
      'Xây dựng ứng dụng web hiện đại với React, quản lý trạng thái, định tuyến và tích hợp dịch vụ dữ liệu.',
  },
  {
    id: 'subject-vietnamese-communist-party-history',
    code: 'HIS101',
    name: 'Lịch sử Đảng cộng sản Việt Nam',
    credits: 3,
    room: 'D204',
    color: '#C45478',
    description:
      'Tìm hiểu các dấu mốc, đường lối và vai trò lãnh đạo của Đảng Cộng sản Việt Nam qua các thời kỳ.',
  },
  {
    id: 'subject-service-oriented-development',
    code: 'SOA302',
    name: 'Phát triển phần mềm hướng dịch vụ',
    credits: 3,
    room: 'A304',
    color: '#3886C5',
    description:
      'Thiết kế các dịch vụ phần mềm độc lập, giao tiếp qua API và tích hợp theo kiến trúc hướng dịch vụ.',
  },
  {
    id: 'subject-software-quality-assurance',
    code: 'QA301',
    name: 'Đảm bảo chất lượng phần mềm',
    credits: 3,
    room: 'B204',
    color: '#8060B5',
    description:
      'Lập kế hoạch chất lượng, thiết kế ca kiểm thử, theo dõi lỗi và đánh giá chất lượng sản phẩm phần mềm.',
  },
  {
    id: 'subject-web-programming',
    code: 'WEB201',
    name: 'Lập trình web',
    credits: 3,
    room: 'C102',
    color: '#2396A6',
    description:
      'Xây dựng website với HTML, CSS, JavaScript và các nguyên tắc thiết kế giao diện web.',
  },
];

export const initialSchedule: ScheduleSession[] = [
  {
    id: 'session-mon-business-analysis',
    subjectId: 'subject-business-analysis',
    day: 'Thứ Hai',
    startTime: '07:30',
    endTime: '09:30',
    room: 'A201',
    topic: 'Thu thập và phân tích yêu cầu',
  },
  {
    id: 'session-mon-web-programming',
    subjectId: 'subject-web-programming',
    day: 'Thứ Hai',
    startTime: '13:00',
    endTime: '15:00',
    room: 'C102',
    topic: 'Cấu trúc trang web với HTML và CSS',
  },
  {
    id: 'session-tue-application-development',
    subjectId: 'subject-application-development',
    day: 'Thứ Ba',
    startTime: '09:30',
    endTime: '11:30',
    room: 'B305',
    topic: 'Thiết kế và xây dựng ứng dụng',
  },
  {
    id: 'session-wed-history',
    subjectId: 'subject-vietnamese-communist-party-history',
    day: 'Thứ Tư',
    startTime: '13:00',
    endTime: '15:00',
    room: 'D204',
    topic: 'Đảng lãnh đạo cuộc kháng chiến giành độc lập',
  },
  {
    id: 'session-thu-service-development',
    subjectId: 'subject-service-oriented-development',
    day: 'Thứ Năm',
    startTime: '07:30',
    endTime: '10:30',
    room: 'A304',
    topic: 'Kiến trúc phần mềm hướng dịch vụ',
  },
  {
    id: 'session-fri-advanced-web',
    subjectId: 'subject-advanced-web-programming',
    day: 'Thứ Sáu',
    startTime: '07:30',
    endTime: '09:30',
    room: 'C205',
    topic: 'Ứng dụng React và quản lý trạng thái',
  },
  {
    id: 'session-fri-quality-assurance',
    subjectId: 'subject-software-quality-assurance',
    day: 'Thứ Sáu',
    startTime: '13:00',
    endTime: '15:00',
    room: 'B204',
    topic: 'Thiết kế và thực hiện kiểm thử phần mềm',
  },
];

function dateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 0, 0);
  return date.toISOString();
}

export const initialAssignments: Assignment[] = [
  {
    id: 'assignment-business-analysis-01',
    subjectId: 'subject-business-analysis',
    title: 'Đặc tả yêu cầu ứng dụng quản lý học tập',
    description:
      'Thu thập yêu cầu của người dùng, lập sơ đồ use case và viết tài liệu đặc tả cho ứng dụng quản lý học tập.',
    dueAt: dateAfterDays(1),
    completed: false,
  },
  {
    id: 'assignment-application-development-01',
    subjectId: 'subject-application-development',
    title: 'Xây dựng ứng dụng quản lý công việc',
    description:
      'Xây dựng ứng dụng có màn hình danh sách công việc, chức năng thêm và cập nhật trạng thái hoàn thành.',
    dueAt: dateAfterDays(2),
    completed: false,
  },
  {
    id: 'assignment-advanced-web-01',
    subjectId: 'subject-advanced-web-programming',
    title: 'Xây dựng dashboard bằng React',
    description:
      'Xây dựng dashboard có nhiều trang, quản lý trạng thái và hiển thị dữ liệu từ dịch vụ web.',
    dueAt: dateAfterDays(4),
    completed: false,
  },
  {
    id: 'assignment-history-01',
    subjectId: 'subject-vietnamese-communist-party-history',
    title: 'Tiểu luận về một dấu mốc lịch sử',
    description:
      'Chọn một dấu mốc trong lịch sử Đảng Cộng sản Việt Nam, trình bày bối cảnh, diễn biến và ý nghĩa.',
    dueAt: dateAfterDays(6),
    completed: false,
  },
  {
    id: 'assignment-service-development-01',
    subjectId: 'subject-service-oriented-development',
    title: 'Thiết kế REST API cho ứng dụng đặt lịch',
    description:
      'Thiết kế các endpoint REST cho ứng dụng đặt lịch, xác định phương thức HTTP và cấu trúc dữ liệu trả về.',
    dueAt: dateAfterDays(8),
    completed: true,
  },
  {
    id: 'assignment-quality-assurance-01',
    subjectId: 'subject-software-quality-assurance',
    title: 'Lập kế hoạch kiểm thử chức năng',
    description:
      'Viết các trường hợp kiểm thử cho luồng đăng nhập, đăng ký và cập nhật thông tin người dùng.',
    dueAt: dateAfterDays(10),
    completed: false,
  },
  {
    id: 'assignment-web-programming-01',
    subjectId: 'subject-web-programming',
    title: 'Xây dựng website giới thiệu cá nhân',
    description:
      'Tạo website responsive gồm phần giới thiệu, kỹ năng và thông tin liên hệ bằng HTML, CSS và JavaScript.',
    dueAt: dateAfterDays(12),
    completed: false,
  },
];
