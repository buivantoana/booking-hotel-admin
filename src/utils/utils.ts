import CryptoJS from "crypto-js";
import { Dayjs } from "dayjs";

export const formatDateWithTimezone = (date: Dayjs) => {
  return date.format("YYYY-MM-DDTHH:mm:ssZ").replace("+", "%2B");
};

// Hàm sắp xếp object theo thứ tự key tăng dần
function sortObjectByKeys(obj: Record<string, any>) {
  return Object.keys(obj)
    .sort()
    .reduce((sortedObj: Record<string, any>, key) => {
      sortedObj[key] = obj[key];
      return sortedObj;
    }, {});
}

// Hàm tạo chữ ký
export function createSimpleHash(body: any) {
  // Bước 1: Sắp xếp body theo thứ tự key tăng dần
  const sortedBody = sortObjectByKeys(body);
  console.log(sortedBody);
  // Bước 2: Chuyển đổi body đã sắp xếp thành chuỗi JSON
  const jsonBody = JSON.stringify(body);

  // Bước 3: Tạo hash SHA-256 mà không cần secret key
  const hash = CryptoJS.SHA256(jsonBody).toString(CryptoJS.enc.Hex);

  return hash;
}

export function limitDescription(description: any, maxLength: any) {
  if (description.length <= maxLength) {
    return description;
  } else {
    return description.slice(0, maxLength) + "...";
  }
}

export const calculateProgress = (data: any) => {
  return data.map((course: any) => {
    let totalSubLessons = 0;
    let completedSubLessons = 0;

    course.lesson_progress.forEach((lesson: any) => {
      lesson.sub_lesson.forEach((subLesson: any) => {
        totalSubLessons++;
        if (
          (subLesson.completed == true && subLesson.result == true) ||
          (subLesson.completed === true && subLesson.result === false)
        ) {
          completedSubLessons++;
        }
      });
    });

    const progressPercentage = (completedSubLessons / totalSubLessons) * 100;
    return Math.ceil(progressPercentage);
  });
};
export function convertToVND(amount: any) {
  // Chuyển đổi số tiền thành chuỗi và thêm dấu phân tách hàng nghìn
  let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Thêm ký hiệu tiền tệ "₫" vào cuối
  return formattedAmount + " ₫";
}

export function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng được tính từ 0-11, cần cộng thêm 1
  const year = today.getFullYear();

  return `Hà Nội,${day}/${month}/${year}`;
}

export function roundToOneDecimal(num: any) {
  return parseFloat(num.toFixed(1));
}
export const getStartOfMonth = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Lấy ngày, tháng, năm cụ thể
  const day = startOfMonth.getDate();
  const month = startOfMonth.getMonth() + 1; // Tháng bắt đầu từ 0, cần phải cộng thêm 1
  const year = startOfMonth.getFullYear();

  // Chuyển định dạng ngày, tháng, năm thành chuỗi
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

