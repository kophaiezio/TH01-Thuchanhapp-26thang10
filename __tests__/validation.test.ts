import {validateProfile} from '../src/utils/validation';

describe('validateProfile', () => {
  test('accepts trimmed, valid profile values', () => {
    expect(
      validateProfile({
        fullName: '  Nguyễn Minh Anh  ',
        email: '  minhanh@example.edu.vn  ',
        phone: '0912345678',
      }),
    ).toEqual({});
  });

  test('reports required fields and invalid email and phone', () => {
    expect(
      validateProfile({fullName: ' ', email: 'not-an-email', phone: '123-456'}),
    ).toEqual({
      fullName: 'Vui lòng nhập họ và tên.',
      email: 'Email không đúng định dạng (ví dụ: ten@domain.com).',
      phone: 'Số điện thoại chỉ gồm 9–11 chữ số.',
    });
  });
});
