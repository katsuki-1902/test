"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [profile, setProfile] = useState(null);
  const pathName = usePathname();
  useEffect(() => {
    const profile = localStorage.getItem("PROFILE");
    if (profile) {
      setProfile(JSON.parse(profile));
    }
  }, [pathName]);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  return (
    <header>
      <label htmlFor="menu" className={`x ${showSearchBar ? "x-mobile" : ""}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="800px" height="800px" viewBox="0 -2 28 28">
          <path d="m2.61 0h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
          <path d="m2.61 9.39h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
          <path d="m2.61 18.781h22.431c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-22.431c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z" />
        </svg>
      </label>
      <div className={`header ${showSearchBar ? "header-active" : ""}`}>
        <h1>
          <a href="/">{process.env.NEXT_PUBLIC_BRAND_NAME}</a>
        </h1>
        <div className="user">
          <div className="search-overlay">
            <input
              type="text"
              id="search"
              className={`search-input ${showSearchBar ? "search-input-active" : ""}`}
              placeholder="Tìm kiếm sản phẩm"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue !== "") {
                  window.location.href = `/search?key=${searchValue}`;
                }
              }}
            />
            <a
              className={`search ${showSearchBar ? "" : "search-active"}`}
              onClick={(e) => {
                if (searchValue === "") {
                  e.preventDefault();
                }

                setShowSearchBar(!showSearchBar);
                document.getElementById("search")?.focus();
              }}
              href={`/search?key=${searchValue}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <a href={"/gio-hang"} className="cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
              <path
                d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
              <path
                d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
            </svg>

            <div className="cart-count"></div>
          </a>
          <a href={profile ? "/profile" : "/dang-nhap"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="#000000"
              version="1.1"
              id="Layer_1"
              width="800px"
              height="800px"
              viewBox="796 796 200 200"
              enableBackground="new 796 796 200 200"
              xmlSpace="preserve"
            >
              <g>
                <path d="M896.003,827.425c-20.538,0-37.187,19.66-37.187,43.921c0,24.258,16.648,43.924,37.187,43.924s37.188-19.667,37.188-43.924   C933.191,847.085,916.541,827.425,896.003,827.425z" />
                <path d="M896,796c-55.141,0-100,44.859-100,99.999C796.001,951.14,840.86,996,896,996c55.139,0,99.999-44.86,99.999-100.001   C995.999,840.859,951.14,796,896,796z M962.014,953.885c-0.029-0.111-0.044-0.223-0.075-0.333   c-4.735-16.523-15.472-30.494-29.687-39.455c-2.805-1.768-6.442-1.48-8.931,0.71c-7.63,6.719-17.069,10.72-27.319,10.72   c-10.45,0-20.061-4.156-27.767-11.113c-2.46-2.222-6.082-2.556-8.91-0.829c-14.407,8.797-25.353,22.689-30.299,39.192   c-13.012-15.325-20.887-35.145-20.887-56.777c0-48.446,39.414-87.86,87.86-87.86c48.445,0,87.859,39.414,87.859,87.86   C983.859,918.159,975.597,938.412,962.014,953.885z" />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
export default Header;
