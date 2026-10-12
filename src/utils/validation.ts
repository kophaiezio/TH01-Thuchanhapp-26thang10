export type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
};

export type ProfileFormErrors = Partial<Record<keyof ProfileForm, string>>;

export function validateProfile(form: ProfileForm): ProfileFormErrors {
  const fullName = form.fullName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const errors: ProfileFormErrors = {};

  if (!fullName) {
    errors.fullName = 'Vui lòng nhập họ và tên.';
  }

  if (!email) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Email không đúng định dạng (ví dụ: ten@domain.com).';
  }

  if (!phone) {
    errors.phone = 'Vui lòng nhập số điện thoại.';
  } else if (!/^\d{9,11}$/.test(phone)) {
    errors.phone = 'Số điện thoại chỉ gồm 9–11 chữ số.';
  }

  return errors;
}
