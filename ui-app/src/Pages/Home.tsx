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
        },
        {
          to: '/customers',
          title: 'Customers'
        }
      ]
    },
    {
      title: 'HR',
      links: [
        {
          to: '/employees',
          title: 'Employees'
        },
        {
          to: '/departments',
          title: 'Departments'
        },
        {
          to: '/positions',
          title: 'Positions'
        },
        {
          to: '/leave-applications',
          title: 'Leave Applications'
        }
      ]
    }
  ];

  return (
    <HomeLayout>
      <Space align="start">
        {domains.map((domain) => (
          <Menu title={domain.title} key={domain.title}>
            <Menu.Item key="1">
              <Title level={5} style={{ marginBottom: 0 }}>
                {domain.title}
              </Title>
            </Menu.Item>
            {domain.links.map((link) => (
              <Menu.Item key={`${domain.title}_${link.to}`}>
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
