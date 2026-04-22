import React from "react";
import {
  WrapperFooter,
  FooterTop,
  FooterColumn,
  FooterTitle,
  FooterText,
  FooterBottom,
} from "./style";

const FooterComponent = () => {
  return (
    <WrapperFooter>
      {/* TOP */}
      <FooterTop>
        {/* COLUMN 1 */}
        <FooterColumn>
          <FooterTitle>NAN TEA</FooterTitle>
          <FooterText>Thương hiệu trà sữa chất lượng cao</FooterText>
          <FooterText>Uy tín - Ngon - Giá tốt</FooterText>
        </FooterColumn>

        {/* COLUMN 2 */}
        <FooterColumn>
          <FooterTitle>Hỗ trợ</FooterTitle>
          <FooterText>Chính sách đổi trả</FooterText>
          <FooterText>Chính sách bảo mật</FooterText>
          <FooterText>Hướng dẫn mua hàng</FooterText>
        </FooterColumn>

        {/* COLUMN 3 */}
        <FooterColumn>
          <FooterTitle>Liên hệ</FooterTitle>
          <FooterText>Email: trungvo4229@gmail.com</FooterText>
          <FooterText>Hotline: 0944 574 229</FooterText>
          <FooterText>Địa chỉ: Việt Nam</FooterText>
        </FooterColumn>

        {/* COLUMN 4 */}
        <FooterColumn>
          <FooterTitle>Theo dõi</FooterTitle>
          <a
            href="https://www.facebook.com/vo.ngoc.trung.679812"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FooterText>Facebook</FooterText>
          </a>
          <FooterText>Instagram</FooterText>
          <FooterText>TikTok</FooterText>
        </FooterColumn>
      </FooterTop>

      {/* BOTTOM */}
      <FooterBottom>© 2026 NgocTrung. All rights reserved.</FooterBottom>
    </WrapperFooter>
  );
};

export default FooterComponent;
