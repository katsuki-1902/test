import ProductItem from "@/components/productItem";
import { Product } from "@/model/product";

const SearchPage = async ({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = 8;
  const offset = (page - 1) * limit;
  const products: Product[] = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products?key=${searchParams.key}&limit=${limit}&offset=${offset}`,
    {
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });

  const productCount: { count: number } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products/count?key=${searchParams.key}`,
    {
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return { count: 0 };
    });
  return (
    <div>
      {products.length === 0 ? (
        <div className="title">Không tìm thấy sản phẩm</div>
      ) : (
        <h1 className="title">Sản phẩm chứa từ khóa: {searchParams.key}</h1>
      )}
      <div className="product-list">
        {products?.map((product) => (
          <ProductItem product={product} key={product._id} />
        ))}
      </div>
      <div
        className="pagination"
        style={{
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {Array(Math.ceil(productCount.count / limit))
          .fill(0)
          .map((_, index) => (
            <a
              href={
                index === 0 ? `/search?key=${searchParams.key}` : `/search?key=${searchParams.key}&page=${index + 1}`
              }
              key={index}
              className={index + 1 === page ? "active" : ""}
            >
              {index + 1}
            </a>
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
