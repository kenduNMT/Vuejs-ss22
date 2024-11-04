<template>
  <div class="list-product">
    <h2>Quản lý sản phẩm</h2>

    <!-- Form thêm mới sản phẩm -->
    <div class="create-form">
      <h3>Thêm sản phẩm mới</h3>
      <div class="form-group">
        <label>Tên sản phẩm:</label>
        <input
            v-model="newProduct.name"
            type="text"
            class="form-input"
            placeholder="Nhập tên sản phẩm"
        >
      </div>

      <div class="form-group">
        <label>Hình ảnh:</label>
        <input
            v-model="newProduct.image"
            type="text"
            class="form-input"
            placeholder="Nhập URL hình ảnh"
        >
      </div>

      <div class="form-group">
        <label>Giá:</label>
        <input
            v-model.number="newProduct.price"
            type="number"
            class="form-input"
            placeholder="Nhập giá sản phẩm"
        >
      </div>

      <div class="form-group">
        <label>Số lượng:</label>
        <input
            v-model.number="newProduct.quantity"
            type="number"
            class="form-input"
            placeholder="Nhập số lượng"
        >
      </div>

      <button
          @click="createProduct"
          class="btn btn-create"
          :disabled="!isFormValid"
      >
        Thêm sản phẩm
      </button>
    </div>

    <div class="divider"></div>

    <!-- Phần xem, sửa và xóa sản phẩm -->
    <div class="action-section">
      <input
          v-model="productId"
          type="number"
          placeholder="Nhập ID sản phẩm"
          class="id-input"
      >
      <button
          @click="getProductById"
          class="btn btn-detail"
      >
        Get detail
      </button>
      <button
          @click="showUpdateForm"
          class="btn btn-update"
      >
        Update
      </button>
      <button
          @click="confirmDelete"
          class="btn btn-delete"
      >
        Delete
      </button>
    </div>

    <!-- Form cập nhật sản phẩm -->
    <div v-if="isUpdateFormVisible" class="update-form-overlay">
      <div class="update-form">
        <h3>Cập nhật sản phẩm</h3>

        <div class="form-group">
          <label>Tên sản phẩm:</label>
          <input
              v-model="updateProduct.name"
              type="text"
              class="form-input"
              placeholder="Nhập tên sản phẩm"
          >
        </div>

        <div class="form-group">
          <label>Hình ảnh:</label>
          <input
              v-model="updateProduct.image"
              type="text"
              class="form-input"
              placeholder="Nhập URL hình ảnh"
          >
        </div>

        <div class="form-group">
          <label>Giá:</label>
          <input
              v-model.number="updateProduct.price"
              type="number"
              class="form-input"
              placeholder="Nhập giá sản phẩm"
          >
        </div>

        <div class="form-group">
          <label>Số lượng:</label>
          <input
              v-model.number="updateProduct.quantity"
              type="number"
              class="form-input"
              placeholder="Nhập số lượng"
          >
        </div>

        <div class="update-form-buttons">
          <button
              @click="handleUpdate"
              class="btn btn-update"
              :disabled="!isUpdateFormValid"
          >
            Cập nhật
          </button>
          <button
              @click="closeUpdateForm"
              class="btn btn-cancel"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Thông báo kết quả -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import type { Product } from '../types/product';

interface NewProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface UpdateProduct {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default defineComponent({
  name: 'ListProduct',
  setup() {
    const productId = ref<number>(1);
    const message = ref<string>('');
    const messageType = ref<'success' | 'error'>('success');
    const isUpdateFormVisible = ref<boolean>(false);

    const updateProduct = ref<UpdateProduct>({
      name: '',
      image: '',
      price: 0,
      quantity: 0
    });

    const newProduct = ref<NewProduct>({
      id: 0,
      name: '',
      image: '',
      price: 0,
      quantity: 0
    });

    const isUpdateFormValid = computed(() => {
      return updateProduct.value.name.trim() !== '' &&
          updateProduct.value.image.trim() !== '' &&
          updateProduct.value.price > 0 &&
          updateProduct.value.quantity >= 0;
    });

    const getMaxProductId = async (): Promise<number> => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu sản phẩm');
        }
        const products: Product[] = await response.json();
        return Math.max(...products.map(p => p.id), 0);
      } catch (error) {
        console.error('Lỗi khi lấy ID lớn nhất:', error);
        return 0;
      }
    };

