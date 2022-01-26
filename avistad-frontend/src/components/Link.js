import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MyLink = styled.text`
    background-color: white;
    color: black;
    font-size: 20px;
    padding: 10px 60px;
    border-radius: 5px;
    margin: 10px 0px;
    cursor: pointer;
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
`;

const Link = ({ text, onClick }) => (
    <MyLink onClick={onClick}>
        {text}
    </MyLink>
);

Link.defaultProps = {
    onClick: null
};

Link.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default Link;