"use client";

import { Product } from "@/model/product";
import { useState } from "react";

const ImageDetail = ({ product }: { product: Product }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [show, setShow] = useState(false);
  return (
    <div>
      <img
        src={product?.image?.split(",")[selectedImg]}
        alt={product?.name}
        onClick={() => {
          setShow(true);
        }}
        className="main-img"
      />
      <div className="list-img">
        {product?.image?.split(",").map((img) => (
          <img
            src={img}
            alt={product?.name}
            className={product?.image?.split(",").indexOf(img) === selectedImg ? "selected" : ""}
            onClick={() => setSelectedImg(product?.image?.split(",").indexOf(img))}
            key={img}
          />
        ))}
      </div>
      {show && (
        <div
          className="modal"
          onClick={() => {
            setShow(false);
          }}
        >
          <img src={product?.image?.split(",")[selectedImg]} alt={product?.name} />
        </div>
      )}
    </div>
  );
};

export default ImageDetail;
