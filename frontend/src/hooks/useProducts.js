import { useCallback, useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getProducts,
  toUserMessage,
} from '../services/apiService';

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

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { products, loading, error, reload: load, addProduct, removeProduct };
}
