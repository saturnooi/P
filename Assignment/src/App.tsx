import React, { useState } from 'react';
import { Button, Card, List, InputNumber, Select, Typography } from 'antd';
const { Option } = Select;
const { Text } = Typography;

interface Item {
  name: string;
  price: number;
  category: string;
}

interface Discount {
  type: string;
  value: number;
  category?: string;
}

const App: React.FC = () => {
  const [items] = useState<Item[]>([
    { name: 'T-Shirt', price: 350, category: 'Clothing' },
    { name: 'Hoodie', price: 700, category: 'Clothing' },
    { name: 'Watch', price: 850, category: 'Electronics' },
    { name: 'Bag', price: 640, category: 'Accessories' }
  ]);
  const [total, setTotal] = useState<number>(2540);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Discount>({ type: '', value: 0 });

  const categories = Array.from(new Set(items.map(item => item.category)));

  const handleDiscountChange = (name: string, value: any) => {
    setNewDiscount({ ...newDiscount, [name]: value });
  };

  const addDiscount = () => {
    if (newDiscount.type && newDiscount.value) {
      setDiscounts([...discounts, newDiscount]);
      setNewDiscount({ type: '', value: 0 });
    }
  };

  const applyDiscounts = () => {
    let newTotal = items.reduce((acc, item) => acc + item.price, 0);
    discounts.forEach(discount => {
      switch (discount.type) {
        case 'percent':
          newTotal -= newTotal * (discount.value / 100);
          break;
        case 'category_percent':
          newTotal -= items.filter(item => item.category === discount.category)
                          .reduce((acc, item) => acc + item.price * (discount.value / 100), 0);
          break;
        case 'points':
          const pointsValue = Math.min(discount.value, newTotal * 0.2);
          newTotal -= pointsValue;
          break;
      }
    });
    setTotal(newTotal);
  };

  return (
    <div className="App" style={{ margin: '2rem' }}>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={items}
        renderItem={item => (
          <List.Item>
            <Card title={item.name}>
              Price: {item.price} THB<br/>
              Category: {item.category}
            </Card>
          </List.Item>
        )}
      />
      <Select defaultValue="" style={{ width: 200, marginBottom: 16 }} onChange={value => handleDiscountChange('type', value)}>
        <Option value="percent">Percentage Discount</Option>
        <Option value="category_percent">Category Percentage Discount</Option>
        <Option value="points">Discount by Points</Option>
      </Select>
      
      {newDiscount.type === 'category_percent' && (
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a category"
          optionFilterProp="children"
          onChange={(value) => handleDiscountChange('category', value)}
          filterOption={(input, option) => {
            if (option?.children) {
              return (option.children as unknown as string).toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        >
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      )}
      
      <InputNumber
        min={0}
        onChange={value => value !== null && handleDiscountChange('value', value)}
        placeholder="Enter discount value"
        style={{ width: '200px', margin: '0 8px' }}
      />
      <Button onClick={addDiscount} type="primary" style={{ margin: '1rem' }}>
        Add Discount
      </Button>
      <Button onClick={applyDiscounts} type="primary" style={{ margin: '1rem' }}>
        Apply Discounts
      </Button>
      <List
        bordered
        dataSource={discounts}
        renderItem={discount => (
          <List.Item>
            <Text>Type: {discount.type}, Value: {discount.value}{discount.category ? `, Category: ${discount.category}` : ''}</Text>
          </List.Item>
        )}
      />
      <h2>Total: {total} THB</h2>
    </div>
  );
};

export default App;