    // Kiểm tra form hợp lệ
    const isFormValid = computed(() => {
      return newProduct.value.name.trim() !== '' &&
          newProduct.value.image.trim() !== '' &&
          newProduct.value.price > 0 &&
          newProduct.value.quantity >= 0;
    });

    // Hàm reset form
    const resetForm = () => {
      newProduct.value = {
        id: 0,
        name: '',
        image: '',
        price: 0,
        quantity: 0
      };
    };

    // Hàm hiển thị thông báo
    const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
      message.value = msg;
      messageType.value = type;
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        message.value = '';
      }, 3000);
    };

    // Hàm tạo sản phẩm mới
    const createProduct = async () => {
      try {
        const maxId = await getMaxProductId();
        newProduct.value.id = maxId + 1
        // Log thông tin sản phẩm sẽ tạo
        console.log('Đang tạo sản phẩm mới với thông tin:', newProduct.value);

        // Gọi API tạo sản phẩm
        const response = await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct.value)
        });

        // Kiểm tra response
        if (!response.ok) {
          throw new Error('Lỗi khi tạo sản phẩm');
        }

        // Chuyển đổi response thành JSON
        const createdProduct: Product = await response.json();

        // Log kết quả
        console.log('Sản phẩm đã được tạo thành công:', createdProduct);
        console.log(`
          ID: ${createdProduct.id}
          Tên: ${createdProduct.name}
          Giá: ${createdProduct.price.toLocaleString('vi-VN')} VNĐ
          Số lượng: ${createdProduct.quantity}
          Hình ảnh: ${createdProduct.image}
          ----------------------
        `);

        // Hiển thị thông báo thành công
        showMessage('Tạo sản phẩm thành công');

        // Reset form
        resetForm();

        // Refresh danh sách sản phẩm
        await getAllProducts();

      } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        showMessage('Có lỗi xảy ra khi tạo sản phẩm', 'error');
      }
    };

    const getAllProducts = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:3000/products');

        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu sản phẩm');
        }

        const products: Product[] = await response.json();
        console.log('Danh sách sản phẩm:', products);

        products.forEach(product => {
          console.log(`
            ID: ${product.id}
            Tên: ${product.name}
            Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
            Số lượng: ${product.quantity}
            Hình ảnh: ${product.image}
            ----------------------
          `);
        });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };

    const getProductById = async (): Promise<void> => {
      try {
        if (!productId.value) {
          console.warn('Vui lòng nhập ID sản phẩm');
          return;
        }

        const response = await fetch(`http://localhost:3000/products/${productId.value}`);

        if (response.status === 404) {
          console.log('Không tìm thấy bản ghi');
          return;
        }

        if (!response.ok) {
          throw new Error('Lỗi khi lấy chi tiết sản phẩm');
        }

        const product: Product = await response.json();

        console.log('Chi tiết sản phẩm:');
        console.log(`
          ID: ${product.id}
          Tên: ${product.name}
          Giá: ${product.price.toLocaleString('vi-VN')} VNĐ
          Số lượng: ${product.quantity}
          Hình ảnh: ${product.image}
          ----------------------
        `);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      }
    };

    const updateProductById = async (id: number, productData: UpdateProduct): Promise<void> => {
      try {
        // Log thông tin sản phẩm sẽ cập nhật
        console.log('Đang cập nhật sản phẩm với ID:', id);
        console.log('Thông tin cập nhật:', productData);

        // Gọi API cập nhật sản phẩm
        const response = await fetch(`http://localhost:3000/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });

        // Kiểm tra response
        if (response.status === 404) {
          console.log('Không tìm thấy sản phẩm để cập nhật');
          return;
        }

        if (!response.ok) {
          throw new Error('Lỗi khi cập nhật sản phẩm');
        }

        // Chuyển đổi response thành JSON
        const updatedProduct: Product = await response.json();

        // Log kết quả cập nhật
        console.log('Sản phẩm đã được cập nhật thành công:');
        console.log(`
      ID: ${updatedProduct.id}
      Tên: ${updatedProduct.name}
      Giá: ${updatedProduct.price.toLocaleString('vi-VN')} VNĐ
      Số lượng: ${updatedProduct.quantity}
      Hình ảnh: ${updatedProduct.image}
      ----------------------
    `);

        // Refresh danh sách sản phẩm
        await getAllProducts();

      } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
      }
    };
// Hàm để hiển thị form update
    const showUpdateForm = async () => {
      if (!productId.value) {
        showMessage('Vui lòng nhập ID sản phẩm cần cập nhật', 'error');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/products/${productId.value}`);

        if (response.status === 404) {
          showMessage('Không tìm thấy sản phẩm', 'error');
          return;
        }

        if (!response.ok) {
          throw new Error('Lỗi khi lấy thông tin sản phẩm');
        }

        const product: Product = await response.json();

        // Cập nhật form với thông tin hiện tại của sản phẩm
        updateProduct.value = {
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: product.quantity
        };

        isUpdateFormVisible.value = true;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        showMessage('Có lỗi xảy ra khi lấy thông tin sản phẩm', 'error');
      }
    };

