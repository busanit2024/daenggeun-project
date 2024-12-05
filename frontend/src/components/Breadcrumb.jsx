import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  margin-top: 24px;
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  color: #666666;

  & a {
    text-decoration: none;
    margin: 0;
    color: #666666;
  }

  & a:hover {
    text-decoration: underline;
  }

  & span {
    margin-right: 8px;
  }

  &:last-child {
    font-weight: bold;
  }

`;

const Breadcrumb = ({ routes }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BreadcrumbContainer>
      <BreadcrumbItem>
        <Link to="/">홈</Link>
      </BreadcrumbItem>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const route = routes.find((route) => route.path === to);
        return (
          route && (
            <BreadcrumbItem key={to}>
              {index < pathnames.length &&
                <div style={{ margin: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <img height={12} src='/images/icon/arrow_right.svg' alt='arrow-right' />
                </div>
              }
              <Link to={to}>{route.name}</Link>
            </BreadcrumbItem>)
        );
      })}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;