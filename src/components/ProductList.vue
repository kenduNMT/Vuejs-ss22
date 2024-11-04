<!--<template>-->
<!--  <div class="product-list">-->
<!--    <h2>Danh sách sản phẩm</h2>-->

<!--    &lt;!&ndash; Loading state &ndash;&gt;-->
<!--    <div v-if="loading" class="loading">-->
<!--      Đang tải dữ liệu...-->
<!--    </div>-->

<!--    &lt;!&ndash; Error state &ndash;&gt;-->
<!--    <div v-else-if="error" class="error">-->
<!--      {{ error }}-->
<!--    </div>-->

<!--    &lt;!&ndash; Product list &ndash;&gt;-->
<!--    <div v-else class="products">-->
<!--      <table>-->
<!--        <thead>-->
<!--        <tr>-->
<!--          <th>ID</th>-->
<!--          <th>Tên sản phẩm</th>-->
<!--          <th>Hình ảnh</th>-->
<!--          <th>Giá</th>-->
<!--          <th>Số lượng</th>-->
<!--          <th>Thao tác</th>-->
<!--        </tr> -->
<!--        </thead>-->
<!--        <tbody>-->
<!--        <tr v-for="product in products" :key="product.id">-->
<!--          <td>{{ product.id }}</td>-->
<!--          <td>{{ product.name }}</td>-->
<!--          <td><img :src="product.image" :alt="product.name" class="product-image"></td>-->
<!--          <td>{{ formatPrice(product.price) }}</td>-->
<!--          <td>{{ product.quantity }}</td>-->
<!--          <td>-->
<!--            <button @click="editProduct(product)">Sửa</button>-->
<!--            <button @click="deleteProduct(product.id)">Xóa</button>-->
<!--          </td>-->
<!--        </tr>-->
<!--        </tbody>-->
<!--      </table>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { defineComponent, onMounted, ref } from 'vue';-->
<!--import { Product } from '../types/product';-->
<!--import { productService } from '../services/productService';-->

<!--export default defineComponent({-->
<!--  name: 'ProductList',-->
<!--  setup() {-->
<!--    const products = ref<Product[]>([]);-->
<!--    const loading = ref(true);-->
<!--    const error = ref<string | null>(null);-->

<!--    const loadProducts = async () => {-->
<!--      try {-->
<!--        loading.value = true;-->
<!--        products.value = await productService.getProducts();-->
<!--      } catch (err) {-->
<!--        error.value = 'Có lỗi xảy ra khi tải danh sách sản phẩm';-->
<!--        console.error(err);-->
<!--      } finally {-->
<!--        loading.value = false;-->
<!--      }-->
<!--    };-->

<!--    const formatPrice = (price: number): string => {-->
<!--      return new Intl.NumberFormat('vi-VN', {-->
<!--        style: 'currency',-->
<!--        currency: 'VND'-->
<!--      }).format(price);-->
<!--    };-->

<!--    const deleteProduct = async (id: number) => {-->
<!--      if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {-->
<!--        try {-->
<!--          await productService.deleteProduct(id);-->
<!--          await loadProducts();-->
<!--        } catch (err) {-->
<!--          error.value = 'Có lỗi xảy ra khi xóa sản phẩm';-->
<!--          console.error(err);-->
<!--        }-->
<!--      }-->
<!--    };-->

<!--    onMounted(loadProducts);-->

<!--    return {-->
<!--      products,-->
<!--      loading,-->
<!--      error,-->
<!--      formatPrice,-->
<!--      deleteProduct-->
<!--    };-->
<!--  }-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--.product-list {-->
<!--  padding: 20px;-->
<!--}-->

<!--table {-->
<!--  width: 100%;-->
<!--  border-collapse: collapse;-->
<!--}-->

<!--th, td {-->
<!--  padding: 10px;-->
<!--  border: 1px solid #ddd;-->
<!--  text-align: left;-->
<!--}-->

<!--.product-image {-->
<!--  max-width: 100px;-->
<!--  height: auto;-->
<!--}-->

<!--.loading, .error {-->
<!--  padding: 20px;-->
<!--  text-align: center;-->
<!--}-->

<!--.error {-->
<!--  color: red;-->
<!--}-->

<!--button {-->
<!--  margin: 0 5px;-->
<!--  padding: 5px 10px;-->
<!--  cursor: pointer;-->
<!--}-->
<!--</style>-->