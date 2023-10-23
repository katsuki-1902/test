import AddToCart from "@/components/addToCart";
import ImageDetail from "@/components/imageDetail";
import ProductItem from "@/components/productItem";
import { Product } from "@/model/product";
import { formatNumberWithCommas } from "@/utils/formatMoney";
import Link from "next/link";
const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  const product: Product = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/${params.slug}`, {
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  const productsSameCategory: Product[] = product?.category?.slug
    ? await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/category/${product?.category?.slug}?limit=4`, {
        next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return [];
        })
    : [];
  return (
    <div className="product-page">
      <div className="product-content">
        <ImageDetail product={product} />
        <div className="product-detail">
          <h1>{product?.name}</h1>
          <p className="price">{formatNumberWithCommas(product?.price)} đ</p>
          <AddToCart product={product} />
        </div>
      </div>
      <div className="description">
        <div className="detail-description">
          <h2>Mô tả:</h2>
          {product?.description && (
            <div dangerouslySetInnerHTML={{ __html: `<div>${product?.description}</div>` }}></div>
          )}
        </div>
        <div className="related">
          <h3>Sản phẩm cùng danh mục</h3>
          {productsSameCategory.map((product) => (
            <a href={`/san-pham/${product?.slug}`} title={product?.name} key={product?._id} className="related-item">
              <img src={product?.image.split(",")[0]} alt={product?.name} />
              <div>
                <h2>{product?.name}</h2>
                <span>
                  {formatNumberWithCommas(product?.price)} đ <del>{formatNumberWithCommas(product?.price * 1.2)} đ</del>
                </span>
              </div>
            </a>
          ))}
          <a href={`/danh-muc/${product?.category?.slug}`}>Xem thêm</a>
        </div>
        <div className="mobile-related">
          {productsSameCategory.map((product) => (
            <ProductItem key={product?._id} product={product} />
          ))}
          <a href={`/danh-muc/${product?.category?.slug}`}>Xem thêm</a>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
