import ProductItem from "@/components/productItem";
import { Product } from "@/model/product";
import Link from "next/link";

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const limit = searchParams?.limit ? Number(searchParams.limit) : 8;
  const offset = (page - 1) * limit;
  const products: Product[] = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/category/${params.category}?limit=${limit}&offset=${offset}&isActive=true`,
    {
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });
  const productsCount: { count: number } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/category/${params.category}/count?isActive=true`,
    {
      next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return { count: 0 };
    });
  return (
    <div>
      <div className="category-product">
        {/* <div className="search">
          <input type="text" placeholder="Tìm kiếm sản phẩm" />
          <button>
            Timf
          </button>
        </div> */}
        <div className="product-list">
          {products?.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
        <div className="pagination">
          {Array(Math.ceil(productsCount.count / 8))
            .fill(0)
            .map((_, index) => (
              <a
                href={index === 0 ? `/danh-muc/${params.category}` : `/danh-muc/${params.category}?page=${index + 1}`}
                key={index}
                className={index + 1 === page ? "active" : ""}
              >
                {index + 1}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
