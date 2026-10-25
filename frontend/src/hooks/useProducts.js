import { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  toUserMessage,
} from "../services/apiService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = useCallback(async (data) => {
    const created = await createProduct(data);
    setProducts((prev) => [created, ...prev]);
    return created;
  }, []);

  const editProduct = useCallback(async (id, data) => {
    const updated = await updateProduct(id, data);

    setProducts((prev) =>
      prev.map((product) => (product.id === updated.id ? updated : product)),
    );

    return updated;
  }, []);

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  }, []);

  return {
    products,
    loading,
    error,
    reload: load,
    addProduct,
    editProduct,
    removeProduct,
  };
}