export function calculateTimeAgoString(
  pastDate: Date,
  currentDate: Date = new Date()
): string {
  const timeDifference = currentDate.getTime() - pastDate.getTime();

  // Chuyển milliseconds thành các đơn vị thời gian
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} năm trước`;
  } else if (months > 0) {
    return `${months} tháng trước`;
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
}
export function formattedDateHHMMDDMMYYYY(data) {
  const date = new Date(data);

  const formatted = date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
  return formatted;
}

// src/utils/createHotelValidation.ts
export const validateBasicInfo = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data?.hotelName?.trim()) {
    errors.hotelName = "Vui lòng nhập tên khách sạn";
  }

  if (!data?.phone?.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^0\d{9}$/.test(data.phone.replace(/\D/g, ""))) {
    errors.phone = "Số điện thoại phải có 10 số, bắt đầu bằng 0";
  }

  // Phải có ít nhất 1 khung giờ kinh doanh
  const hasHourly = data?.hourlyStart && data?.hourlyEnd;
  const hasOvernight = data?.overnightStart && data?.overnightEnd;
  const hasDaily = data?.dailyStart && data?.dailyEnd;

  if (!hasHourly && !hasOvernight && !hasDaily) {
    errors.businessHours = "Vui lòng chọn ít nhất một khung giờ kinh doanh";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateImageUpload = (data: any) => {
  const errors: Record<string, string> = {};

  const outsideCount = (data?.outsideImages || []).length;
  const hotelCount = (data?.hotelImages || []).length;

  if (outsideCount === 0) {
    errors.outsideImages = "Vui lòng tải lên ít nhất 1 ảnh biển hiệu bên ngoài";
  }

  if (hotelCount < 5) {
    errors.hotelImages = `Vui lòng tải lên ít nhất 5 ảnh khách sạn (hiện tại: ${hotelCount})`;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// src/utils/createHotelValidation.ts

export const validateLocation = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data?.selectedProvince) {
    errors.selectedProvince = "Vui lòng chọn Tỉnh/Thành phố";
  }

  if (!data?.selectedDistrict) {
    errors.selectedDistrict = "Vui lòng chọn Quận/Huyện";
  }

  if (!data?.address?.trim()) {
    errors.address = "Vui lòng nhập địa chỉ chi tiết (số nhà, tên đường...)";
  }

  if (!data?.center?.lat || !data?.center?.lng) {
    errors.map = "Vui lòng chọn vị trí khách sạn trên bản đồ";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// src/utils/createHotelValidation.ts

export const validateRoomTypes = (data: any) => {
  const errors: Record<string, string> = {};
  const roomTypes = data?.roomTypes || [];

  if (roomTypes.length === 0) {
    errors.roomTypes = "Vui lòng thêm ít nhất một loại phòng";
    return { errors, isValid: false };
  }

  // Validate từng loại phòng
  roomTypes.forEach((room: any, index: number) => {
    if (!room?.name?.trim()) {
      errors[`room_${index}_name`] = `Loại phòng ${
        index + 1
      }: Vui lòng nhập tên loại phòng`;
    }
    if (
      !room?.quantity?.trim() ||
      isNaN(parseInt(room.quantity)) ||
      parseInt(room.quantity) <= 0
    ) {
      errors[`room_${index}_quantity`] = `Loại phòng ${
        index + 1
      }: Vui lòng nhập số lượng phòng hợp lệ (số nguyên > 0)`;
    }
    if (
      !room?.area?.trim() ||
      isNaN(parseFloat(room.area)) ||
      parseFloat(room.area) <= 0
    ) {
      errors[`room_${index}_area`] = `Loại phòng ${
        index + 1
      }: Vui lòng nhập diện tích phòng hợp lệ (số > 0)`;
    }
    if (!room?.bedType) {
      errors[`room_${index}_bedType`] = `Loại phòng ${
        index + 1
      }: Vui lòng chọn loại giường`;
    }
    if (!room?.direction) {
      errors[`room_${index}_direction`] = `Loại phòng ${
        index + 1
      }: Vui lòng chọn hướng phòng`;
    }
    if (!room?.description?.trim()) {
      errors[`room_${index}_description`] = `Loại phòng ${
        index + 1
      }: Vui lòng nhập mô tả phòng`;
    }
    if ((room?.images || []).length < 3) {
      errors[`room_${index}_images`] = `Loại phòng ${
        index + 1
      }: Vui lòng tải lên ít nhất 3 ảnh phòng`;
    }

    // Pricing: phải có ít nhất 1 loại kinh doanh enabled và có giá hợp lệ
    const pricing = room?.pricing || {};
    const hasValidPricing =
      (pricing.hourly?.enabled &&
        pricing.hourly.firstHours?.trim() &&
        pricing.hourly.extraHour?.trim() &&
        pricing.hourly.maxHours) ||
      (pricing.overnight?.enabled && pricing.overnight.price?.trim()) ||
      (pricing.daily?.enabled && pricing.daily.price?.trim());

    if (!hasValidPricing) {
      errors[`room_${index}_pricing`] = `Loại phòng ${
        index + 1
      }: Vui lòng thiết lập ít nhất một loại giá phòng hợp lệ (theo giờ, qua đêm hoặc theo ngày)`;
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const list_banks = [
  { name: "VietcomBank", code: "vcb" },
  { name: "VietinBank", code: "ctg" },
  { name: "Techcombank", code: "tcb" },
  { name: "BIDV", code: "bidv" },
  { name: "AgriBank", code: "varb" },
  { name: "Navibank", code: "nvb" },
  { name: "Sacombank", code: "stb" },
  { name: "ACB", code: "acb" },
  { name: "MBBank", code: "mb" },
  { name: "TPBank", code: "tpb" },
  { name: "Shinhan Bank", code: "svb" },
  { name: "VIB Bank", code: "vib" },
  { name: "VPBank", code: "vpb" },
  { name: "SHB", code: "shb" },
  { name: "Eximbank", code: "eib" },
  { name: "BaoVietBank", code: "bvb" },
  { name: "VietcapitalBank", code: "vccb" },
  { name: "SCB", code: "scb" },
  { name: "VietNam - Russia Bank", code: "vrb" },
  { name: "ABBank", code: "abb" },
  { name: "PVCombank", code: "pvcb" },
  { name: "MBV", code: "mbv" },
  { name: "NamA Bank", code: "nab" },
  { name: "HDBank", code: "hdb" },
  { name: "VietBank", code: "vb" },
  { name: "VietCredit", code: "cfc" },
  { name: "Public Bank", code: "pbvn" },
  { name: "Hong Leong Bank", code: "hlb" },
  { name: "PG Bank", code: "pgb" },
  { name: "Co.op Bank", code: "cob" },
  { name: "CIMB", code: "cimb" },
  { name: "Indovina", code: "ivb" },
  { name: "Vikki Digital Bank", code: "vikki" },
  { name: "GPBank", code: "gpb" },
  { name: "BacABank", code: "nasb" },
  { name: "VietABank", code: "vab" },
  { name: "SaigonBank", code: "sgb" },
  { name: "MSB", code: "msb" },
  { name: "LPBank", code: "lpb" },
  { name: "KienLongBank", code: "klb" },
  { name: "IBK - Ha Noi", code: "ibkhn" },
  { name: "IBK - TP.HCM", code: "ibkhcm" },
  { name: "Woori Bank", code: "woo" },
  { name: "SeABank", code: "seab" },
  { name: "UOB", code: "uob" },
  { name: "OCB", code: "ocb" },
  { name: "Mirae Asset", code: "mafc" },
  { name: "Keb Hana - Ho Chi Minh", code: "kebhanahcm" },
  { name: "Keb Hana - Ha Noi", code: "kebhanahn" },
  { name: "Standard Chartered", code: "standard" },
  { name: "CAKE", code: "cake" },
  { name: "Ubank", code: "ubank" },
  { name: "Nonghyup Bank - HN", code: "nonghyupbankhn" },
  { name: "Kookmin - HN", code: "kbhn" },
  { name: "Kookmin - HCM", code: "kbhcm" },
  { name: "DBS - HCM", code: "dbs" },
  { name: "CBBank", code: "cbb" },
  { name: "KBank - HCM", code: "kbankhcm" },
  { name: "HSBC", code: "hsbc" },
  { name: "Timo", code: "timo" },
  { name: "CITI", code: "citi" },
  { name: "VNPT Money", code: "vnptmoney" },
  { name: "Viettel Money", code: "vtlmoney" },
  { name: "VBSP", code: "vbsp" },
  { name: "PVcomBank Pay", code: "pvcombankpay" },
  { name: "BNP PARIBAS HN", code: "bnpparibashn" },
  { name: "BNP PARIBAS HCM", code: "bnpparibashcm" },
  { name: "Cathay - HCM", code: "cubhcm" },
  { name: "BIDC", code: "bidc" },
  { name: "Tài chính Shinhan", code: "svfc" },
  { name: "Bank of China (HK) - HCM", code: "bochk" },
  { name: "Vikki by HDBank", code: "vikkihdbank" },
  { name: "Umee", code: "umee" },
  { name: "Liobank", code: "liobank" },
];

export  const parseRoomName = (name?: string) => {
  if (!name) return "Không có tên";

  try {
    const parsed = JSON.parse(name);
    return parsed?.vi || parsed?.en || "Không có tên";
  } catch {
    // name là plain text (ví dụ: "Suite")
    return name;
  }
};