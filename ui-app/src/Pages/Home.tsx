/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react';
import { Menu, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import HomeLayout from '../Layouts/Home';

const { Title } = Typography;
const HomePage: FC = () => {
  const domains = [
    {
      title: 'Item',
      links: [
        {
          to: '/items',
          title: 'Items'
        },
        {
          to: '/item-groups',
          title: 'Item Groups'
        },
        {
          to: '/item-prices',
          title: 'Item Prices'
        },
        {
          to: '/item-brands',
          title: 'Item Brands'
        }
      ]
    },
    {
      title: 'Selling',
      links: [
        {
          to: '/order/new',
          title: 'New Sale'
        },
        {
          to: '/orders',
          title: 'Sale Orders'
        }
      ]
    }
  ];

  return (
    <HomeLayout>
      <Space align="start">
        {domains.map((domain) => (
          <Menu title={domain.title}>
            <Menu.Item key="1">
              <Title level={5} style={{ marginBottom: 0 }}>
                {domain.title}
              </Title>
            </Menu.Item>
            {domain.links.map((link, idx) => (
              <Menu.Item key={`${domain.title}_${idx}`}>
                <Link to={link.to}>{link.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        ))}
      </Space>
    </HomeLayout>
  );
};

export default HomePage;
