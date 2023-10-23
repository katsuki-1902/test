import { Category } from "@/model/category";
import { Product } from "@/model/product";
import { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uuid } from "uuidv4";
import AddItem from "./addItem";

const getCategory = async () => {
  const categories: Category[] = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/sub-categories`, {
    next: {
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE),
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return [];
    });

  return categories;
};

const AdminProduct = () => {
  const editorRef = useRef<unknown>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product>({
    name: "",
    image: "",
    slug: "",
    category: null as unknown as Category,
    price: 0,
    description: "",
    classify: "",
    isActive: true,
  });

  const [classify, setClassify] = useState<{ id: string; value: string; child: { id: string; value: string }[] }[]>([
    { id: uuid(), value: "", child: [] },
  ]);
  const [listImg, setListImg] = useState<{ id: string; value: string }[]>([{ id: uuid(), value: "" }]);

  useEffect(() => {
    (async () => {
      const categories: Category[] = await getCategory();
      setCategories(categories);
      setProducts({ ...products, category: categories[0] });
    })();
  }, []);

  const handleCreate = async () => {
    if (
      !products.name ||
      !products.price ||
      !products.description ||
      (listImg.length === 1 && listImg[0]?.value == "")
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const NewProduct = {
      ...products,
      image: listImg
        .filter((img) => img.value !== "")
        .map((img) => img.value)
        .join(","),
      classify: JSON.stringify(
        classify
          .filter((classify) => classify.value !== "")
          .filter((classify) => !(classify.child.length == 1 && classify.child[0].value == ""))
          .map((classify) => ({
            name: classify.value,
            child: classify.child.filter((child) => child.value !== "").map((child) => ({ name: child.value })),
          }))
      ),
    };
    if (NewProduct.classify === "[]") {
      NewProduct.classify = "";
    }
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NewProduct),
    })
      .then((res) => res.json())
      .then((res) => {
        setProducts({
          name: "",
          image: "",
          slug: "",
          category: categories[0],
          price: 0,
          description: "",
          isActive: true,
          classify: "",
        });
        setListImg([{ id: uuid(), value: "" }]);
        setClassify([{ id: uuid(), value: "", child: [] }]);
        alert("Tạo mới thành công");
      })
      .catch((err) => {
        console.error(err);
        alert("Tạo mới thất bại, vui lòng kiểm tra lại thông tin sản phẩm");
      });
  };

  return (
    <div className="admin-product-overlay">
      <div className="admin-product">
        <table>
          <tbody>
            <tr>
              <td>Tên sản phẩm</td>
              <td>
                <input
                  placeholder="Tên sản phẩm"
                  type="text"
                  onChange={(e) => {
                    setProducts({ ...products, name: e.target.value });
                  }}
                  value={products?.name}
                />
              </td>
            </tr>
            <tr>
              <td>Hình ảnh</td>

              <td className="img-link">
                {new Array(listImg.length).fill(0).map((_, index) => (
                  <input
                    className="link-input"
                    key={listImg[index]?.id}
                    value={listImg[index]?.value}
                    onChange={(e) => {
                      if (e.target.value === "" && listImg.length > 1) {
                        const list = [...listImg.slice(0, index), ...listImg.slice(index + 1)];
                        setListImg(list);
                        return;
                      }
                      const list = [...listImg];
                      list[index].value = e.target.value;
                      setListImg(list);
                    }}
                    placeholder="Link ảnh"
                  />
                ))}
                {listImg[listImg.length - 1]?.value !== "" && (
                  <button
                    className="button-more-link"
                    onClick={() => {
                      if (listImg[listImg.length - 1].value === "") return;

                      setListImg([...listImg, { id: uuid(), value: "" }]);
                    }}
                  >
                    Thêm
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td>Phân loại</td>

              <td className="img-link">
                <AddItem items={classify} setItems={setClassify} />
              </td>
            </tr>
            <tr>
              <td>Danh mục</td>
              <td>
                <select
                  name=""
                  id=""
                  onChange={(e) => {
                    const category = categories.find((cate) => cate._id === e.target.value);
                    if (category) {
                      setProducts({ ...products, category });
                    }
                  }}
                  value={products?.category?._id}
                >
                  {categories.map((category) => (
                    <option value={category._id} key={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Giá</td>
              <td>
                <input
                  type="number"
                  onChange={(e) => {
                    setProducts({ ...products, price: Number(e.target.value) });
                  }}
                  value={products?.price}
                />
              </td>
            </tr>
            <tr>
              <td>Mô tả</td>
              <td>
                <div className="editor">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onEditorChange={(e) => {
                      setProducts({ ...products, description: e });
                    }}
                    initialValue=" "
                    value={products?.description}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "image",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic underlined forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help" +
                        "link image ",
                      content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <label htmlFor="link-input">
          {listImg
            .filter((img) => img.value !== "")
            .map((img) => (
              <img src={img.value} key={img.id} alt="" />
            ))}
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            setProducts({
              name: "",
              image: "",
              slug: "",
              category: categories[0],
              price: 0,
              description: "",
              isActive: true,
              classify: "",
            });
          }}
        >
          Huỷ
        </button>
        <button
          onClick={() => {
            handleCreate();
          }}
        >
          Tạo mới
        </button>
      </div>
    </div>
  );
};

export default AdminProduct;
