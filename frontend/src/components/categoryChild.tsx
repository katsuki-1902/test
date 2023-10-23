import { Category } from "@/model/category";
import { useState } from "react";
import DeleteButton from "./deleteBtn";
import { deleteCategory } from "@/components/admin/category";

const fetchCategories = async (slug: string, child: Category[]) => {
  const category: Category = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/category/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ child }),
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
const newCategory = async (name: string) => {
  const category: Category = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, level: 2 }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return category;
};

const CategoryChild = ({
  category,
  reload,
}: {
  category: Category;

  reload: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <ul>
      <h3>Danh mục con</h3>
      {category?.child?.map((cate) => (
        <li key={cate._id}>
          {cate.name}
          <div className="actions">
            <div className="check">
              <input
                id={cate._id}
                type="checkbox"
                checked={cate.isActive}
                onChange={(e) => {
                  updateStatus(cate.slug, e.target.checked).then(() => {
                    reload();
                  });
                }}
              />
              <label htmlFor={cate._id}></label>
            </div>
            <DeleteButton
              propsText="Xoá danh mục đồng thời sẽ xoá toàn bộ danh mục con và sản phẩm đi kèm?"
              denyText="Huỷ"
              confirmText="Đồng ý"
              onConfirm={() => {
                deleteCategory(cate.slug).then(() => {
                  reload();
                });
              }}
            />
          </div>
        </li>
      ))}
      <li>
        <input
          type="text"
          value={inputValue}
          placeholder="Tên danh mục con"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (inputValue) {
              newCategory(inputValue).then((newCate) => {
                if (newCate) {
                  fetchCategories(category.slug, [...category.child, newCate]).then(() => {
                    setInputValue("");
                    reload();
                  });
                }
              });
            }
          }}
        >
          Thêm
        </button>
      </li>
    </ul>
  );
};

export default CategoryChild;