// Hàm đóng form update
    const closeUpdateForm = () => {
      isUpdateFormVisible.value = false;
      updateProduct.value = {
        name: '',
        image: '',
        price: 0,
        quantity: 0
      };
    };

// Hàm xử lý cập nhật
    const handleUpdate = async () => {
      try {
        await updateProductById(productId.value, updateProduct.value);
        showMessage('Cập nhật sản phẩm thành công');
        closeUpdateForm();
      } catch (error) {
        showMessage('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
      }
    };
    // Hàm xác nhận xóa
    const confirmDelete = async () => {
      if (!productId.value) {
        showMessage('Vui lòng nhập ID sản phẩm cần xóa', 'error');
        return;
      }

      const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
      if (confirmed) {
        await removeProductById();
      }
    };

    // Hàm xóa sản phẩm
    const removeProductById = async (): Promise<void> => {
      try {
        // Gọi API xóa sản phẩm với method DELETE
        const response = await fetch(`http://localhost:3000/products/${productId.value}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Xử lý các trường hợp response
        if (response.status === 404) {
          console.log('Không tìm thấy sản phẩm để xóa');
          showMessage('Không tìm thấy sản phẩm để xóa', 'error');
          return;
        }

        if (!response.ok) {
          throw new Error('Lỗi khi xóa sản phẩm');
        }

        // Log kết quả thành công
        console.log(`Đã xóa thành công sản phẩm có ID: ${productId.value}`);
        showMessage('Xóa sản phẩm thành công');

        // Refresh danh sách sản phẩm
        await getAllProducts();

      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        showMessage('Có lỗi xảy ra khi xóa sản phẩm', 'error');
      }
    };

    onMounted(() => {
      console.log('Component đã được mount - Bắt đầu lấy dữ liệu');
      getAllProducts();
    });

    return {
      productId,
      message,
      messageType,
      newProduct,
      isFormValid,
      isUpdateFormVisible,
      updateProduct,
      isUpdateFormValid,
      showUpdateForm,
      closeUpdateForm,
      handleUpdate,
      getAllProducts,
      getProductById,
      confirmDelete,
      removeProductById,
      createProduct,
      updateProductById
    };
  }
});
</script>

<style scoped>
.list-product {
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.action-section {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.id-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: white;
}

.btn-detail {
  background-color: #4CAF50;
}

.btn-detail:hover {
  background-color: #45a049;
}

.btn-delete {
  background-color: #f44336;
}

.btn-delete:hover {
  background-color: #da190b;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.message.success {
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
}

.message.error {
  background-color: #f2dede;
  color: #a94442;
  border: 1px solid #ebccd1;
}
.create-form {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h3 {
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.btn-create {
  background-color: #2196F3;
  width: 100%;
  margin-top: 10px;
}

.btn-create:hover {
  background-color: #1976D2;
}

.btn-create:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background-color: #ddd;
  margin: 20px 0;
}

/* Style cho form layout */
@media (min-width: 768px) {
  .form-group {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    gap: 10px;
  }

  .form-group label {
    margin-bottom: 0;
  }
}
.btn-update {
  background-color: #FF9800;
}

.btn-update:hover {
  background-color: #F57C00;
}

.btn-update:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #9E9E9E;
}

.btn-cancel:hover {
  background-color: #757575;
}

.update-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.update-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.update-form-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .update-form {
    width: 95%;
    padding: 15px;
  }

  .update-form-buttons {
    flex-direction: column;
  }

  .update-form-buttons button {
    width: 100%;
  }
}
</style>