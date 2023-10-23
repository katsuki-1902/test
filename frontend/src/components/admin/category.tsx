import CategoryChild from "@/components/categoryChild";
import DeleteButton from "@/components/deleteBtn";
import { Category } from "@/model/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const fetchCategories = async () => {
  const categories: Category[] = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/categories`, {
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
export const deleteCategory = async (slug: string) => {
  const category: Category = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/category/${slug}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return category;
};

const newCategory = async (name: string) => {
  const category: Category = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, level: 1 }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return category;
};

const updateStatus = async (slug: string, isActive: boolean) => {
  const category: Category = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/category-status/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return category;
};

const AdminCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [Categories, setCategories] = useState<Category[]>([]);
  const [reload, setReload] = useState(false);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    fetchCategories().then((categories) => {
      setCategories(categories);
      setSelectedCategory(categories[0]);
    });
  }, [reload]);

  useEffect(() => {
    if (searchParams.has("cate")) {
      const slug = searchParams.get("cate");
      const category = Categories.find((cate) => cate.slug === slug);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [searchParams, Categories]);

  return (
    <div className="admin-category">
      <div className="table">
        <ul>
          <h3>Danh mục</h3>

          {Categories.map((category) => (
            <li
              key={category._id}
              className={category._id === selectedCategory?._id ? "selected" : ""}
              onClick={() => {
                setSelectedCategory(category);
                router.push(`/admin?cate=${category.slug}`);
              }}
            >
              {category.name}
              <div className="actions">
                <div className="check">
                  <input
                    id={category._id}
                    type="checkbox"
                    checked={category.isActive}
                    onChange={(e) => {
                      updateStatus(category.slug, e.target.checked).then(() => {
                        setReload(!reload);
                      });
                    }}
                  />
                  <label htmlFor={category._id}></label>
                </div>
                <DeleteButton
                  propsText="Xoá danh mục đồng thời sẽ xoá toàn bộ danh mục con và sản phẩm đi kèm?"
                  denyText="Huỷ"
                  confirmText="Đồng ý"
                  onConfirm={() => {
                    deleteCategory(category.slug).then(() => {
                      setReload(!reload);
                    });
                  }}
                />
              </div>
            </li>
          ))}
          <li>
            <input
              type="text"
              placeholder="Tên danh mục"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (inputValue) {
                  newCategory(inputValue).then(() => {
                    setInputValue("");
                    setReload(!reload);
                  });
                }
              }}
            >
              Thêm
            </button>
          </li>
        </ul>
        {selectedCategory && (
          <CategoryChild
            category={selectedCategory}
            reload={() => {
              setReload(!reload);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCategory;
