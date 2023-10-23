import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";

export interface ClassifyProps {
  items: { id: string; value: string; child: { id: string; value: string }[] }[];
  setItems: (items: { id: string; value: string; child: { id: string; value: string }[] }[]) => void;
}

const AddItem = ({ items, setItems }: ClassifyProps) => {
  return (
    <div>
      <div className="add-items">
        {new Array(items.length).fill(0).map((_, index) => (
          <AddSubItem key={items[index]?.id} items={items} setItems={setItems} index={index} />
        ))}
        {items[items.length - 1]?.value !== "" && (
          <button
            className="button-more-link"
            onClick={() => {
              if (items[items.length - 1].value === "") return;

              setItems([...items, { id: uuid(), value: "", child: [] }]);
            }}
          >
            Thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default AddItem;

interface SubProps {
  items: { id: string; value: string; child: { id: string; value: string }[] }[];
  setItems: (items: { id: string; value: string; child: { id: string; value: string }[] }[]) => void;
  index: number;
}

const AddSubItem = ({ items, setItems, index }: SubProps) => {
  const [child, setChild] = useState<{ id: string; value: string }[]>([{ id: uuid(), value: "" }]);
  useEffect(() => {
    const newItems = [...items];
    newItems[index].child = child;
    setItems(newItems);
  }, [child]);

  return (
    <div className="list-item-child">
      <input
        className="link-input"
        value={items[index]?.value}
        onChange={(e) => {
          if (e.target.value === "" && items.length > 1) {
            const list = [...items.slice(0, index), ...items.slice(index + 1)];
            setItems(list);
            return;
          }
          const list = [...items];
          list[index].value = e.target.value;
          setItems(list);
        }}
        placeholder="Phân loại"
      />
      <div className="add-item-child">
        {new Array(child.length).fill(0).map((_, index) => (
          <input
            className="link-input"
            key={child[index]?.id}
            value={child[index]?.value}
            onChange={(e) => {
              if (e.target.value === "" && child.length > 1) {
                const list = [...child.slice(0, index), ...child.slice(index + 1)];
                setChild(list);
                return;
              }
              const list = [...child];
              list[index].value = e.target.value;
              setChild(list);
            }}
            placeholder="Phân loại"
          />
        ))}
        {child[child.length - 1]?.value !== "" && (
          <button
            className="button-more-link"
            onClick={() => {
              if (child[child.length - 1].value === "") return;

              setChild([...child, { id: uuid(), value: "" }]);
            }}
          >
            Thêm
          </button>
        )}
      </div>
    </div>
  );
};
