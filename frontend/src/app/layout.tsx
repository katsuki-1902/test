import { Category } from "@/model/category";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Header from "@/components/header";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  manifest: process.env.NEXT_PUBLIC_MANIFEST,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories: Category[] = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/categories?isActive=true`, {
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });
  return (
    <html lang="vi">
      <body className={inter.className}>
        <header>
          <Header />
          <nav>
            <ul>
              <label className="x" htmlFor="menu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  version="1.1"
                  id="Layer_1"
                  width="800px"
                  height="800px"
                  viewBox="0 0 70 70"
                  enableBackground="new 0 0 70 70"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path d="M18.041,14.021c1.013,0,2.021,0.385,2.79,1.153l14.196,14.142l14.142-14.142c0.77-0.769,1.778-1.152,2.791-1.152    c1.024,0,2.053,0.394,2.839,1.18c1.563,1.562,1.574,4.082,0.027,5.63L40.685,34.973l14.142,14.196    c1.547,1.547,1.535,4.068-0.026,5.631c-0.785,0.785-1.813,1.178-2.839,1.178c-1.013,0-2.022-0.383-2.792-1.152L35.027,40.63    L20.831,54.825c-0.769,0.77-1.778,1.154-2.791,1.154c-1.024,0-2.054-0.395-2.839-1.18c-1.563-1.563-1.574-4.084-0.027-5.631    l14.197-14.196L15.174,20.831c-1.547-1.547-1.533-4.068,0.027-5.63C15.987,14.415,17.016,14.021,18.041,14.021 M18.041,10.021    L18.041,10.021c-2.138,0-4.151,0.835-5.667,2.351c-3.12,3.121-3.132,8.185-0.028,11.287l11.363,11.319L12.346,46.339    c-3.105,3.107-3.092,8.172,0.028,11.289c1.514,1.516,3.526,2.352,5.666,2.352c2.126,0,4.121-0.826,5.62-2.326l11.362-11.361    l11.313,11.355c1.505,1.504,3.5,2.33,5.626,2.33c2.138,0,4.15-0.834,5.666-2.35c3.12-3.121,3.132-8.184,0.027-11.287    L46.336,34.978L57.654,23.66c3.104-3.106,3.092-8.17-0.028-11.287c-1.514-1.516-3.526-2.351-5.666-2.351    c-2.124,0-4.119,0.825-5.618,2.323l-11.32,11.319L23.654,12.34C22.162,10.847,20.166,10.022,18.041,10.021L18.041,10.021z" />
                    </g>
                    <g>
                      <path d="M50.7,21.714c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2.121-2.121    c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2.121,2.121C51.212,21.617,50.956,21.714,50.7,21.714z" />
                    </g>
                    <g>
                      <path d="M40.801,31.614c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l7.07-7.07    c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-7.07,7.07C41.313,31.516,41.057,31.614,40.801,31.614z" />
                    </g>
                  </g>
                </svg>
              </label>
              <input type="checkbox" id="menu" />
              <li key={0}>
                <a href={`/`} className="home">
                  TRANG CHỦ
                </a>
              </li>
              {categories?.length > 0 &&
                categories.map((category) => (
                  <li key={category._id} className="category-item">
                    <label htmlFor={category.name}>{category.name}</label>
                    {category?.child?.length > 0 && (
                      <div className="category-child">
                        <input id={category.name} type="checkbox" />
                        {category.child?.map((child) => (
                          <a key={child._id} href={`/danh-muc/${child.slug}`}>
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </nav>
        </header>
        {children}
        <div className="contact-icon">
          <Link href="tel:0878985729" target="_blank">
            <Image src="/phone-icon.png" alt="phone" width={40} height={40} />
          </Link>
          <Link href="https://www.messenger.com/t/61552121156836" target="_blank">
            <Image src="/messenger-icon.png" alt="messenger" width={40} height={46} />
          </Link>
        </div>
        <footer>
          <div className="footer-center">
            <div className="box-footer-column">
              <h3 className="">Thông tin liên hệ:</h3>
              <ul className="footer-list-menu">
                <li className="footer-address"></li>
                <li className="fooer-phone">
                  <label className="mr5">Phone: </label>
                  <span>
                    <a href={`${process.env.NEXT_PUBLIC_HOTLINE}`}>{process.env.NEXT_PUBLIC_HOTLINE}</a>
                  </span>
                </li>
                <li className="footer-email">
                  <label className="mr5">Email: </label>
                  <span>{process.env.NEXT_PUBLIC_EMAIL}</span>
                </li>
              </ul>
            </div>

            <div className="box-footer-column">
              <h3 className="">Chính sách hỗ trợ:</h3>
              <ul className="footer-list-menu">
                <li>
                  <a href="/search" title="Tìm kiếm">
                    Tìm kiếm
                  </a>
                </li>

                <li>
                  <a href="/pages/about-us" title="Giới thiệu">
                    Giới thiệu
                  </a>
                </li>

                <li>
                  <a href="/pages/chinh-sach-doi-tra" title="Chính sách đổi trả">
                    Chính sách đổi trả
                  </a>
                </li>

                <li>
                  <a href="/pages/chinh-sach-bao-mat" title="Chính sách bảo mật">
                    Chính sách bảo mật
                  </a>
                </li>

                <li>
                  <a href="/pages/dieu-khoan-dich-vu" title="Điều khoản dịch vụ">
                    Điều khoản dịch vụ
                  </a>
                </li>
              </ul>
            </div>

            <div className="box-footer-column">
              <h3 className="">Thông tin liên kết:</h3>
              <div className="social">
                <ul className="footer-list-menu">
                  <li>Hãy kết nối với chúng tôi.</li>
                </ul>
              </div>
            </div>

            <div className="box-footer-column">
              <h3 className="">Theo dõi Fanpage chúng tôi để cập nhật xu hướng thời trang hot nhất:</h3>
              <div
                className="fb-page fb_iframe_widget"
                data-href="https://www.facebook.com/Vergency.vn"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
                fb-xfbml-state="rendered"
                fb-iframe-plugin-query="adapt_container_width=true&amp;app_id=&amp;container_width=263&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FVergency.vn&amp;locale=vi_VN&amp;sdk=joey&amp;show_facepile=true&amp;small_header=false"
              ></div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>©Bản quyền thuộc về {process.env.NEXT_PUBLIC_BRAND_NAME}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
